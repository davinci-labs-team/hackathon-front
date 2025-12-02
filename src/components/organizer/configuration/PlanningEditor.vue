<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { HackathonPhaseDTO, HackathonPhase } from '@/types/config'
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
  const hackathonPhases = ref<HackathonPhase[]>([])

  onMounted(async () => {
    try {
      const response = await getOrCreateConfiguration(ConfigurationKey.PHASES)
      const rawPhases: HackathonPhaseDTO[] = Array.isArray(response.value?.phases)
        ? response.value.phases
        : []

        console.log('Fetched phases:', rawPhases)

      hackathonPhases.value = rawPhases.map((phase) => ({
        order: phase.order,
        name: phase.name,
        status: phase.status,
        optionalPhase: phase.optionalPhase,
        startDate: phase.startDate ?? null,
        endDate: phase.endDate ?? null,
        startDateObj: phase.startDate ? new Date(phase.startDate) : null,
        endDateObj: phase.endDate ? new Date(phase.endDate) : null,
      }))
    } catch (e) {
      text.value = t('planningSettings.fetchError')
      error.value = true
      snackbar.value = true
    }
  })

  const handleSave = async () => {
    if (hackathonPhases.value.some(phase => !phase.name || phase.name.trim() === '')) {
      text.value = t('planningSettings.phaseNameRequired')
      error.value = true
      snackbar.value = true
      return
    }

    const payload = {
      phases: hackathonPhases.value.map((phase) => ({
        order: phase.order,
        name: phase.name,
        status: phase.status,
        optionalPhase: phase.optionalPhase,
        startDate: phase.startDateObj?.toISOString() ?? null,
        endDate: phase.endDateObj?.toISOString() ?? null,
      })),
    }

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

    <div class="flex justify-between items-center mb-8">
      <p class="text-lg text-gray-600 mb-0">{{ t('planningSettings.subtitle') }}</p>
      <v-btn color="primary" @click="handleSave">{{ t('common.saveChanges') }}</v-btn>
    </div>

    <AppSnackbar v-model="snackbar" :message="snackbarMessage" :timeout="timeout" :error="error" />

    <div v-for="phase in hackathonPhases" :key="phase.order" class="mb-8">
      <h2 class="text-2xl font-semibold mb-1 flex items-center">
        <!-- Phase Name Input -->
         <input
          v-model="phase.name"
          type="text"
          class="w-full text-2xl font-semibold mb-1 resize-none border-b border-gray-300 focus:outline-none focus:border-blue-500"
          :placeholder="t(`hackathon.phases.${phase.order}.defaultName`)"
          rows="1"
        ></input>
        <span v-if="!phase.optionalPhase" class="text-red-500">*</span>
      </h2>
      <p class="text-gray-600 mb-3">{{ t(`hackathon.phases.${phase.order}.description`) }}</p>

        <!-- End Date for Hackathon Phase -->
        <div v-if="phase.order == 4" class="flex flex-row items-center space-x-4 mb-4">
          <label class="text-m font-medium text-gray-700 flex-shrink-0">
            {{ t('planningSettings.deadline') }}
          </label>

          <div class="min-w-[250px]">
            <VueDatePicker
              :key="locale"
              v-model="phase.endDateObj"
              :enable-time="true"
              :format-locale="locale === 'fr' ? fr : enUS"
              format="PPp"
              time-format="24"
              :placeholder="t('planningSettings.selectDateAndTime')"
            />
          </div>
        </div>
      </div>
  </v-container>
</template>
