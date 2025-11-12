<script setup lang="ts">
  import { ref, computed, } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { SubmissionStatus } from '@/types/submission_status';

  const props = defineProps({
    selectedSubmissionStatus: { type: String, default: '' },
    selectedJury: { type: String, default: '' },
    selectedMentor: { type: String, default: '' },
    filterName: { type: String, default: '' },
    mentorsOptions: { type: Array as () => Array<{ title: string; value: string }>, default: () => [] },
    juriesOptions: { type: Array as () => Array<{ title: string; value: string }>, default: () => [] },
  })

  const emit = defineEmits([
    'update:selectedSubmissionStatus',
    'update:selectedJury',
    'update:selectedMentor',
    'update:filterName',
  ])

  const { t } = useI18n()

  // Options
  const submissionStatus = computed(() => [
    { title: t('organizer.submissionManagement.all'), value: '' },
    { title: t('organizer.submissionManagement.status.pending'), value: SubmissionStatus.PENDING },
    { title: t('organizer.submissionManagement.status.graded'), value: SubmissionStatus.GRADED },
    { title: t('organizer.submissionManagement.status.notSubmitted'), value: SubmissionStatus.NOT_SUBMITTED },
  ])

  const mentorsOptions = computed(() => [
    { title: t('organizer.submissionManagement.all'), value: '' },
    ...props.mentorsOptions,
  ])

  const juriesOptions = computed(() => [
    { title: t('organizer.submissionManagement.all'), value: '' },
    ...props.juriesOptions,
  ])
</script>

<template>
  <div class="mb-6 p-4 border rounded-lg shadow-sm">
    <div class="flex gap-8 flex-wrap">
        <!-- Search -->
      <div class="flex-[2] min-w-[200px]">
        <label class="block mb-2 text-sm font-medium">
          {{ t('organizer.userManagement.name') }}
        </label>
        <v-text-field
          :model-value="filterName"
          :placeholder="t('organizer.submissionManagement.namePlaceholder')"
          variant="solo"
          hide-details
          density="comfortable"
          clearable
          @update:model-value="(v) => emit('update:filterName', v)"
        />
      </div>

      <!-- Status -->
      <div class="flex-1 min-w-[150px]">
        <label class="block mb-2 text-sm font-medium">
          {{ t('organizer.submissionManagement.status.label') }}
        </label>
        <v-select
          :model-value="selectedSubmissionStatus"
          :items="submissionStatus"
          variant="solo"
          hide-details
          density="comfortable"
          @update:model-value="(v) => emit('update:selectedSubmissionStatus', v)"
        />
      </div>

      <!-- Selected Mentor -->
      <div class="flex-1 min-w-[150px]">
        <label class="block mb-2 text-sm font-medium">
          {{ t('organizer.submissionManagement.mentor') }}
        </label>
        <v-select
          :model-value="selectedMentor"
          :items="mentorsOptions"
          variant="solo"
          hide-details
          density="comfortable"
          @update:model-value="(v) => emit('update:selectedMentor', v)"
        />
      </div>

      <!-- Selected jury -->
      <div class="flex-1 min-w-[150px]">
        <label class="block mb-2 text-sm font-medium">
          {{ t('organizer.submissionManagement.jury') }}
        </label>
        <v-select
          :model-value="selectedJury"
          :items="juriesOptions"
          variant="solo"
          hide-details
          density="comfortable"
          @update:model-value="(v) => emit('update:selectedJury', v)"
        />
      </div>
    </div>
  </div>
</template>
