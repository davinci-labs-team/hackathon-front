<script setup lang="ts">
  import LanguageSelector from '@/components/common/LanguageSelector.vue'
  import { RouterLink, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { getRole, getTPrefix } from '@/utils/user'
  import { useHackathonLogo } from '@/composables/useHackathonLogo'

  const { t } = useI18n()
  const route = useRoute()
  const role = getRole()
  const tPrefix = getTPrefix(role, true)

  const menuItems = [
    { path: '/expert/dashboard', label: `${tPrefix}.nav.dashboard` },
    { path: '/expert/teams', label: `${tPrefix}.nav.teams` },
    { path: '/expert/project', label: `${tPrefix}.nav.projects` },
    { path: '/expert/faq', label: `${tPrefix}.nav.faq` },
  ]

  const getLinkClasses = (path: string) => {
    const base = 'rounded px-2 py-1 transition-transform transition-colors duration-200'
    return [
      base,
      route.path === path ? 'font-bold bg-green-700 scale-102' : '',
      'hover:bg-green-800 hover:scale-105',
    ].join(' ')
  }

  const { logoPicture } = useHackathonLogo()
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
      <RouterLink to="/expert/profile">
        <v-btn icon class="bg-transparent">
          <v-icon size="36">mdi-account-circle</v-icon>
        </v-btn>
      </RouterLink>
    </div>
  </header>
</template>
