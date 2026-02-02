<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { SubmissionDTO } from '@/types/submission'
import { HackathonMediaDTO } from '@/types/config'
import { S3BucketService } from '@/services/s3BucketService'
import { submissionService } from '@/services/submissionService'
import { usePhaseStore } from '@/stores/phase'

const { t } = useI18n()
const authStore = useAuthStore()
const phaseStore = usePhaseStore()

const props = defineProps<{
  submissionInfo: SubmissionDTO | null
  tPrefix: string
  mediaSettings: HackathonMediaDTO
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

onMounted(() => {
  phaseStore.fetchPhases()
})

const isEvaluationPhase = computed(() => phaseStore.currentPhase?.order === 5)

const grade = ref<number | null>(null)
const comment = ref('')
const evaluationFile = ref<File | null>(null)
const uploading = ref(false)
const evaluating = ref(false)
const showConfirmationDialog = ref(false)

// Évaluation du jury connecté
const currentJuryEvaluation = computed(() => {
  if (!props.submissionInfo?.evaluations || !authStore.user?.id) return null
  return props.submissionInfo.evaluations.find(
    (evaluation) => evaluation.juryId === authStore.user?.id
  )
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

watch(() => props.submissionInfo, loadExistingEvaluation, { immediate: true })

const downloadEvaluationGrid = async () => {
  try {
    if (!props.mediaSettings.evaluationGridPath) return
    const { url } = await S3BucketService.getFileUrlPublic('public_files', props.mediaSettings.evaluationGridPath)
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
  if (!props.submissionInfo?.id || grade.value === null || grade.value < 0 || grade.value > 20) {
    alert('Veuillez remplir tous les champs obligatoires')
    return
  }
  showConfirmationDialog.value = true
}

const confirmSubmission = async () => {
  showConfirmationDialog.value = false
  if (!props.submissionInfo?.id || grade.value === null) return

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
    await submissionService.evaluate(
      props.submissionInfo.id,
      grade.value,
      comment.value,
      evaluationFilePath
    )

    // Reset du formulaire
    grade.value = null
    comment.value = ''
    evaluationFile.value = null
    
    emit('refresh')
  } catch (error) {
    console.error('Error submitting evaluation:', error)
    alert('Erreur lors de la soumission de l\'évaluation')
  } finally {
    evaluating.value = false
  }
}
</script>

<template>
  <v-card class="pa-6 mb-6">
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
            :disabled="evaluating || !isEvaluationPhase"
          />
        </v-col>

        <!-- Upload de la grille remplie -->
        <v-col cols="12" md="6">
          <v-file-input
            :label="t(`${tPrefix}.submission.uploadGrid`)"
            variant="outlined"
            prepend-icon="mdi-paperclip"
            accept=".pdf,.doc,.docx"
            :disabled="uploading || evaluating || !isEvaluationPhase"
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
            :disabled="evaluating || !isEvaluationPhase"
          />
        </v-col>

        <!-- Bouton de soumission -->
        <v-col cols="12">
          <v-btn
            type="submit"
            color="primary"
            size="large"
            :loading="evaluating || uploading"
            :disabled="grade === null || !isEvaluationPhase"
          >
            {{ t(`${tPrefix}.submission.submit`) }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-alert
      v-if="!isEvaluationPhase && !currentJuryEvaluation"
      type="warning"
      variant="tonal"
      class="mt-6"
    >
      {{ t(`${tPrefix}.submission.phaseClosed`) }}
    </v-alert>

    <!-- Modal de confirmation -->
    <v-dialog v-model="showConfirmationDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">
          {{ t(`${tPrefix}.submission.confirmation.title`) }}
        </v-card-title>
        
        <v-card-text>
          <p class="mb-4">{{ t(`${tPrefix}.submission.confirmation.text`) }}</p>
          
          <div class="bg-grey-lighten-4 pa-4 rounded">
            <p><strong>{{ t(`${tPrefix}.submission.confirmation.grade`) }}</strong> {{ grade }}/20</p>
            <p v-if="comment"><strong>{{ t(`${tPrefix}.submission.confirmation.comment`) }}</strong> {{ comment }}</p>
            <p>
              <strong>{{ t(`${tPrefix}.submission.confirmation.file`) }}</strong> 
              {{ evaluationFile ? evaluationFile.name : t(`${tPrefix}.submission.confirmation.noFile`) }}
            </p>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="showConfirmationDialog = false"
          >
            {{ t(`${tPrefix}.submission.confirmation.cancel`) }}
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            :loading="evaluating || uploading"
            @click="confirmSubmission"
          >
            {{ t(`${tPrefix}.submission.confirmation.confirm`) }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
</template>
