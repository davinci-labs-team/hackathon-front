<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { SubmissionDTO } from '@/types/submission'
  import { usePagination } from '@/composables/usePagination'
  import { computed, toRef } from 'vue'
  import { SubmissionStatus } from '@/types/submission_status'
  import { ThemesDTO } from '@/types/config'
  import SubmissionComments from './SubmissionComments.vue'

  const { t } = useI18n()

  const props = defineProps<{
    themes: ThemesDTO[]
    submissions: SubmissionDTO[]
    itemsPerPage?: number
  }>()

  const submissionsRef = toRef(props, 'submissions')

  const { currentPage, totalPages, paginatedItems, goToPage } = usePagination(
    submissionsRef,
    props.itemsPerPage || 10
  )

  const getStatus = computed(() => {
    return (status: SubmissionStatus) => {
      switch (status) {
        case SubmissionStatus.GRADED:
          return t('organizer.submissionManagement.status.graded')
        case SubmissionStatus.PENDING:
          return t('organizer.submissionManagement.status.pending')
        case SubmissionStatus.NOT_SUBMITTED:
          return t('organizer.submissionManagement.status.notSubmitted')
        default:
          return status
      }
    }
  })

  const getSubject = (subjectId: string) => {
    for (const theme of props.themes) {
      const subject = theme.subjects.find((subj) => subj.id === subjectId)
      if (subject) {
        return subject.name
      }
    }
    return ''
  }

  const getTheme = (subjectId: string) => {
    for (const theme of props.themes) {
      const subject = theme.subjects.find((subj) => subj.id === subjectId)
      if (subject) {
        return theme.name
      }
    }
    return ''
  }
</script>

<template>
  <div class="bg-white border rounded-lg overflow-x-auto">
    <table class="min-w-full text-sm">
      <thead>
        <tr class="border-b">
          <th class="px-4 py-2 text-left font-semibold">
            {{ t('organizer.submissionManagement.team') }}
          </th>
          <th class="px-4 py-2 text-center font-semibold">
            {{ t('organizer.submissionManagement.themeAndSubject') }}
          </th>
          <th class="px-4 py-2 text-center font-semibold">
            {{ t('organizer.submissionManagement.status.label') }}
          </th>
          <th class="px-4 py-2 text-center font-semibold">
            {{ t('organizer.submissionManagement.grade') }}
          </th>
          <th class="px-4 py-2 text-center font-semibold">
            {{ t('organizer.submissionManagement.comments') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="submission in paginatedItems"
          :key="submission.id"
          class="border-b hover:bg-gray-50"
        >
          <td class="px-4 py-3">
            <div class="font-medium">{{ submission.teamName }}</div>
          </td>
          <td class="px-4 py-3 text-center">
            <div class="font-medium">
              {{ getTheme(submission.subjectId) }}
            </div>
            <div class="text-sm text-gray-600">
              {{ getSubject(submission.subjectId) }}
            </div>
          </td>
          <td class="px-4 py-3 text-center">
            <v-chip
              variant="flat"
              :color="
                submission.status === SubmissionStatus.GRADED
                  ? 'green lighten-4'
                  : submission.status === SubmissionStatus.PENDING
                    ? 'warning'
                    : 'red'
              "
              small
            >
              <span class="block whitespace-pre-line leading-snug">
                {{ getStatus(submission.status) }}
              </span>
            </v-chip>
          </td>
          <td class="px-4 py-3 text-center">
            <div v-if="submission.grade !== null" class="font-medium">
              {{ submission.grade }} / 20
            </div>
            <div v-else class="text-gray-500 italic">
              {{ t('organizer.submissionManagement.noGrade') }}
            </div>
          </td>
          <td class="px-4 py-3 text-left">
            <SubmissionComments :submission="submission" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-6">
    <v-btn
      icon="mdi-chevron-left"
      :disabled="currentPage === 1"
      @click="goToPage(currentPage - 1)"
    ></v-btn>
    <v-btn
      v-for="n in totalPages"
      :key="n"
      :variant="n === currentPage ? 'flat' : 'text'"
      color="primary"
      @click="goToPage(n)"
    >
      {{ n }}
    </v-btn>
    <v-btn
      icon="mdi-chevron-right"
      :disabled="currentPage === totalPages"
      @click="goToPage(currentPage + 1)"
    ></v-btn>
  </div>
</template>
