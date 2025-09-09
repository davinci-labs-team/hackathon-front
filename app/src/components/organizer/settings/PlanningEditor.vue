<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { HackathonPhaseDTO } from '@/types/hackathon'
  import AppSnackbar from '@/components/common/AppSnackbar.vue'
  import VueDatePicker from '@vuepic/vue-datepicker'
  import '@vuepic/vue-datepicker/dist/main.css'
  import { enUS, fr } from 'date-fns/locale'

  const { t, locale } = useI18n()

  // Snackbar
  const snackbar = ref(false)
  const text = ref(t('common.changesSaved'))
  const timeout = ref(1500)
  const error = ref(false)

  // Données venant de la DB
  const phasesFromDB: HackathonPhaseDTO[] = [
    { order: 1, startDate: '2024-01-01T09:00:00Z', endDate: '2024-01-10T17:00:00Z' },
    { order: 2, startDate: null, endDate: null }, // Optional
    { order: 3, startDate: '2024-01-13T09:00:00Z', endDate: '2024-01-13T12:00:00Z' },
    { order: 4, startDate: '2024-01-13T13:00:00Z', endDate: '2024-01-13T15:00:00Z' },
    { order: 5, startDate: '2024-01-14T09:00:00Z', endDate: '2024-01-20T17:00:00Z' },
    { order: 6, startDate: '2024-01-21T00:00:00Z', endDate: '2024-01-31T23:59:59Z' },
  ]

  const basePhases = phasesFromDB.map((phase) => ({
    ...phase,
    startDateObj: phase.startDate ? new Date(phase.startDate) : null,
    endDateObj: phase.endDate ? new Date(phase.endDate) : null,
  }))

  // Transforme les ISO en objets Date pour les inputs
  const hackathonPhases = ref(
    basePhases.map((phase) => ({
      ...phase,
    }))
  )

  const validatePhases = () => {
    const phases = hackathonPhases.value

    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i]

      if (phase.order === 2 && (!phase.startDateObj || !phase.endDateObj)) {
        continue
      }

      if (!phase.startDateObj || !phase.endDateObj) {
        return false
      }

      // Check that start is before end
      if (phase.startDateObj && phase.endDateObj && phase.startDateObj >= phase.endDateObj) {
        return false
      }

      // Check for overlap with next phase
      if (i < phases.length - 1) {
        const nextPhase = phases[i + 1]

        // Skip next phase if it's order 2 and dates not set
        if (nextPhase.order === 2 && (!nextPhase.startDateObj || !nextPhase.endDateObj)) {
          continue
        }

        if (
          phase.endDateObj &&
          nextPhase.startDateObj &&
          phase.endDateObj > nextPhase.startDateObj
        ) {
          return false
        }
      }
    }
    return true
  }

  // TODO: transformer les objets en json

  const handleSave = () => {
    snackbar.value = true
    if (!validatePhases()) {
      text.value = t('planningSettings.invalidPhases')
      error.value = true
      return
    }
  }
</script>

<template>
  <v-container class="py-10 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-2">{{ t('planningSettings.title') }}</h1>
    <div class="flex justify-between items-center mb-0">
      <p class="text-lg text-gray-600 mb-0">{{ t('planningSettings.subtitle') }}</p>
      <v-btn color="primary" @click="handleSave">{{ t('common.saveChanges') }}</v-btn>
    </div>
    <p class="text-m text-red-500 italic mb-5">
      {{ t('planningSettings.mustNotOverlap') }}
    </p>

    <AppSnackbar v-model="snackbar" :message="text" :timeout="timeout" :error="error" />

    <v-container>
      <div v-for="phase in hackathonPhases" :key="phase.order" class="mb-8">
        <h2 class="text-2xl font-semibold mb-1">
          {{ t(`hackathon.phases.${phase.order}.name`) }}
          <span v-if="phase.order !== 2" class="text-red-500">*</span>
        </h2>
        <p class="text-gray-600 mb-3">{{ t(`hackathon.phases.${phase.order}.description`) }}</p>

        <div class="flex items-center space-x-4">
          <!-- Start -->
          <div class="flex flex-row gap-2 align-center">
            <label class="text-m font-medium text-gray-700 mb-1">{{ t('common.from') }}</label>
            <VueDatePicker
              :key="locale"
              v-model="phase.startDateObj"
              :enable-time="true"
              :format-locale="locale === 'fr' ? fr : enUS"
              format="PPp"
              time-format="24"
              :placeholder="t('planningSettings.selectDateAndTime')"
            />
          </div>

          <!-- End -->
          <div class="flex flex-row gap-2 align-center">
            <label class="text-m font-medium text-gray-700 mb-1">{{ t('common.to') }}</label>
            <VueDatePicker
              :key="locale"
              v-model="phase.endDateObj"
              :enable-time="true"
              :format-locale="locale === 'fr' ? fr : enUS"
              format="PPp"
              time-format="24"
              :placeholder="t('planningSettings.selectDateAndTime')"
            />
            <p
              v-if="
                phase.endDateObj && phase.startDateObj && phase.endDateObj <= phase.startDateObj
              "
              class="text-red-500 text-sm"
            >
              {{ t('planningSettings.endAfterStart') }}
            </p>
          </div>
        </div>
      </div>
    </v-container>
  </v-container>
</template>
