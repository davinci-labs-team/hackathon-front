<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { SubmissionDTO } from '@/types/submission'
import { submissionService } from '@/services/submissionService'
import { usePhaseStore } from '@/stores/phase'

const { t } = useI18n()
const authStore = useAuthStore()
const phaseStore = usePhaseStore()

const props = defineProps<{
  submissionInfo: SubmissionDTO | null
  tPrefix: string
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

onMounted(() => {
  phaseStore.fetchPhases()
})

const isEvaluationPhase = computed(() => phaseStore.currentPhase?.order === 5)

const comment = ref('')
const evaluating = ref(false)

// Évaluation du mentor connecté
const currentMentorEvaluation = computed(() => {
  if (!props.submissionInfo?.comments || !authStore.user?.id) return null
  return props.submissionInfo.comments.find(
    (comment) => comment.mentorId === authStore.user?.id
  )
})

const submitComment = async () => {
  if (!props.submissionInfo?.id) {
    alert('Veuillez remplir tous les champs obligatoires')
    return
  }

  try {
    evaluating.value = true

    // Soumission du commentaire
    await submissionService.comment(
      props.submissionInfo.id,
      comment.value
    )

    // Reset du formulaire
    comment.value = ''

    emit('refresh')
  } catch (error) {
    console.error('Error submitting comment:', error)
    alert('Erreur lors de la soumission du commentaire')
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

    <v-form v-if="!currentMentorEvaluation" @submit.prevent="submitComment">
      <v-row>
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
            :loading="evaluating"
            :disabled="comment === null || !isEvaluationPhase"
          >
            {{ t(`${tPrefix}.submission.submit`) }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-alert
      v-if="!isEvaluationPhase && !currentMentorEvaluation"
      type="warning"
      variant="tonal"
      class="mt-6"
    >
      {{ t(`${tPrefix}.submission.phaseClosed`) }}
    </v-alert>

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
</template>
