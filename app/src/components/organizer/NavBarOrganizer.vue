<script setup lang="ts">
  import LanguageSelector from '../common/LanguageSelector.vue'
  import logo from '@/assets/images/basic.jpg'
  import { RouterLink, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'

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
</script>

<template>
  <header class="p-4 bg-green-600 text-white flex justify-between items-center">
    <!-- Logo -->
    <div class="flex items-center gap-4">
      <img :src="logo" alt="Logo" class="h-12" />
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
