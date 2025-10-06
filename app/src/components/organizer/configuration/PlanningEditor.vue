<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { HackathonPhaseDTO } from '@/types/config'
  import AppSnackbar from '@/components/common/AppSnackbar.vue'
  import VueDatePicker from '@vuepic/vue-datepicker'
  import '@vuepic/vue-datepicker/dist/main.css'
  import { enUS, fr } from 'date-fns/locale'
  import { configurationService, getOrCreateConfiguration } from '@/services/configurationService'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'

  const { t, locale } = useI18n()

  // Snackbar
  const snackbar = ref(false)
  const text = ref('')
  const timeout = ref(1500)
  const error = ref(false)

  const snackbarMessage = computed(() => text.value)

  // Phases
  const phasesFromDB = ref<HackathonPhaseDTO[]>([])
  const hackathonPhases = ref<
    { order: number; startDateObj: Date | null; endDateObj: Date | null }[]
  >([])

  onMounted(async () => {
    try {
      const response = await getOrCreateConfiguration(ConfigurationKey.PHASES)
      phasesFromDB.value = response.value.map((phase: any) => ({
        order: phase.order,
        startDate: phase.startDate,
        endDate: phase.endDate,
      }))

      hackathonPhases.value = phasesFromDB.value.map((phase) => ({
        order: phase.order,
        startDateObj: phase.startDate ? new Date(phase.startDate) : null,
        endDateObj: phase.endDate ? new Date(phase.endDate) : null,
      }))
    } catch (e) {
      text.value = t('planningSettings.fetchError')
      error.value = true
      snackbar.value = true
    }
  })

  // Validation d'une phase
  const validatePhase = (phase: (typeof hackathonPhases.value)[0]) => {
    // Phase optionnelle vide
    if (phase.order === 2 && !phase.startDateObj && !phase.endDateObj) return true
    // Dates obligatoires
    if (!phase.startDateObj || !phase.endDateObj) return false
    return phase.startDateObj < phase.endDateObj
  }

  // Validation de toutes les phases
  const validatePhases = () => {
    const phases = hackathonPhases.value
    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i]
      if (!validatePhase(phase)) return false

      if (i < phases.length - 1) {
        const nextPhase = phases[i + 1]
        if (nextPhase.order === 2 && !nextPhase.startDateObj && !nextPhase.endDateObj) continue
        if (phase.endDateObj! > nextPhase.startDateObj!) return false
      }
    }
    return true
  }

  const handleSave = async () => {
    if (!validatePhases()) {
      text.value = t('planningSettings.invalidPhases')
      error.value = true
      snackbar.value = true
      return
    }

    const payload = hackathonPhases.value.map((phase) => ({
      order: phase.order,
      startDate: phase.startDateObj?.toISOString() ?? null,
      endDate: phase.endDateObj?.toISOString() ?? null,
    }))

    console.log('Saving phases:', payload)

    try {
      await configurationService.update(ConfigurationKey.PHASES, { value: payload })
      text.value = t('common.changesSaved')
      error.value = false
      snackbar.value = true
    } catch (e) {
      console.error('Error saving phases:', e)
      text.value = t('planningSettings.saveError')
      error.value = true
      snackbar.value = true
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

    <p class="text-m text-grey-500 italic mb-5">
      {{ t('planningSettings.mustNotOverlap') }}
    </p>

    <AppSnackbar v-model="snackbar" :message="snackbarMessage" :timeout="timeout" :error="error" />

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
            v-if="phase.endDateObj && phase.startDateObj && phase.endDateObj <= phase.startDateObj"
            class="text-red-500 text-sm"
          >
            {{ t('planningSettings.endAfterStart') }}
          </p>
        </div>
      </div>
    </div>
  </v-container>
</template>
