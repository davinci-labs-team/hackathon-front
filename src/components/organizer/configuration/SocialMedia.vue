<script setup lang="ts">
  import { onMounted, watch, ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import AppSnackbar from '@/components/common/AppSnackbar.vue'
  import { HackathonMediaDTO } from '@/types/config'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'
  import { defaultConfigurations } from '@/utils/configuration/defaultConfiguration'
  import { S3BucketService } from '@/services/s3BucketService'
  import { useConfiguration } from '@/composables/useConfiguration'
  import { getOrCreateConfiguration } from '@/services/configurationService'

  const { t } = useI18n()

  const {
    configuration: mediaConfig,
    loading: mediaLoading,
    error: mediaError,
    updateConfiguration: updateMediaConfig,
  } = useConfiguration(ConfigurationKey.MEDIA)

  const mediaSettings = ref<HackathonMediaDTO>({ ...defaultConfigurations[ConfigurationKey.MEDIA] })

  const isSaving = ref(false)

  const bannerFileInput = ref<File | null>(null)
  const logoFileInput = ref<File | null>(null)
  const bannerPicture = ref(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/NZ_default_banner.jpg/640px-NZ_default_banner.jpg'
  )
  const logoPicture = ref('https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg')
  const evaluationGridFileInput = ref<File | null>(null)
  const evaluationGridUrl = ref<string | null>(null)

  const evaluationGridLabel = computed(() => {
    if (evaluationGridFileInput.value) {
      return t('mediaSettings.uploadEvaluationGrid')
    }
    if (mediaSettings.value.evaluationGridPath) {
      return mediaSettings.value.evaluationGridPath
    }
    return t('mediaSettings.uploadEvaluationGrid')
  })

  // Snackbar
  const snackbar = ref(false)
  const text = ref(t('common.changesSaved'))
  const timeout = ref(1500)
  const error = ref(false)

  const fetchMediaUrls = async () => {
    if (mediaSettings.value?.bannerPictureId) {
      try {
        const response = await S3BucketService.getFileUrlPublic(
          'public_files',
          mediaSettings.value.bannerPictureId
        )
        bannerPicture.value = response.url
      } catch (err) {
        console.error('Error fetching banner picture:', err)
      }
    }
    if (mediaSettings.value?.hackathonLogoId) {
      try {
        const response = await S3BucketService.getFileUrlPublic(
          'public_files',
          mediaSettings.value.hackathonLogoId
        )
        logoPicture.value = response.url
      } catch (err) {
        console.error('Error fetching logo picture:', err)
      }
    }
    if (mediaSettings.value?.evaluationGridPath) {
      try {
        const response = await S3BucketService.getFileUrl(
          'public_files',
          mediaSettings.value.evaluationGridPath
        )
        evaluationGridUrl.value = response.url
      } catch (err) {
        console.error('Error fetching evaluation grid:', err)
      }
    }
  }

  onMounted(async () => {
    try {
      const response = await getOrCreateConfiguration(ConfigurationKey.MEDIA)
      if (response && response.value) {
        mediaSettings.value = response.value as HackathonMediaDTO
        fetchMediaUrls()
      }
    } catch (error) {
      console.error('Error fetching media settings:', error)
    }
  })

  const getPreviewUrl = (file: File) => URL.createObjectURL(file)

  // TODO: wait for backend support to delete files
  /*const deleteOldFileIfNeeded = async (oldFileId?: string) => {
      if (!oldFileId) return
      try {
        await S3BucketService.deleteFile(oldFileId)
      } catch (err) {
        console.warn(`Erreur lors de la suppression du fichier ${oldFileId} :`, err)
      }
    }*/

  const downloadEvaluationGridFile = async () => {
    if (!mediaSettings.value?.evaluationGridPath) return
    try {
      const { url } = await S3BucketService.getFileUrl(
        'public_files',
        mediaSettings.value.evaluationGridPath
      )
      window.open(url, '_blank')
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  const uploadFileAndReplace = async (
    file: File | null,
    oldFileId?: string | null
  ): Promise<string | null> => {
    if (!file) return oldFileId ?? null
    //await deleteOldFileIfNeeded(oldFileId ?? undefined)
    const uploaded = await S3BucketService.uploadFile(file, 'public_files')
    return uploaded.path
  }

  const handleBannerUpdate = async () => {
    mediaSettings.value.bannerPictureId = await uploadFileAndReplace(
      bannerFileInput.value,
      mediaSettings.value.bannerPictureId
    )
  }

  const handleLogoUpdate = async () => {
    mediaSettings.value.hackathonLogoId = await uploadFileAndReplace(
      logoFileInput.value,
      mediaSettings.value.hackathonLogoId
    )
  }

  const handleEvaluationGridUpdate = async () => {
    mediaSettings.value.evaluationGridPath = await uploadFileAndReplace(
      evaluationGridFileInput.value,
      mediaSettings.value.evaluationGridPath
    )
  }

  const handleSave = async () => {
    if (
      (!mediaSettings.value.bannerPictureId && !bannerFileInput.value) ||
      (!mediaSettings.value.hackathonLogoId && !logoFileInput.value) ||
      (!mediaSettings.value.evaluationGridPath && !evaluationGridFileInput.value)
    ) {
      snackbar.value = true
      text.value = t('mediaSettings.missingFiles')
      error.value = true
      return
    }

    isSaving.value = true
    try {
      await handleBannerUpdate()
      await handleLogoUpdate()
      await handleEvaluationGridUpdate()

      await updateMediaConfig({ value: mediaSettings.value })

      snackbar.value = true
      text.value = t('common.changesSaved')
      error.value = false

      await fetchMediaUrls()
      bannerFileInput.value = null
      logoFileInput.value = null
      evaluationGridFileInput.value = null
    } catch (err) {
      console.error(err)
      snackbar.value = true
      text.value = t('common.error')
      error.value = true
    } finally {
      isSaving.value = false
    }
  }
</script>

<template>
  <v-container class="py-10 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-2">{{ t('mediaSettings.title') }}</h1>
    <div class="flex-direction-row mb-5 flex items-center justify-between">
      <p class="mb-0 text-lg text-gray-600">{{ t('mediaSettings.subtitle') }}</p>
      <v-btn color="primary" @click="handleSave" :disabled="mediaLoading || isSaving">{{
        t('common.saveChanges')
      }}</v-btn>
    </div>

    <AppSnackbar v-model="snackbar" :message="text" :timeout="timeout" :error="error" />

    <v-container>
      <p class="mb-4 text-lg font-semibold text-gray-700">
        {{ t('mediaSettings.platformImages') }}
        <span class="text-red-500">*</span>
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
          class="bg-black rounded p-2"
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
          class="bg-black rounded p-2"
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

      <p class="mb-4 text-lg font-semibold text-gray-700">
        {{ t('mediaSettings.evaluationGrid') }}
        <span class="text-red-500">*</span>
      </p>

      <div class="mb-4 flex flex-row items-center gap-4">
        <!-- File input -->
        <v-file-input
          v-model="evaluationGridFileInput"
          :label="evaluationGridLabel"
          :hint="t('mediaSettings.uploadHint')"
          prepend-icon="mdi-file-upload"
          accept=".docx,.xlsx"
          class="flex-1"
        />

        <!-- Preview -->
        <div
          v-if="evaluationGridUrl && !evaluationGridFileInput"
          class="flex flex-col items-center"
        >
          <v-btn
            variant="outlined"
            size="small"
            prepend-icon="mdi-download"
            @click="downloadEvaluationGridFile"
          >
            {{ t('common.download') }}
          </v-btn>
        </div>
      </div>
    </v-container>
  </v-container>
</template>
