<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { HackathonPhaseDTO, HackathonMediaDTO, ThemesDTO } from '@/types/config'
  import { TaskMapByPhase, TaskKey, PhaseOrder, PhaseStatus } from '@/types/hackathon_phase'
  import { useUser } from '@/composables/useUser'
  import { useConfiguration } from '@/composables/useConfiguration'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'

  const { t, tm } = useI18n()

  const { users } = useUser()

  interface TaskDefinition {
    text: string
    completed: boolean
    key: TaskKey
  }

  // --- CONFIGURATION ---
  const { configuration: phasesConfig } = useConfiguration(ConfigurationKey.PHASES)
  const { configuration: mediaConfig } = useConfiguration(ConfigurationKey.MEDIA)
  const { configuration: matchmakingConfig } = useConfiguration(ConfigurationKey.MATCHMAKING)
  const { configuration: themesConfig } = useConfiguration(ConfigurationKey.THEMES)

  // --- LOCAL STATE ---
  const submissionDeadlineDefined = ref<boolean>(false)
  const evaluationGridUploaded = ref<boolean>(false)
  const teamConstraintsDefined = ref<boolean>(false)
  const themesExist = ref<boolean>(false)

  watch(
    phasesConfig,
    (newConfig) => {
      const rawPhases: HackathonPhaseDTO[] = Array.isArray(newConfig?.value?.phases)
        ? (newConfig.value.phases as HackathonPhaseDTO[])
        : []
      const submissionPhase = rawPhases.find((phase) => phase.order === PhaseOrder.DEVELOPMENT)
      if (submissionPhase && submissionPhase.endDate) {
        submissionDeadlineDefined.value = true
      } else {
        submissionDeadlineDefined.value = false
      }
    },
    { immediate: true }
  )

  watch(
    mediaConfig,
    (newConfig) => {
      if (newConfig?.value) {
        const mediaSettings = newConfig.value as HackathonMediaDTO
        if (mediaSettings.evaluationGridPath) {
          evaluationGridUploaded.value = true
        } else {
          evaluationGridUploaded.value = false
        }
      }
    },
    { immediate: true }
  )

  watch(
    matchmakingConfig,
    (newConfig) => {
      if (newConfig && newConfig.value) {
        teamConstraintsDefined.value = true
      } else {
        teamConstraintsDefined.value = false
      }
    },
    { immediate: true }
  )

  watch(
    themesConfig,
    (newConfig) => {
      if (newConfig?.value?.themes && Array.isArray(newConfig.value.themes)) {
        const themesList = newConfig.value.themes as ThemesDTO[]
        themesExist.value = themesList.length > 0
      } else {
        themesExist.value = false
      }
    },
    { immediate: true }
  )

  // --- Props ---
  const props = defineProps<{
    currentPhase: HackathonPhaseDTO
    actionDisabled: boolean

    profileCompletion: boolean
    topicSelection: boolean
    teamsFormed: boolean
    evaluationsCompleted: boolean
  }>()

  const discordAutoroleCommandExecuted = ref<boolean>(false)

  const organizerActionsRaw = computed(() => {
    return tm('hackathonManagement.organizerActions') as {
      [key: string]: string | { [key: string]: any }
    }
  })

  // --- LOGIQUE DE RÉCUPÉRATION DES TÂCHES ---
  const currentTaskKeys = computed<TaskKey[]>(() => {
    const orderKey = props.currentPhase.order as PhaseOrder
    const statusKey = props.currentPhase.status as PhaseStatus

    const keys = TaskMapByPhase[orderKey]?.[statusKey]

    return keys || []
  })

  const getCompletedStatus = (taskKey: TaskKey): boolean => {
    switch (taskKey) {
      case TaskKey.CREATE_ACCOUNTS:
        return users.value.length > 0
      case TaskKey.SEND_INVITATIONS:
        return !users.value.some((user) => !user.invitationSent)
      case TaskKey.PROFILE_COMPLETION:
        return props.profileCompletion
      case TaskKey.CREATE_TOPICS:
        return themesExist.value
      case TaskKey.DEFINE_TEAM_CONSTRAINTS:
        return teamConstraintsDefined.value
      case TaskKey.TOPIC_SELECTION:
        return props.topicSelection
      case TaskKey.TEAMS_FORMED:
        return props.teamsFormed
      case TaskKey.DISCORD_AUTOROLE:
        return discordAutoroleCommandExecuted.value
      case TaskKey.DEFINE_SUBMISSION_DEADLINE:
        return submissionDeadlineDefined.value
      case TaskKey.UPLOAD_EVALUATION_GRID:
        return evaluationGridUploaded.value
      case TaskKey.EVALUATIONS_COMPLETED:
        return props.evaluationsCompleted
      default:
        return false
    }
  }

  const tasksWithStatus = computed<TaskDefinition[]>(() => {
    return currentTaskKeys.value.map((taskKey) => {
      const taskText = organizerActionsRaw.value[taskKey] || `[Missing text for: ${taskKey}]`

      const completed = getCompletedStatus(taskKey)

      return {
        key: taskKey,
        completed,
        text: String(taskText),
      } as TaskDefinition
    })
  })

  const shouldShowCard = computed(() => {
    return tasksWithStatus.value.length > 0
  })
</script>

<template>
  <v-card v-if="shouldShowCard" class="my-6 pa-4 rounded-lg elevation-4">
    <v-card-title>
      <v-icon class="mr-2">mdi-clipboard-list-outline</v-icon>
      {{ t('hackathonManagement.organizerActions.title') }}
    </v-card-title>

    <v-card-text>
      <v-alert v-if="currentPhase.status === 'PENDING'" variant="tonal" class="mb-4">
        {{ t('hackathonManagement.organizerActions.alertPending') }}
      </v-alert>

      <v-list>
        <v-list-item
          v-for="task in tasksWithStatus"
          :key="task.key"
          :class="{ 'text-grey-darken-1': task.completed }"
          lines="two"
        >
          <template v-slot:prepend>
            <v-chip label :color="task.completed ? 'success' : 'warning'" class="mr-4">
              <v-icon
                :icon="task.completed ? 'mdi-check' : 'mdi-clock-outline'"
                size="default"
                class="mr-1"
              />
              {{ task.completed ? t('common.completed') : t('common.pending') }}
            </v-chip>
          </template>

          <v-list-item-title class="text-wrap font-weight-bold text-base">
            {{ task.text }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
  <v-card v-else class="my-6 pa-4 rounded-lg elevation-4">
    <v-card-title>
      <v-icon class="mr-2">mdi-clipboard-list-outline</v-icon>
      {{ t('hackathonManagement.organizerActions.title') }}
    </v-card-title>

    <v-card-text>
      {{ t('hackathonManagement.organizerActions.noActions') }}
    </v-card-text>
  </v-card>
</template>
