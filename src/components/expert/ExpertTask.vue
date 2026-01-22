<script setup lang="ts">
  import { useConfiguration } from '@/composables/useConfiguration'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'
  import { watch, ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import AppSnackbar from '@/components/common/AppSnackbar.vue'
  import { HackathonPhaseDTO } from '@/types/config'
  import {
    JuryTaskMapByPhase,
    MentorTaskMapByPhase,
    PhaseOrder,
    TaskKey,
  } from '@/types/hackathon_phase'
  import { useAuthStore } from '@/stores/auth'
  import { UserRole } from '@/types/roles'
  import ExpertTaskFeedback from './ExpertTaskFeedback.vue'
  import ExpertTaskEvaluation from './ExpertTaskEvaluation.vue'
  import UserTaskProfile from '../common/UserTaskProfile.vue'

  const { t } = useI18n()
  const { user } = useAuthStore()

  // Snackbar
  const snackbar = ref(false)
  const text = ref('')
  const timeout = ref(1500)
  const error = ref(false)
  const snackbarMessage = computed(() => text.value)

  const { configuration: phasesConfig } = useConfiguration(ConfigurationKey.PHASES)
  const currentPhase = ref<HackathonPhaseDTO | null>(null)

  watch(
    phasesConfig,
    (newConfig) => {
      const rawPhases: HackathonPhaseDTO[] = Array.isArray(newConfig?.value?.phases)
        ? (newConfig.value.phases as HackathonPhaseDTO[])
        : []

      currentPhase.value = rawPhases.find((phase) => phase.status == 'IN_PROGRESS') || null
    },
    { immediate: true }
  )

  const submissionDeadline = computed(() => {
    const rawPhases = phasesConfig.value?.value?.phases as HackathonPhaseDTO[] | undefined
    if (!rawPhases) return null

    const phase4 = rawPhases.find((p) => p.order === PhaseOrder.DEVELOPMENT)
    return phase4 ? phase4.endDate : null
  })

  const currentExpertTask = computed<TaskKey | null>(() => {
    if (!currentPhase.value) return null
    const orderKey = currentPhase.value.order as PhaseOrder
    let taskKeys = null
    if (user?.role === UserRole.JURY) {
      taskKeys = JuryTaskMapByPhase[orderKey]
    } else {
      taskKeys = MentorTaskMapByPhase[orderKey]
    }
    return taskKeys && taskKeys.length > 0 ? taskKeys[0] : null
  })

  const TaskComponentMap: Record<TaskKey, any> = {
    [TaskKey.PROFILE_COMPLETION]: UserTaskProfile,
    [TaskKey.PROVIDE_FEEDBACK]: ExpertTaskFeedback,
    [TaskKey.EVALUATE_PROJECTS]: ExpertTaskEvaluation,
  } as any

  const currentTaskComponent = computed<any | null>(() => {
    const taskKey = currentExpertTask.value
    if (taskKey && TaskComponentMap[taskKey]) {
      return TaskComponentMap[taskKey]
    }
    return null
  })
</script>

<template>
  <v-card class="pa-4 rounded-lg elevation-1">
    <v-card-title class="text-h5 font-weight-bold mb-4">
      <v-icon class="mr-2">mdi-clipboard-list-outline</v-icon>
      {{ t('dashboard.expert.tasks') }}
    </v-card-title>

    <v-card-text>
      <component
        :is="currentTaskComponent"
        v-if="currentTaskComponent"
        :key="currentExpertTask"
        :deadline="submissionDeadline"
      />

      <v-alert v-else type="info" variant="tonal">
        <h4 class="text-h6">{{ t('common.information') }}</h4>
        <p class="mt-2">
          {{ t('dashboard.nothing_todo') }}
        </p>
      </v-alert>
    </v-card-text>
  </v-card>
  <AppSnackbar v-model="snackbar" :message="snackbarMessage" :timeout="timeout" :error="error" />
</template>
