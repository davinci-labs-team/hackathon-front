<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import Partners from '@/components/public/Partners.vue'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'
  import { HackathonMediaDTO } from '@/types/config'
  import { defaultConfigurations } from '@/utils/configuration/defaultConfiguration'
  import { ref, onMounted } from 'vue'
  import { S3BucketService } from '@/services/s3BucketService'
  import { getOrCreateConfiguration } from '@/services/configurationService'
  import { useAuthStore } from '@/stores/auth'
  import LatestAnnouncementsPreview from '@/components/common/LatestAnnouncementsPreview.vue'
  import ParticipantTask from '@/components/user/ParticipantTask.vue'

  const { t } = useI18n()

  const { user } = useAuthStore()

  const mediaSettings = ref<HackathonMediaDTO>({ ...defaultConfigurations[ConfigurationKey.MEDIA] })

  const bannerFileInput = ref<File | null>(null)
  const bannerPicture = ref(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/NZ_default_banner.jpg/640px-NZ_default_banner.jpg'
  )

  const fetchBannerUrl = async () => {
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
  }

  const getPreviewUrl = (file: File) => URL.createObjectURL(file)

  onMounted(async () => {
    try {
      const response = await getOrCreateConfiguration(ConfigurationKey.MEDIA)
      if (response && response.value) {
        mediaSettings.value = response.value as HackathonMediaDTO
        fetchBannerUrl()
      }
    } catch (error) {
      console.error('Error fetching media settings:', error)
    }
  })
</script>

<template>
  <v-container>
    <div class="flex w-full gap-2 mb-6 min-h-[300px]">
      <div class="w-1/4 flex items-start justify-center overflow-hidden" style="height: 100%">
        <img
          :src="bannerFileInput ? getPreviewUrl(bannerFileInput) : bannerPicture"
          alt="Hackathon Poster"
          class="h-auto max-h-[500px] w-auto object-contain object-top rounded"
        />
      </div>

      <div class="w-3/4 flex flex-col gap-6 rounded p-2 h-auto" style="height: 100%">
        <h3 class="text-3xl font-semibold mt-2">
          {{ t('dashboard.welcome', { firstname: user?.firstname }) }}
        </h3>
        <LatestAnnouncementsPreview />
      </div>
    </div>
    <div class="flex w-full gap-6 mb-6 min-h-[400px]">
      <div class="w-1/4" style="height: 100%">
        <Partners />
      </div>
      <div class="w-3/4 flex flex-col gap-6" style="height: 100%">
        <ParticipantTask />
      </div>
    </div>
  </v-container>
</template>
