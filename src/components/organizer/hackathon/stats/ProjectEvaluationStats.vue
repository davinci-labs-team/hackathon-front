<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed, onMounted, ref } from 'vue'
  import { submissionService } from '@/services/submissionService'
  import { SubmissionStatus } from '@/types/submission_status'

  const { t } = useI18n()

  defineProps<{
    phaseName: string
  }>()

  const emit = defineEmits(['update:evaluationsCompleted'])

  const totalSubmissions = ref<number>(0)
  const totalSubmissionsGraded = ref<number>(0)

  const percentageOfEvaluatedProjects = computed<number>(() => {
    if (totalSubmissions.value === 0) {
      return 0
    }
    return (totalSubmissionsGraded.value / totalSubmissions.value) * 100
  })

  onMounted(async () => {
    const submissions = await submissionService.getAll()
    totalSubmissions.value = submissions.length
    totalSubmissionsGraded.value = submissions.filter(
      (submission) => submission.status === SubmissionStatus.GRADED
    ).length
  })
</script>

<template>
  <v-card variant="flat">
    <v-card-title>
      {{ phaseName }}
    </v-card-title>

    <v-card-text>
      <div class="text-subtitle-1 font-weight-bold mb-2">
        {{ t('hackathonManagement.stats.evaluations') }}
      </div>
      <div class="d-flex align-baseline text-h4 font-weight-bold mb-4">
        <span class="mr-2 text-orange-darken-2">{{ percentageOfEvaluatedProjects }}%</span>
        <span class="text-subtitle-1 font-weight-regular text-medium-emphasis">
          ({{ totalSubmissionsGraded }} / {{ totalSubmissions }})
        </span>
      </div>

      <v-progress-linear
        :model-value="percentageOfEvaluatedProjects"
        height="8"
        rounded
        color="orange-darken-2"
      ></v-progress-linear>
    </v-card-text>
  </v-card>
</template>
