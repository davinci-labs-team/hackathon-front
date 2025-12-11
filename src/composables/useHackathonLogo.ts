import { ref, onMounted } from 'vue'
import { HackathonMediaDTO } from '@/types/config'
import { ConfigurationKey } from '@/utils/configuration/configurationKey'
import { defaultConfigurations } from '@/utils/configuration/defaultConfiguration'
import { getOrCreateConfiguration } from '@/services/configurationService'
import { S3BucketService } from '@/services/s3BucketService'

const DEFAULT_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'

export function useHackathonLogo(defaultLogoUrl: string = DEFAULT_LOGO) {
  const mediaSettings = ref<HackathonMediaDTO>({
    ...defaultConfigurations[ConfigurationKey.MEDIA]
  })
  const logoPicture = ref(defaultLogoUrl)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  const fetchLogoPicture = async () => {
    if (mediaSettings.value?.hackathonLogoId) {
      try {
        const response = await S3BucketService.getFileUrl('public_files', mediaSettings.value.hackathonLogoId)
        logoPicture.value = response.url
      } catch (err) {
        console.error('Error fetching logo picture:', err)
        error.value = err as Error
      }
    }
  }

  const loadLogo = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await getOrCreateConfiguration(ConfigurationKey.MEDIA)

      if (response && response.value) {
        mediaSettings.value = response.value as HackathonMediaDTO
        await fetchLogoPicture()
      }
    } catch (err) {
      console.error('Error fetching media settings:', err)
      error.value = err as Error
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    loadLogo()
  })

  return {
    logoPicture,
    mediaSettings,
    isLoading,
    error,
    loadLogo
  }
}