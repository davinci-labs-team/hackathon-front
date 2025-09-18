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

  const bannerFile = ref<File | null>(null)
  const logoFile = ref<File | null>(null)

  const settingsId = ref('1')

  // Snackbar
  const snackbar = ref(false)
  const text = ref(t('common.changesSaved'))
  const timeout = ref(1500)
  const error = ref(false)

  onMounted(async () => {
    try {
      const response = await settingsService.findWithKey('media')
      if (response && response.value) {
        mediaSettings.value = response.value
        settingsId.value = response.id
        console.log('Settings ID:', settingsId.value)
      }
    } catch (error) {
      console.error('Error fetching media settings:', error)
    }
  })

  const getPreviewUrl = (file: File) => URL.createObjectURL(file)

  const handleSave = async () => {
    const payload = {
      key: 'media',
      value: mediaSettings.value,
    }

    return settingsService
      .update('1', payload)
      .then(() => {
        text.value = t('common.changesSaved')
        error.value = false
        snackbar.value = true
      })
      .catch((err) => {
        console.error('Error updating media settings:', err)
        text.value = t('common.errorOccurred')
        error.value = true
        snackbar.value = true
      })
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
      <p class="mb-4 text-lg font-semibold text-gray-700">
        {{ t('mediaSettings.platformImages') }}
      </p>

      <div class="mb-4 flex flex-row items-center gap-4">
        <!-- File input -->
        <v-file-input
          v-model="bannerFile"
          :label="t('mediaSettings.banner')"
          prepend-icon="mdi-image"
          accept="image/*"
          class="flex-1"
        />

        <!-- Image preview -->
        <v-img
          v-if="bannerFile || mediaSettings.bannerPictureId"
          :src="
            bannerFile ? getPreviewUrl(bannerFile) : `/api/media/${mediaSettings.bannerPictureId}`
          "
          alt="Current Banner"
          max-height="150"
          max-width="200"
          contain
        />
      </div>

      <div class="mb-4 flex flex-row items-center gap-4">
        <!-- File input -->
        <v-file-input
          v-model="logoFile"
          :label="t('mediaSettings.logo')"
          prepend-icon="mdi-image"
          accept="image/*"
          class="flex-1"
        />

        <!-- Image preview -->
        <v-img
          v-if="logoFile || mediaSettings.hackathonLogoId"
          :src="logoFile ? getPreviewUrl(logoFile) : `/api/media/${mediaSettings.hackathonLogoId}`"
          alt="Current Banner"
          max-height="150"
          max-width="200"
          contain
        />
      </div>

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
