<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { submissionService } from '@/services/submissionService'
  import { onMounted, computed, ref } from 'vue'
  import { useTeamStore } from '@/stores/teamStore'
  import { SubmissionStatus } from '@/types/submission_status'

  const { t } = useI18n()

  defineProps<{
    phaseName: string
  }>()

  const teamStore = useTeamStore()
  const teams = computed(() => teamStore.teams)

  const numberOfTeams = computed<number>(() => {
    return teams.value.length
  })

  const numberOfSubmissions = ref<number>(0)

  const percentageOfTeamsSubmitted = computed<number>(() => {
    if (numberOfTeams.value === 0) {
      return 0
    }
    return (numberOfSubmissions.value / numberOfTeams.value) * 100
  })

  onMounted(async () => {
    const submissions = await submissionService.getAll()
    numberOfSubmissions.value = submissions.filter(
      (submission) =>
        submission.status === SubmissionStatus.PENDING ||
        submission.status === SubmissionStatus.GRADED
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
        {{ t('hackathonManagement.stats.submissions') }}
      </div>
      <div class="d-flex align-baseline text-h4 font-weight-bold mb-4">
        <span class="mr-2 text-purple-darken-2">{{ percentageOfTeamsSubmitted }}%</span>
        <span class="text-subtitle-1 font-weight-regular text-medium-emphasis">
          ({{ numberOfSubmissions }} / {{ numberOfTeams }})
        </span>
      </div>

      <v-progress-linear
        :model-value="percentageOfTeamsSubmitted"
        height="8"
        rounded
        color="purple-darken-2"
      ></v-progress-linear>
    </v-card-text>
  </v-card>
</template>
