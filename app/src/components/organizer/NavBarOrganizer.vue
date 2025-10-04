<script setup lang="ts">
  import LanguageSelector from '../common/LanguageSelector.vue'
  import { RouterLink, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { HackathonMediaDTO } from '@/types/config'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'
  import { defaultConfigurations } from '@/utils/configuration/defaultConfiguration'
  import { onMounted, ref } from 'vue'
  import { getOrCreateConfiguration } from '@/services/configurationService'
  import { S3BucketService } from '@/services/s3BucketService'

  const { t } = useI18n()
  const route = useRoute()

  const menuItems = [
    { path: '/organizer/announcements', label: 'organizer.nav.announcements' },
    { path: '/organizer/users', label: 'organizer.nav.users' },
    { path: '/organizer/teams', label: 'organizer.nav.teams' },
    { path: '/organizer/projects', label: 'organizer.nav.projects' },
    { path: '/organizer/themes', label: 'organizer.nav.themes' },
    { path: '/organizer/settings', label: 'organizer.nav.settings' },
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
      <RouterLink to="/organizer/profile">
        <v-btn icon class="bg-transparent">
          <v-icon size="36">mdi-account-circle</v-icon>
        </v-btn>
      </RouterLink>
    </div>
  </header>
</template>
