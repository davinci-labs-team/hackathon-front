import { ref, onMounted } from 'vue'
import { configurationService, getOrCreateConfiguration } from '@/services/configurationService'
import type { ConfigurationResponse, UpdateConfigurationDTO } from '@/types/config'
import type { ConfigurationKey } from '@/utils/configuration/configurationKey'
import axios from 'axios'

export function useConfiguration(key: ConfigurationKey) {
  const configuration = ref<ConfigurationResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const phaseActionLoading = ref(false)
  const phaseActionError = ref<string | null>(null)

  const fetchConfiguration = async () => {
    loading.value = true
    error.value = null
    try {
      configuration.value = await getOrCreateConfiguration(key)
    } catch (e: any) {
      error.value =
        (axios.isAxiosError(e) ? e.message : e.message) ||
        `Error fetching or creating configuration for key: ${key}`
    } finally {
      loading.value = false
    }
  }

  const updateConfiguration = async (dto: UpdateConfigurationDTO) => {
    error.value = null
    try {
      const updatedConfig = await configurationService.update(key, dto)
      configuration.value = updatedConfig
    } catch (e: any) {
      error.value =
        (axios.isAxiosError(e) ? e.message : e.message) ||
        `Error updating configuration for key: ${key}`
      throw e
    }
  }

  // --- Methods for Hackathon Phase Management ---

  const executePhaseAction = async (action: 'skipPhase' | 'beginPhase' | 'completePhase') => {
    phaseActionLoading.value = true
    phaseActionError.value = null
    try {
      await configurationService[action]()
    } catch (e: any) {
      phaseActionError.value =
        (axios.isAxiosError(e) ? e.message : e.message) || `Error during phase action: ${action}`
      throw e
    } finally {
      phaseActionLoading.value = false
    }
  }

  const skipPhase = () => executePhaseAction('skipPhase')
  const beginPhase = () => executePhaseAction('beginPhase')
  const completePhase = () => executePhaseAction('completePhase')

  onMounted(fetchConfiguration)

  return {
    configuration,
    loading,
    error,
    phaseActionLoading,
    phaseActionError,
    fetchConfiguration,
    updateConfiguration,
    skipPhase,
    beginPhase,
    completePhase,
  }
}
