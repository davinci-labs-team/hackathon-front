<script setup lang="ts">
import LanguageSelector from '../common/LanguageSelector.vue';
import logo from '@/assets/images/basic.jpg'
import { RouterLink, useRoute } from 'vue-router';
import { VBtn, VIcon } from 'vuetify/components'

const route = useRoute()

const getLinkClasses = (path: string) => {
  const base = 'rounded px-2 py-1 transition-transform transition-colors duration-200'
  const isActive = route.path === path
  return [
    base,
    isActive ? 'font-bold bg-green-700 scale-102' : '',
    'hover:bg-green-800 hover:scale-105'
  ].join(' ')
}
</script>

<template>
  <header class="p-4 bg-green-600 text-white flex justify-between items-center">
    <div class="flex items-center gap-4">
      <img :src="logo" alt="Logo" class="h-12" />
    </div>

    <!-- Onglets -->
    <nav class="flex gap-6">
      <RouterLink
        to="/organizer/dashboard"
        :class="getLinkClasses('/organizer/dashboard')"
      >Dashboard</RouterLink>

      <RouterLink
        to="/organizer/users"
        :class="getLinkClasses('/organizer/users')"
      >Gestion des utilisateurs</RouterLink>
      
      <RouterLink
        to="/organizer/participants"
        :class="getLinkClasses('/organizer/participants')"
      >Gestion des équipes</RouterLink>
    
      <RouterLink
        to="/organizer/settings"
        :class="getLinkClasses('/organizer/settings')"
      >Gestion des dépôts</RouterLink>

      <RouterLink
        to="/organizer/params"
        :class="getLinkClasses('/organizer/params')"
      >Paramètres</RouterLink>

    </nav>

    <div class="flex items-center gap-4">
      <LanguageSelector />
      <RouterLink to="/organizer/profile" class="text-white">
        <VBtn icon class="bg-transparent">
          <VIcon size="36">mdi-account-circle</VIcon>
        </VBtn>
      </RouterLink>
    </div>
  </header>
</template>
