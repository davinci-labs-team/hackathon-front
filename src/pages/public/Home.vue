<script setup lang="ts">
  import Partners from '@/components/public/Partners.vue'
  import Announcements from '@/components/common/Announcements.vue'
  import Info from '@/components/public/Info.vue'
  import { useI18n } from 'vue-i18n'
  import { watch, ref } from 'vue'
  import { useConfiguration } from '@/composables/useConfiguration'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'
  import { HackathonMediaDTO } from '@/types/config'
  import { defaultConfigurations } from '@/utils/configuration/defaultConfiguration'
  import { S3BucketService } from '@/services/s3BucketService'

  const { t } = useI18n()

  const { configuration: mediaConfig, loading: mediaLoading } = useConfiguration(
    ConfigurationKey.MEDIA
  )

  const mediaSettings = ref<HackathonMediaDTO>({ ...defaultConfigurations[ConfigurationKey.MEDIA] })
  const bannerFileInput = ref<File | null>(null)

  // Image par défaut si rien n'est trouvé
  const defaultBanner =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/NZ_default_banner.jpg/640px-NZ_default_banner.jpg'
  const bannerPicture = ref(defaultBanner)

  const fetchMediaUrls = async () => {
    // On vérifie dans mediaSettings (qui sera mis à jour par le watch)
    if (mediaSettings.value?.bannerPictureId) {
      try {
        const response = await S3BucketService.getFileUrlPublic(
          'public_files',
          mediaSettings.value.bannerPictureId
        )
        bannerPicture.value = response.url
      } catch (err) {
        console.error('Error fetching hackathon poster:', err)
        bannerPicture.value = defaultBanner
      }
    }
  }

  watch(
    mediaConfig,
    (newConfig) => {
      if (newConfig) {
        mediaSettings.value = {
          ...defaultConfigurations[ConfigurationKey.MEDIA],
          ...(newConfig.value as HackathonMediaDTO),
        }
        fetchMediaUrls()
      }
    },
    { immediate: true }
  )
  const getPreviewUrl = (file: File) => URL.createObjectURL(file)
</script>

<template>
  <v-container fluid class="py-8 px-6">
    <div class="flex w-full gap-2 mb-6 min-h-[300px]">
      <div class="w-1/4 flex items-start justify-center overflow-hidden" style="height: 100%">
        <img
          :src="bannerFileInput ? getPreviewUrl(bannerFileInput) : bannerPicture"
          alt="Hackathon Poster"
          class="h-auto max-h-[500px] w-auto object-contain object-top rounded"
        />
      </div>

      <div class="w-3/4 flex flex-col gap-6 rounded p-6 h-auto" style="height: 100%">
        <Info />
      </div>
    </div>

    <div class="flex w-full gap-6 mb-6 min-h-[400px]">
      <div class="w-1/4" style="height: 100%">
        <Partners />
      </div>

      <div class="w-3/4 flex flex-col gap-6 rounded p-6 bg-white shadow" style="height: 100%">
        <h2 class="text-3xl font-semibold mt-2 mb-3">
          {{ t('announcements.lastAnnouncements') }}
        </h2>
        <Announcements :items-per-page="5" :is-public="true" />
      </div>
    </div>
  </v-container>
</template>
