<script setup lang="ts">
  import { configurationService, getOrCreateConfiguration } from '@/services/configurationService'
  import { HackathonPhaseDTO } from '@/types/config'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'
  import { onMounted, ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  import AppSnackbar from '@/components/common/AppSnackbar.vue'
  import CurrentPhase from '@/components/organizer/hackathon/CurrentPhase.vue'
  import PhaseProgress from '@/components/organizer/hackathon/PhaseProgress.vue'
  import OrganizerActions from '@/components/organizer/hackathon/OrganizerActions.vue'
  import PhaseStats from '@/components/organizer/hackathon/stats/PhaseStats.vue'

  const { t } = useI18n()

  // Snackbar
  const snackbar = ref(false)
  const text = ref('')
  const timeout = ref(1500)
  const error = ref(false)

  const snackbarMessage = computed(() => text.value)

  // Phases
  const hackathonPhases = ref<HackathonPhaseDTO[]>([])
  const currentPhase = ref<HackathonPhaseDTO>(null!)

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

  const handleSkipPhase = async () => {
    try {
      await configurationService.skipPhase()
      await fetchPhases()
    } catch (e) {
      text.value = t('hackathonManagement.errors.phaseSkipError')
      error.value = true
      snackbar.value = true
    }
  }

  const handleBeginPhase = async () => {
    try {
      await configurationService.beginPhase()
      await fetchPhases()
    } catch (e) {
      text.value = t('hackathonManagement.errors.phaseBeginError')
      error.value = true
      snackbar.value = true
    }
  }

  const handleCompletePhase = async () => {
    try {
      await configurationService.completePhase()
      await fetchPhases()
    } catch (e) {
      text.value = t('hackathonManagement.errors.phaseCompleteError')
      error.value = true
      snackbar.value = true
    }
  }

  const fetchPhases = async () => {
    try {
      const response = await getOrCreateConfiguration(ConfigurationKey.PHASES)
      hackathonPhases.value = Array.isArray(response.value?.phases) ? response.value.phases : []
      currentPhase.value = getPendingOrCurrentPhase()
    } catch (e) {
      text.value = t('common.fetchError')
      error.value = true
      snackbar.value = true
    }
  }

  onMounted(async () => {
    await fetchPhases()
  })
</script>

<template>
  <v-container class="py-10 max-w-7xl mx-auto">
    <CurrentPhase
      v-if="hackathonPhases.length > 0"
      :currentPhase="currentPhase"
      :action="getAction()"
      :skipPhase="handleSkipPhase"
      :beginPhase="handleBeginPhase"
      :endPhase="handleCompletePhase"
    />
    <OrganizerActions v-if="hackathonPhases.length > 0" :currentPhase="currentPhase" />
    <PhaseProgress v-if="hackathonPhases.length > 0" :phases="hackathonPhases" />
    <PhaseStats
      v-if="hackathonPhases.length > 0 && currentPhase.order != 6"
      :phases="hackathonPhases"
      :currentPhase="currentPhase"
    />
    <AppSnackbar v-model="snackbar" :message="snackbarMessage" :timeout="timeout" :error="error" />
  </v-container>
</template>
