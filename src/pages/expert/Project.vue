<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { getRole, getTPrefix } from '@/utils/user'
import { ExpertTeamsResponse } from '@/types/user'
import { onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { userService } from '@/services/userService'
import { SubmissionDTO } from '@/types/submission'
import { submissionService } from '@/services/submissionService'
import { TeamDTO } from '@/types/team'
import { S3BucketService } from '@/services/s3BucketService'
import { computed } from 'vue'
import { UserRole } from '@/types/roles'

const authStore = useAuthStore()

const role = getRole()
const tPrefix = getTPrefix(role, true)
const loading = ref(false)
const uploading = ref(false)
const evaluating = ref(false)

// Form data pour l'évaluation
const grade = ref<number | null>(null)
const comment = ref('')
const evaluationFile = ref<File | null>(null)

const userInfo = ref<ExpertTeamsResponse | null>(null)
const teamInfo = ref<TeamDTO | null>(null)
const submissionInfo = ref<SubmissionDTO | null>(null)
const teamsList = ref<TeamDTO[]>([])
const selectedIndex = ref(0)

// Évaluation du jury connecté
const currentJuryEvaluation = computed(() => {
  if (!submissionInfo.value?.evaluations || !authStore.user?.id) return null
  return submissionInfo.value.evaluations.find(
    (evaluation) => evaluation.juryId === authStore.user?.id
  )
})

// Évaluation du mentor connecté
const currentMentorEvaluation = computed(() => {
  if (!submissionInfo.value?.comments || !authStore.user?.id) return null
  return submissionInfo.value.comments.find(
    (comment) => comment.mentorId === authStore.user?.id
  )
})

const loadSubmission = async (teamId: string) => {
  try {
    loading.value = true
    const submissionResponse = await submissionService.getbyTeamId(teamId) as SubmissionDTO | null
    submissionInfo.value = submissionResponse
  } catch (err) {
    submissionInfo.value = null
    console.error('Error loading submission:', err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (authStore.user?.id) {
    try {
      loading.value = true
      const userResponse = await userService.getExpertTeamsById(authStore.user.id)
      userInfo.value = userResponse
      if (!userResponse) return

      // Récupération des équipes selon le rôle
      if (userResponse.juryTeams?.length) {
        teamsList.value = userResponse.juryTeams
      } else if (userResponse.mentorTeams?.length) {
        teamsList.value = userResponse.mentorTeams
      }

      // Sélection par défaut
      if (teamsList.value.length > 0) {
        teamInfo.value = teamsList.value[0]
        await loadSubmission(teamInfo.value.id)
        loadExistingEvaluation()
      }
    } catch (err) {
      console.error('Error fetching user data:', err)
    } finally {
      loading.value = false
    }
  }
})

// Quand on change d'équipe via le carrousel
watch(selectedIndex, async (newIndex) => {
  const newTeam = teamsList.value[newIndex]
  if (newTeam) {
    teamInfo.value = newTeam
    await loadSubmission(newTeam.id)
    // Pré-remplir le formulaire si une évaluation existe déjà
    loadExistingEvaluation()
  }
})

const loadExistingEvaluation = () => {
  if (currentJuryEvaluation.value) {
    grade.value = currentJuryEvaluation.value.grade
    comment.value = currentJuryEvaluation.value.comment || ''
  } else {
    grade.value = null
    comment.value = ''
    evaluationFile.value = null
  }
}

const downloadSubmissionFile = async () => {
  if (!submissionInfo.value?.submissionFilePath) return
  try {
    const { url } = await S3BucketService.getFileUrl('submissions', submissionInfo.value.submissionFilePath)
    window.open(url, '_blank')
  } catch (error) {
    console.error('Error downloading file:', error)
  }
}

const downloadEvaluationGrid = async () => {
  try {
    // Télécharge le template de grille de notation
    const { url } = await S3BucketService.getFileUrl('templates', 'grille-notation.pdf')
    window.open(url, '_blank')
  } catch (error) {
    console.error('Error downloading evaluation grid:', error)
  }
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    evaluationFile.value = target.files[0]
  }
}

const uploadEvaluationFile = async (): Promise<string | null> => {
  if (!evaluationFile.value) return null
  
  try {
    uploading.value = true
    const filename = await S3BucketService.uploadFile(evaluationFile.value, 'evaluations')
    return filename.path
  } catch (error) {
    console.error('Error uploading evaluation file:', error)
    return null
  } finally {
    uploading.value = false
  }
}

const submitEvaluation = async () => {
  if (!submissionInfo.value?.id || grade.value === null || grade.value < 0 || grade.value > 20) {
    alert('Veuillez remplir tous les champs obligatoires')
    return
  }

  try {
    evaluating.value = true
    
    // Upload du fichier d'évaluation si présent
    let evaluationFilePath = ''
    if (evaluationFile.value) {
      const uploadedPath = await uploadEvaluationFile()
      if (!uploadedPath) {
        alert('Erreur lors de l\'upload du fichier')
        return
      }
      evaluationFilePath = uploadedPath
    }

    // Soumission de l'évaluation
    const updatedSubmission = await submissionService.evaluate(
      submissionInfo.value.id,
      grade.value,
      comment.value,
      evaluationFilePath
    )

    submissionInfo.value = updatedSubmission
    
    // Reset du formulaire
    grade.value = null
    comment.value = ''
    evaluationFile.value = null
    
    // Reload the page to reflect the updated evaluation
    window.location.reload()
    
    // alert('Évaluation soumise avec succès !')
  } catch (error) {
    console.error('Error submitting evaluation:', error)
    alert('Erreur lors de la soumission de l\'évaluation')
  } finally {
    evaluating.value = false
  }
}

const submitComment = async () => {
  if (!submissionInfo.value?.id) {
    alert('Veuillez remplir tous les champs obligatoires')
    return
  }

  try {
    evaluating.value = true

    // Soumission du commentaire
    const updatedSubmission = await submissionService.comment(
      submissionInfo.value.id,
      comment.value
    )

    submissionInfo.value = updatedSubmission

    // Reset du formulaire
    comment.value = ''

    // Reload the page to reflect the updated comment
    window.location.reload()
  } catch (error) {
    console.error('Error submitting comment:', error)
    alert('Erreur lors de la soumission du commentaire')
  } finally {
    evaluating.value = false
  }
}
</script>

<template>
  <v-container class="py-10">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold">{{ t(`${tPrefix}.nav.projects`) }}</h1>

      <!-- Carrousel de sélection d'équipe -->
      <div v-if="teamsList.length >= 1" class="flex items-center space-x-2">
        <v-btn
          icon="mdi-chevron-left"
          variant="text"
          :disabled="selectedIndex === 0"
          @click="selectedIndex--"
        />
        <span class="font-semibold">{{ teamInfo?.name || '-' }}</span>
        <v-btn
          icon="mdi-chevron-right"
          variant="text"
          :disabled="selectedIndex === teamsList.length - 1"
          @click="selectedIndex++"
        />
      </div>
    </div>

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

    <!-- Bloc principal - Soumission -->
    <v-card class="pa-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">
        {{ t(`${tPrefix}.submission.project`) }} : {{ teamInfo?.name || '-' }}
      </h2>

      <v-row class="mb-4">
        <v-col cols="12">
          <h3>
            <span v-if="submissionInfo?.githubLink">
              <a
                :href="submissionInfo.githubLink"
                target="_blank"
                rel="noopener noreferrer"
                style="color: #1e88e5; text-decoration: underline;"
              >
                {{ submissionInfo.githubLink }}
              </a>
            </span>
            <span v-else>{{ t(`${tPrefix}.submission.noGithubLink`) }}</span>
          </h3>
        </v-col>
      </v-row>

      <v-alert
        v-if="submissionInfo?.submissionFilePath"
        type="success"
        variant="tonal"
        class="mt-4"
      >
        <v-row align="center">
          <v-col cols="auto">
            <v-icon>mdi-file-check</v-icon>
          </v-col>
          <v-col>
            {{ t(`${tPrefix}.submission.fileUploaded`) }} :
            {{ submissionInfo.submissionFilePath.split('/').pop() }}
          </v-col>
          <v-col cols="auto">
            <v-btn
              variant="outlined"
              size="small"
              prepend-icon="mdi-download"
              @click="downloadSubmissionFile"
            >
              {{ t(`${tPrefix}.submission.download`) }}
            </v-btn>
          </v-col>
        </v-row>
      </v-alert>
    </v-card>

    <!-- Bloc secondaire pour Jury - Evaluation et commentaire -->
    <v-card v-if="role === UserRole.JURY" class="pa-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">
        {{ t(`${tPrefix}.submission.title`) }}
      </h2>

      <!-- Téléchargement de la grille de notation -->
      <v-row class="mb-4">
        <v-col cols="12">
          <v-btn
            variant="outlined"
            prepend-icon="mdi-download"
            color="primary"
            @click="downloadEvaluationGrid"
          >
            {{ t(`${tPrefix}.submission.downloadGrid`) }}
          </v-btn>
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <!-- Formulaire d'évaluation -->
      <v-form v-if="!currentJuryEvaluation" @submit.prevent="submitEvaluation">
        <v-row>
          <!-- Note -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="grade"
              :label="t(`${tPrefix}.submission.grade`)"
              type="number"
              min="0"
              max="20"
              step="0.5"
              variant="outlined"
              required
              :disabled="evaluating"
            />
          </v-col>

          <!-- Upload de la grille remplie -->
          <v-col cols="12" md="6">
            <v-file-input
              :label="t(`${tPrefix}.submission.uploadGrid`)"
              variant="outlined"
              prepend-icon="mdi-paperclip"
              accept=".pdf,.doc,.docx"
              :disabled="uploading || evaluating"
              @change="handleFileUpload"
            >
              <template v-if="evaluationFile" #append>
                <v-icon color="success">mdi-check-circle</v-icon>
              </template>
            </v-file-input>
          </v-col>

          <!-- Commentaire -->
          <v-col cols="12">
            <v-textarea
              v-model="comment"
              :label="t(`${tPrefix}.submission.comment`)"
              variant="outlined"
              rows="4"
              :disabled="evaluating"
            />
          </v-col>

          <!-- Bouton de soumission -->
          <v-col cols="12">
            <v-btn
              type="submit"
              color="primary"
              size="large"
              :loading="evaluating || uploading"
              :disabled="grade === null"
            >
              {{ t(`${tPrefix}.submission.submit`) }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>

      <!-- Affichage de l'évaluation du jury connecté -->
      <v-divider v-if="currentJuryEvaluation" class="my-6" />
      
      <v-alert
        v-if="currentJuryEvaluation"
        type="info"
        variant="tonal"
      >
        <v-row>
          <v-col cols="12">
            <strong>{{ t(`${tPrefix}.submission.yourGrade`) }} :</strong> {{ currentJuryEvaluation.grade }}/20
          </v-col>
          <v-col v-if="currentJuryEvaluation.comment" cols="12">
            <strong>{{ t(`${tPrefix}.submission.yourComment`) }} :</strong> {{ currentJuryEvaluation.comment }}
          </v-col>
          <v-col v-if="currentJuryEvaluation.evaluationFilePath" cols="12">
            <strong>{{ t(`${tPrefix}.submission.yourFile`) }} :</strong> 
            {{ currentJuryEvaluation.evaluationFilePath.split('/').pop() }}
          </v-col>
        </v-row>
      </v-alert>
    </v-card>

    <!-- Bloc secondaire pour Mentor - Commentaire -->
    <v-card v-if="role === UserRole.MENTOR" class="pa-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">
        {{ t(`${tPrefix}.submission.title`) }}
      </h2>

      <v-form v-if="!currentMentorEvaluation" @submit.prevent="submitComment">
        <v-row>
          <!-- Commentaire -->
          <v-col cols="12">
            <v-textarea
              v-model="comment"
              :label="t(`${tPrefix}.submission.comment`)"
              variant="outlined"
              rows="4"
              :disabled="evaluating"
            />
          </v-col>

          <!-- Bouton de soumission -->
          <v-col cols="12">
            <v-btn
              type="submit"
              color="primary"
              size="large"
              :loading="evaluating || uploading"
              :disabled="comment === null"
            >
              {{ t(`${tPrefix}.submission.submit`) }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>

      <v-divider v-if="currentMentorEvaluation" class="my-6" />
      
      <v-alert
        v-if="currentMentorEvaluation"
        type="info"
        variant="tonal"
      >
        <v-row>
          <v-col v-if="currentMentorEvaluation.content" cols="12">
            <strong>{{ t(`${tPrefix}.submission.yourComment`) }} :</strong> {{ currentMentorEvaluation.content }}
          </v-col>
        
        </v-row>
      </v-alert>
    </v-card>
  </v-container>
</template>