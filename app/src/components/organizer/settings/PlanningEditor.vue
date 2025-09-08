<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { HackathonPhaseDTO } from '@/types/hackathon'
  const { t } = useI18n()

  const phasesFromDB: HackathonPhaseDTO[] = [
    {
      order: 1,
      startDate: new Date('2024-01-01T09:00:00Z').toISOString(),
      endDate: new Date('2024-01-10T17:00:00Z').toISOString(),
    },
    {
      order: 2,
      startDate: new Date('2024-01-11T09:00:00Z').toISOString(),
      endDate: new Date('2024-01-12T17:00:00Z').toISOString(),
    },
    {
      order: 3,
      startDate: new Date('2024-01-13T09:00:00Z').toISOString(),
      endDate: new Date('2024-01-13T12:00:00Z').toISOString(),
    },
    {
      order: 4,
      startDate: new Date('2024-01-13T13:00:00Z').toISOString(),
      endDate: new Date('2024-01-13T15:00:00Z').toISOString(),
    },
    {
      order: 5,
      startDate: new Date('2024-01-14T09:00:00Z').toISOString(),
      endDate: new Date('2024-01-20T17:00:00Z').toISOString(),
    },
    {
      order: 6,
      startDate: new Date('2024-01-21T00:00:00Z').toISOString(),
      endDate: new Date('2024-01-31T23:59:59Z').toISOString(),
    },
  ]

  // To display on the UI with translations
  const hackathonPhases = phasesFromDB.map((phase) => ({
    ...phase,
    name: t(`hackathon.phases.${phase.order}.name`),
    description: t(`hackathon.phases.${phase.order}.description`),
  }))
</script>

<template>
  <v-container class="py-10 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-2">{{ t('planningSettings.title') }}</h1>
    <p class="mb-10 text-lg text-gray-600">{{ t('planningSettings.subtitle') }}</p>
  </v-container>
</template>
