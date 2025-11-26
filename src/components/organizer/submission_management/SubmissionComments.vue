<script setup lang="ts">
import { defineProps } from 'vue'
import { SubmissionDTO } from '@/types/submission'
import { SubmissionStatus } from '@/types/submission_status'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  submission: SubmissionDTO
}>()

const getPendingJuries = () => {
  if (!props.submission.juries) return []
  return props.submission.juries.filter(
    jury => !props.submission.comments.some(c => c.userId === jury.id)
  )
}
</script>

<template>
  <div v-if="submission.comments && submission.comments.length > 0">
    <div
      v-for="(comment, index) in submission.comments"
      :key="index"
      class="mb-3 p-2 border rounded bg-gray-50"
    >
      <div class="flex justify-between items-center mb-1 max-w-full">
        <div class="font-medium">
          • {{ comment.userName }}
          <span v-if="comment.role === 'JURY'" class="text-xs text-gray-600">(Jury)</span>
          <span v-else class="text-xs text-gray-600">(Mentor)</span>
        </div>

        <a
          v-if="comment.role === 'JURY' && comment.evaluationFilePath"
          :href="comment.evaluationFilePath"
          download
          :title="t('organizer.submissionManagement.downloadEvaluation')"
          class="text-blue-600 hover:underline text-sm flex items-center gap-1"
        >
          <v-icon small>mdi-download</v-icon>
        </a>
      </div>

      <div class="text-sm text-gray-700 mb-1">{{ comment.content }}</div>

      <div v-if="comment.role === 'JURY' && comment.grade !== undefined" class="text-xs text-gray-500">
        {{ t('organizer.submissionManagement.grade') }}: {{ comment.grade }}/20
      </div>

      <div class="text-xs text-gray-400 mt-1">
        {{ new Date(comment.createdAt).toLocaleDateString() }}
      </div>
    </div>
  </div>

  <!-- Pending juries -->
  <div v-if="submission.status === SubmissionStatus.PENDING && getPendingJuries().length > 0" class="mt-2">
    <div class="text-sm text-red-600">
      {{ t('organizer.submissionManagement.pendingJury') }}
      <span
        v-for="(jury, index) in getPendingJuries()"
        :key="index"
        class="font-medium"
      >
        {{ jury.firstname }} {{ jury.lastname }}<span v-if="index < getPendingJuries().length - 1">, </span>
      </span>
    </div>
  </div>

  <div v-if="(!submission.comments || submission.comments.length === 0) && getPendingJuries().length === 0" class="text-gray-500 italic">
    {{ t('organizer.submissionManagement.noComments') }}
  </div>
</template>
