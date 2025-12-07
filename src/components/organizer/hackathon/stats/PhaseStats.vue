<script setup lang="ts">
  import { HackathonPhaseDTO } from '@/types/config'
  import { useI18n } from 'vue-i18n'
  import RegistrationCompletionStats from './RegistrationCompletionStats.vue'
  import TopicSelectionStats from './TopicSelectionStats.vue'
  import TeamFormationStats from './TeamFormationStats.vue'
  import SubmissionStats from './SubmissionStats.vue'
  import ProjectEvaluationStats from './ProjectEvaluationStats.vue'
  import { computed } from 'vue'

  const { t } = useI18n()

  // Props
  const props = defineProps<{
    phases: HackathonPhaseDTO[]
    currentPhase: HackathonPhaseDTO
  }>()

  const maxOrderToDisplay = computed<number>(() => {
    const activeStatuses = ['IN_PROGRESS', 'COMPLETED']

    if (activeStatuses.includes(props.currentPhase.status)) {
      return props.currentPhase.order
    } else {
      return Math.max(0, props.currentPhase.order - 1)
    }
  })

  const getPhaseName = (order: number): string => {
    const phase = props.phases.find((phase) => phase.order === order)
    return phase ? phase.name : ''
  }
</script>

<template>
  <v-card class="my-6 pa-4 rounded-lg elevation-4">
    <v-card-title>
      <v-icon class="mr-2">mdi-chart-box-outline</v-icon>
      {{ t('hackathonManagement.stats.title') }}
    </v-card-title>

    <v-container fluid v-if="maxOrderToDisplay > 0">
      <v-row>
        <v-col cols="12" v-if="maxOrderToDisplay >= 1">
          <RegistrationCompletionStats
            :phase-name="getPhaseName(1)"
          />
        </v-col>

        <v-col cols="12" v-if="maxOrderToDisplay >= 2">
          <TopicSelectionStats :phase-name="getPhaseName(2)" />
        </v-col>

        <v-col cols="12" v-if="maxOrderToDisplay >= 3">
          <TeamFormationStats :phase-name="getPhaseName(3)" />
        </v-col>

        <v-col cols="12" v-if="maxOrderToDisplay >= 4">
          <SubmissionStats :phase-name="getPhaseName(4)" />
        </v-col>

        <v-col cols="12" v-if="maxOrderToDisplay >= 5">
          <ProjectEvaluationStats :phase-name="getPhaseName(5)" />
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid v-else>
      <v-row>
        <v-col cols="12">
          <div class="text-center my-6">
            {{ t('hackathonManagement.stats.noData') }}
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
