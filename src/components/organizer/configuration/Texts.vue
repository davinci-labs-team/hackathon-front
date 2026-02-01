<script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import AppSnackbar from '@/components/common/AppSnackbar.vue'
  import { HackathonTextDTO, UpdateConfigurationDTO } from '@/types/config'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'
  import { useConfiguration } from '@/composables/useConfiguration'
  import { getDetailedDuration } from '@/utils/dateUtils'

  const { t } = useI18n()

  const {
    configuration: textsConfig,
    loading: textsLoading,
    error: textsError,
    updateConfiguration: updateTextsConfig,
  } = useConfiguration(ConfigurationKey.TEXTS)

  // --- Hackathon Texts ---
  const hackathonTexts = ref<HackathonTextDTO>({
    hackathonName: '',
    slogan: '',
    hackathonDescription: '',
    location: '',
    startDate: '',
    endDate: '',
  })

  const saveAttempted = ref(false)
  const isSaving = ref(false)

  watch(
    textsConfig,
    (newConfig) => {
      if (newConfig?.value) {
        hackathonTexts.value = newConfig.value as HackathonTextDTO
      }

      // Gérer l'erreur initiale
      if (textsError.value) {
        console.error('Error fetching hackathon texts from hook:', textsError.value)
      }
    },
    { immediate: true } // Exécuter immédiatement au montage/à l'arrivée des données
  )

  // --- Validation & Limits ---
  const hackathonNameMaxLength = 60
  const sloganMaxLength = 60
  const hackathonDescriptionMaxLength = 500

  const areFieldsMissing = computed(() => {
    const texts = hackathonTexts.value
    return (
      !texts.hackathonName ||
      !texts.hackathonDescription ||
      !texts.location ||
      !texts.startDate ||
      !texts.endDate
    )
  })

  const validateTexts = () => {
    const texts = hackathonTexts.value

    if (areFieldsMissing.value) {
      snackbarText.value = t('textsSettings.errors.requiredFields')
      return false
    }

    if (isDateError.value) {
      snackbarText.value = t('textsSettings.errors.fixErrors')
      return false
    }

    if (
      texts.hackathonName.length > hackathonNameMaxLength ||
      (texts.slogan && texts.slogan.length > sloganMaxLength) ||
      texts.hackathonDescription.length > hackathonDescriptionMaxLength
    ) {
      snackbarText.value = t('textsSettings.errors.fixErrors')
      return false
    }

    return true
  }

  const durationDisplay = computed(() => {
    if (!hackathonTexts.value.startDate || !hackathonTexts.value.endDate) return null

    return getDetailedDuration(hackathonTexts.value.startDate, hackathonTexts.value.endDate)
  })

  const isDateError = computed(() => {
    if (!hackathonTexts.value.startDate || !hackathonTexts.value.endDate) return false

    const start = new Date(hackathonTexts.value.startDate).getTime()
    const end = new Date(hackathonTexts.value.endDate).getTime()

    return end < start
  })

  // --- Snackbar ---
  const snackbar = ref(false)
  const snackbarText = ref(t('common.changesSaved'))
  const snackbarTimeout = ref(1500)
  const snackbarError = ref(false)

  const handleSaveTexts = async () => {
    saveAttempted.value = true

    if (!validateTexts()) {
      snackbarError.value = true
      snackbar.value = true
      return
    }

    const updateDto: UpdateConfigurationDTO = {
      value: { ...hackathonTexts.value },
    }

    isSaving.value = true
    try {
      await updateTextsConfig(updateDto)
      snackbarText.value = t('common.changesSaved')
      snackbarError.value = false
      snackbar.value = true
    } catch (e) {
      snackbarText.value = t('common.error')
      snackbarError.value = true
      snackbar.value = true
    } finally {
      isSaving.value = false
    }
  }
</script>

<template>
  <v-container class="py-10 max-w-7xl mx-auto">
    <!-- Hackathon Texts -->
    <h1 class="text-3xl font-bold mb-2">{{ t('textsSettings.title') }}</h1>
    <div class="flex flex-row mb-5 items-center justify-between">
      <p class="mb-0 text-lg text-gray-600">{{ t('textsSettings.subtitle') }}</p>
      <v-btn color="primary" @click="handleSaveTexts" :disabled="textsLoading || isSaving">{{
        t('common.saveChanges')
      }}</v-btn>
    </div>

    <v-container>
      <!-- Hackathon Name -->
      <p class="mb-2 text-lg font-medium">
        {{ t('textsSettings.hackathonName') }} <span class="text-red-500">*</span>
      </p>
      <v-text-field
        v-model="hackathonTexts.hackathonName"
        :counter="hackathonNameMaxLength"
        variant="outlined"
        class="mb-0"
      />
      <p class="text-red-500 italic mb-5" v-if="!hackathonTexts.hackathonName && saveAttempted">
        {{ t('textsSettings.errors.requiredField') }}
      </p>
      <p
        class="text-red-500 italic mb-5"
        v-if="hackathonTexts.hackathonName.length > hackathonNameMaxLength"
      >
        {{ t('textsSettings.errors.maxLength', { max: hackathonNameMaxLength }) }}
      </p>

      <!-- Slogan -->
      <p class="mb-2 text-lg font-medium">{{ t('textsSettings.slogan') }}</p>
      <v-text-field
        v-model="hackathonTexts.slogan"
        :counter="sloganMaxLength"
        variant="outlined"
        dense
        class="mb-2"
      />
      <p
        class="text-red-500 italic mb-5"
        v-if="hackathonTexts.slogan && hackathonTexts.slogan.length > sloganMaxLength"
      >
        {{ t('textsSettings.errors.maxLength', { max: sloganMaxLength }) }}
      </p>

      <!-- Hackathon Description -->
      <p class="mb-2 text-lg font-medium">
        {{ t('textsSettings.hackathonDescription') }} <span class="text-red-500">*</span>
      </p>
      <v-textarea
        v-model="hackathonTexts.hackathonDescription"
        :counter="hackathonDescriptionMaxLength"
        variant="outlined"
        auto-grow
        rows="3"
        class="mb-0"
      />
      <p
        class="text-red-500 italic mb-5"
        v-if="!hackathonTexts.hackathonDescription && saveAttempted"
      >
        {{ t('textsSettings.errors.requiredField') }}
      </p>
      <p
        class="text-red-500 italic mb-5"
        v-if="hackathonTexts.hackathonDescription.length > hackathonDescriptionMaxLength"
      >
        {{ t('textsSettings.errors.maxLength', { max: hackathonDescriptionMaxLength }) }}
      </p>

      <!-- Location -->
      <p class="mb-2 text-lg font-medium">
        {{ t('textsSettings.location') }} <span class="text-red-500">*</span>
      </p>
      <v-text-field v-model="hackathonTexts.location" variant="outlined" dense class="mb-2" />

      <v-row>
        <v-col cols="12" md="6">
          <p class="mb-2 text-lg font-medium">
            {{ t('textsSettings.startDate') }} <span class="text-red-500">*</span>
          </p>
          <v-text-field
            v-model="hackathonTexts.startDate"
            type="datetime-local"
            variant="outlined"
            density="compact"
          />
        </v-col>

        <v-col cols="12" md="6">
          <p class="mb-2 text-lg font-medium">
            {{ t('textsSettings.endDate') }} <span class="text-red-500">*</span>
          </p>
          <v-text-field
            v-model="hackathonTexts.endDate"
            type="datetime-local"
            :min="hackathonTexts.startDate"
            variant="outlined"
            density="compact"
          />
        </v-col>
      </v-row>

      <div v-if="isDateError" class="mb-5">
        <p class="text-red-500 flex items-center gap-2">
          <v-icon color="red">mdi-alert-circle</v-icon>
          {{ t('textsSettings.errors.invalidDates') }}
        </p>
      </div>

      <div v-else-if="durationDisplay" class="mb-6">
        <v-chip color="primary" variant="tonal">
          <v-icon start icon="mdi-clock-outline"></v-icon>
          {{ t('textsSettings.totalDuration') }}: {{ durationDisplay }}
        </v-chip>
      </div>

      <AppSnackbar
        v-model="snackbar"
        :message="snackbarText"
        :timeout="snackbarTimeout"
        :error="snackbarError"
      />
    </v-container>
  </v-container>
</template>
