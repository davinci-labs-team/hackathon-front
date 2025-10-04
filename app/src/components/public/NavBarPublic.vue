<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import LanguageSelector from '@/components/common/LanguageSelector.vue'
  import { HackathonMediaDTO } from '@/types/config'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'
  import { defaultConfigurations } from '@/utils/configuration/defaultConfiguration'
  import { onMounted, ref } from 'vue'
  import { getOrCreateConfiguration } from '@/services/configurationService'
  import { S3BucketService } from '@/services/s3BucketService'

  const { t } = useI18n()

  const mediaSettings = ref<HackathonMediaDTO>({...defaultConfigurations[ConfigurationKey.MEDIA]})
  const logoPicture = ref('https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg')

  const getLogoPictureUrl = async () => {
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
        getLogoPictureUrl()
      }
    } catch (error) {
      console.error('Error fetching media settings:', error)
    }
  })
</script>

<template>
  <header class="p-4 bg-white shadow flex justify-between items-center">
    <div class="flex items-center gap-4">
      <router-link to="/">
        <img :src="logoPicture" alt="Logo" class="h-12" />
      </router-link>
    </div>

    <div class="flex items-center gap-4">
      <LanguageSelector />
      <router-link to="/login">
        <v-btn color="primary" elevation="1" class="text-white">
          {{ t('login.title') }}
        </v-btn>
      </router-link>
    </div>
  </header>
</template>
