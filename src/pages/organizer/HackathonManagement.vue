<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { HackathonPhaseDTO } from '@/types/config'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'
  import { useConfiguration } from '@/composables/useConfiguration'
  import { configurationService } from '@/services/configurationService'

  import AppSnackbar from '@/components/common/AppSnackbar.vue'
  import CurrentPhase from '@/components/organizer/hackathon/CurrentPhase.vue'
  import PhaseProgress from '@/components/organizer/hackathon/PhaseProgress.vue'
  import OrganizerActions from '@/components/organizer/hackathon/OrganizerActions.vue'
  import PhaseStats from '@/components/organizer/hackathon/stats/PhaseStats.vue'
  import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

  const { t } = useI18n()
  const isActionDisabled = ref(false)
  const profileCompletion = ref(false)
  const topicSelection = ref(false)
  const teamsFormed = ref(false)
  const evaluationsCompleted = ref(false)

  const showResetDialog = ref(false)

  // --- Hooks ---

  const {
    configuration: phasesConfig,
    error: phasesError,
    fetchConfiguration: fetchPhases,
  } = useConfiguration(ConfigurationKey.PHASES)

  const {
    skipPhase: executeSkipPhase,
    beginPhase: executeBeginPhase,
    completePhase: executeCompletePhase,
  } = useConfiguration(ConfigurationKey.PHASES)

  // --- LOCAL STATE ---
  const snackbar = ref(false)
  const text = ref('')
  const timeout = ref(1500)
  const error = ref(false)

  const snackbarMessage = computed(() => text.value)

  const hackathonPhases = ref<HackathonPhaseDTO[]>([])
  const currentPhase = ref<HackathonPhaseDTO>(null!)

  const handleResetHackathon = async () => {
    try {
      await configurationService.resetHackathon()

      await fetchPhases()
      text.value = t('hackathonManagement.resetComplete')
      error.value = false
      snackbar.value = true
    } catch (e) {
      text.value = t('hackathonManagement.errors.resetError')
      error.value = true
      snackbar.value = true
    } finally {
      showResetDialog.value = false
    }
  }

  watch(
    phasesConfig,
    (newConfig) => {
      hackathonPhases.value = Array.isArray(newConfig?.value?.phases)
        ? (newConfig.value.phases as HackathonPhaseDTO[])
        : []

      if (hackathonPhases.value.length > 0) {
        currentPhase.value = getPendingOrCurrentPhase()
      } else {
        currentPhase.value = null!
      }

      if (phasesError.value) {
        text.value = t('common.fetchError')
        error.value = true
        snackbar.value = true
      }
    },
    { immediate: true }
  )

  const getPendingOrCurrentPhase = () => {
    const phase = hackathonPhases.value.find(
      (phase) => phase.status === 'PENDING' || phase.status === 'IN_PROGRESS'
    )!

    if (!phase) {
      return hackathonPhases.value[hackathonPhases.value.length - 1]
    }
    return phase
  }

  const getAction = () => {
    return currentPhase.value?.status === 'PENDING' ? 'begin' : 'end'
  }

  const handleAction = async (actionFn: () => Promise<void>, errorKey: string) => {
    try {
      await actionFn()
      await fetchPhases()
    } catch (e) {
      text.value = t(errorKey)
      error.value = true
      snackbar.value = true
    }
  }

  const handleSkipPhase = () =>
    handleAction(executeSkipPhase, 'hackathonManagement.errors.phaseSkipError')

  const handleBeginPhase = () =>
    handleAction(executeBeginPhase, 'hackathonManagement.errors.phaseBeginError')

  const handleCompletePhase = () =>
    handleAction(executeCompletePhase, 'hackathonManagement.errors.phaseCompleteError')
</script>

<template>
  <v-container class="py-10 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">{{ t('hackathonManagement.title') }}</h1>
      <v-btn
        color="red-darken-2"
        size="large"
        prepend-icon="mdi-refresh"
        @click="showResetDialog = true"
      >
        {{ t('hackathonManagement.resetPhases') }}
      </v-btn>
    </div>

    <CurrentPhase
      v-if="hackathonPhases.length > 0"
      :currentPhase="currentPhase"
      :action="getAction()"
      :skipPhase="handleSkipPhase"
      :beginPhase="handleBeginPhase"
      :endPhase="handleCompletePhase"
      :isDisabled="isActionDisabled"
    />
    <OrganizerActions
      v-if="hackathonPhases.length > 0"
      :currentPhase="currentPhase"
      :actionDisabled="isActionDisabled"
      @update:actionDisabled="isActionDisabled = $event"
      :profile-completion="profileCompletion"
      :topic-selection="topicSelection"
      :teams-formed="teamsFormed"
      :evaluations-completed="evaluationsCompleted"
    />
    <PhaseProgress v-if="hackathonPhases.length > 0" :phases="hackathonPhases" />
    <PhaseStats
      v-if="hackathonPhases.length > 0"
      :phases="hackathonPhases"
      :currentPhase="currentPhase"
      :profileCompletion="profileCompletion"
      @update:profileCompletion="profileCompletion = $event"
      :topicSelection="topicSelection"
      @update:topicSelection="topicSelection = $event"
      :teamsFormed="teamsFormed"
      @update:teamsFormed="teamsFormed = $event"
      :evaluationsCompleted="evaluationsCompleted"
      @update:evaluationsCompleted="evaluationsCompleted = $event"
    />

    <ConfirmDialog
      v-model="showResetDialog"
      :title="t('hackathonManagement.resetDialog.title')"
      :text="t('hackathonManagement.resetDialog.text')"
      :confirmLabel="t('hackathonManagement.resetDialog.reset')"
      :cancelLabel="t('common.cancel')"
      @confirm="handleResetHackathon"
    />

    <AppSnackbar v-model="snackbar" :message="snackbarMessage" :timeout="timeout" :error="error" />
  </v-container>
</template>
