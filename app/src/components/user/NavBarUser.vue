<script setup lang="ts">
  import LanguageSelector from '@/components/common/LanguageSelector.vue'
  import { RouterLink, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { getRole, getTPrefix } from '@/utils/user'
  import { HackathonMediaDTO } from '@/types/config'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'
  import { defaultConfigurations } from '@/utils/configuration/defaultConfiguration'
  import { onMounted, ref } from 'vue'
  import { getOrCreateConfiguration } from '@/services/configurationService'
  import { S3BucketService } from '@/services/s3BucketService'

  const { t } = useI18n()
  const route = useRoute()

  const role = getRole()
  const tPrefix = getTPrefix(role, true)

  const menuItems = [
    { path: '/user/dashboard', label: `${tPrefix}.nav.dashboard` },
    { path: '/user/team', label: `${tPrefix}.nav.teams` },
    { path: '/user/project', label: `${tPrefix}.nav.projects` },
    { path: '/user/faq', label: `${tPrefix}.nav.faq` },
  ]

  const getLinkClasses = (path: string) => {
    const base = 'rounded px-2 py-1 transition-transform transition-colors duration-200'
    return [
      base,
      route.path === path ? 'font-bold bg-green-700 scale-102' : '',
      'hover:bg-green-800 hover:scale-105',
    ].join(' ')
  }

  const mediaSettings = ref<HackathonMediaDTO>({...defaultConfigurations[ConfigurationKey.MEDIA]})
  const logoPicture = ref('https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/NZ_default_banner.jpg/640px-NZ_default_banner.jpg')

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
  <header class="p-4 bg-green-600 text-white flex justify-between items-center">
    <!-- Logo -->
    <div class="flex items-center gap-4">
      <img :src="logoPicture" alt="Logo" class="h-12" />
    </div>

    <!-- Navigation -->
    <nav class="flex gap-6">
      <RouterLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        :class="getLinkClasses(item.path)"
      >
        {{ t(item.label) }}
      </RouterLink>
    </nav>

    <!-- Actions (Language + Profile) -->
    <div class="flex items-center gap-4">
      <LanguageSelector />
      <RouterLink to="/user/profile">
        <v-btn icon class="bg-transparent">
          <v-icon size="36">mdi-account-circle</v-icon>
        </v-btn>
      </RouterLink>
    </div>
  </header>
</template>
