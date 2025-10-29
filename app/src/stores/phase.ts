import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getConfiguration } from '@/services/configurationService'
import { ConfigurationKey } from '@/utils/configuration/configurationKey'
import type { HackathonPhase, HackathonPhaseDTO } from '@/types/config'

export const usePhaseStore = defineStore('phase', () => {
  const phases = ref<HackathonPhase[]>([])
  const lastFetchedAt = ref<Date | null>(null)
  const refreshTimeout = ref<number | null>(null)

  const fetchPhases = async () => {
    try {
      const response = await getConfiguration(ConfigurationKey.PHASES)
      const rawPhases: HackathonPhaseDTO[] = Array.isArray(response?.value) ? response.value : []

      phases.value = rawPhases.map(p => ({
        order: p.order,
        startDate: p.startDate ?? null,
        endDate: p.endDate ?? null,
        startDateObj: p.startDate ? new Date(p.startDate) : null,
        endDateObj: p.endDate ? new Date(p.endDate) : null,
      }))

      lastFetchedAt.value = new Date()
    } catch (err) {
      console.error('[PhaseStore] getConfiguration failed:', err)
      phases.value = []
      lastFetchedAt.value = new Date()
    }
  }

  const currentPhase = computed(() => {
    const now = new Date()
    return phases.value.find(p => p.startDateObj && p.endDateObj && now >= p.startDateObj && now <= p.endDateObj) ?? null
  })

  const nextPhase = computed(() => {
    const now = new Date()
    return phases.value.find(p => p.startDateObj && p.startDateObj > now) ?? null
  })
  
  const scheduleNextRefresh = () => {
    if (refreshTimeout.value) clearTimeout(refreshTimeout.value)

    const now = new Date()
    const nextStart = phases.value
      .map(p => p.startDateObj)
      .filter(d => d && d > now)
      .sort((a, b) => (a!.getTime() - b!.getTime()))[0]

    if (nextStart) {
      const delay = nextStart.getTime() - now.getTime() + 1000
      refreshTimeout.value = window.setTimeout(async () => {
        await fetchPhases()
        scheduleNextRefresh()
      }, delay)
    }
  }

  return {
    phases,
    lastFetchedAt,
    fetchPhases,
    currentPhase,
    nextPhase,
    scheduleNextRefresh,
  }
})
