<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { configurationService, getOrCreateConfiguration } from '@/services/configurationService'
  import AppSnackbar from '@/components/common/AppSnackbar.vue'
  import { HackathonMediaDTO } from '@/types/config'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'
  import { defaultConfigurations } from '@/utils/configuration/defaultConfiguration'
  import { S3BucketService } from '@/services/s3BucketService'

  const { t } = useI18n()

  const mediaSettings = ref<HackathonMediaDTO>({...defaultConfigurations[ConfigurationKey.MEDIA]})

  const bannerFileInput = ref<File | null>(null)
  const logoFileInput = ref<File | null>(null)
  const bannerPicture = ref('https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/NZ_default_banner.jpg/640px-NZ_default_banner.jpg')
  const logoPicture = ref('https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg')

  // Snackbar
  const snackbar = ref(false)
  const text = ref(t('common.changesSaved'))
  const timeout = ref(1500)
  const error = ref(false)

  const getBannerAndLogoPictureUrl = async () => {
    if (mediaSettings.value?.bannerPictureId) {
      try {
        const response = await S3BucketService.getFileUrl(mediaSettings.value.bannerPictureId)
        bannerPicture.value = response.url
      } catch (err) {
        console.error('Error fetching banner picture:', err)
      }
    }
    if (mediaSettings.value?.hackathonLogoId) {
      try {
        const response = await S3BucketService.getFileUrl(mediaSettings.value.hackathonLogoId)
        logoPicture.value = response.url
      } catch (err) {
        console.error('Error fetching logo picture:', err)
      }
    }
  }

  onMounted(async () => {
    try {
      const response = await getOrCreateConfiguration(ConfigurationKey.MEDIA)
      console.log('Fetched media settings:', response)
      if (response && response.value) {
        mediaSettings.value = response.value as HackathonMediaDTO
        getBannerAndLogoPictureUrl()
      }
    } catch (error) {
      console.error('Error fetching media settings:', error)
    }
  })

  const getPreviewUrl = (file: File) => URL.createObjectURL(file)

  const handleSave = async () => {
    try {
      if (bannerFileInput.value)
        mediaSettings.value.bannerPictureId = (await S3BucketService.uploadFile(bannerFileInput.value)).path
      if (logoFileInput.value)
        mediaSettings.value.hackathonLogoId = (await S3BucketService.uploadFile(logoFileInput.value)).path

      await configurationService.update(ConfigurationKey.MEDIA, {
        value: mediaSettings.value,
      })
      snackbar.value = true
      text.value = t('common.changesSaved')
      error.value = false
    } catch (err) {
      console.error(err)
      snackbar.value = true
      text.value = t('common.errorSaving')
      error.value = true
    }
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
          v-model="bannerFileInput"
          :label="t('mediaSettings.banner')"
          prepend-icon="mdi-image"
          accept="image/*"
          class="flex-1"
        />

        <!-- Image preview -->
        <v-img
          v-if="bannerFileInput || mediaSettings.bannerPictureId"
          :src="bannerFileInput ? getPreviewUrl(bannerFileInput) : bannerPicture"
          alt="Current Banner"
          max-height="150"
          max-width="200"
          contain
        />
      </div>

      <div class="mb-4 flex flex-row items-center gap-4">
        <!-- File input -->
        <v-file-input
          v-model="logoFileInput"
          :label="t('mediaSettings.logo')"
          prepend-icon="mdi-image"
          accept="image/*"
          class="flex-1"
        />

        <!-- Image preview -->
        <v-img
          v-if="logoFileInput || mediaSettings.hackathonLogoId"
          :src="logoFileInput ? getPreviewUrl(logoFileInput) : logoPicture"
          alt="Current Logo"
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
