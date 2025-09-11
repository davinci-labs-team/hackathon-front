<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { settingsService } from '@/services/settingsService'
  import AppSnackbar from '@/components/common/AppSnackbar.vue'
  import { HackathonMediaDTO } from '@/types/hackathon'

  const { t } = useI18n()

  const mediaSettings = ref<HackathonMediaDTO>({
    bannerPictureId: null,
    hackathonLogoId: null,
    instagram: '',
    linkedin: '',
    facebook: '',
    x: '',
    youtube: '',
  })

  // Snackbar
  const snackbar = ref(false)
  const text = ref(t('common.changesSaved'))
  const timeout = ref(1500)
  const error = ref(false)

  onMounted(async () => {
    try {
      const response = await settingsService.findWithKey('1', 'media')
      if (response && response.value) {
        mediaSettings.value = response.value
      }
    } catch (error) {
      console.error('Error fetching media settings:', error)
    }
  })

  const handleSave = async () => {
    snackbar.value = true
    error.value = false
  }
</script>

<template>
  <v-container class="py-10 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-2">{{ t('mediaSettings.title') }}</h1>
    <div class="flex-direction-row mb-5 flex items-center justify-between">
      <p class="mb-0 text-lg text-gray-600">{{ t('mediaSettings.subtitle') }}</p>
      <v-btn color="primary" @click="handleSave">{{ t('common.saveChanges') }}</v-btn>
    </div>

    <AppSnackbar v-model="snackbar" :message="text" :timeout="timeout" :error="error" />

    <v-container>
      <!-- Social Media Links (two columns) -->
      <p class="mb-4 text-lg font-semibold text-gray-700">
        {{ t('mediaSettings.socialMediaLinks') }}
      </p>

      <v-row class="mb-6 gap-4">
  <v-col cols="12" md="5" class="flex items-center gap-2">
    <v-icon size="28">mdi-linkedin</v-icon>
    <v-text-field
      v-model="mediaSettings.linkedin"
      :placeholder="t('mediaSettings.linkedin')"
      variant="outlined"
      density="comfortable"
      hide-details
      class="flex-1"
    />
  </v-col>

  <v-col cols="12" md="5" class="flex items-center gap-2">
    <v-icon size="28">mdi-facebook</v-icon>
    <v-text-field
      v-model="mediaSettings.facebook"
      :placeholder="t('mediaSettings.facebook')"
      variant="outlined"
      density="comfortable"
      hide-details
      class="flex-1"
    />
  </v-col>

  <v-col cols="12" md="5" class="flex items-center gap-2">
    <v-icon size="28">mdi-instagram</v-icon>
    <v-text-field
      v-model="mediaSettings.instagram"
      :placeholder="t('mediaSettings.instagram')"
      variant="outlined"
      density="comfortable"
      hide-details
      class="flex-1"
    />
  </v-col>

  <v-col cols="12" md="5" class="flex items-center gap-2">
    <v-icon size="28">mdi-twitter</v-icon>
    <v-text-field
      v-model="mediaSettings.x"
      :placeholder="t('mediaSettings.x')"
      variant="outlined"
      density="comfortable"
      hide-details
      class="flex-1"
    />
  </v-col>

  <v-col cols="12" md="5" class="flex items-center gap-2">
    <v-icon size="28">mdi-youtube</v-icon>
    <v-text-field
      v-model="mediaSettings.youtube"
      :placeholder="t('mediaSettings.youtube')"
      variant="outlined"
      density="comfortable"
      hide-details
      class="flex-1"
    />
  </v-col>
</v-row>

    </v-container>
  </v-container>
</template>
