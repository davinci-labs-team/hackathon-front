<script setup lang="ts">
  import LanguageSelector from '@/components/common/LanguageSelector.vue'
  import logo from '@/assets/images/basic.jpg'

  import { RouterLink, useRoute } from 'vue-router'
  import { VBtn, VIcon } from 'vuetify/components'
  import { useI18n } from 'vue-i18n'
  import { getRole, getTPrefix } from '@/utils/auth'

  const { t } = useI18n()
  const route = useRoute()

  const role = getRole()
  const tPrefix = getTPrefix(role)

  const getLinkClasses = (path: string) => {
    const base = 'rounded px-2 py-1 transition-transform transition-colors duration-200'
    const isActive = route.path === path
    return [
      base,
      isActive ? 'font-bold bg-green-700 scale-102' : '',
      'hover:bg-green-800 hover:scale-105',
    ].join(' ')
  }
</script>

<template>
  <header class="p-4 bg-green-600 text-white flex justify-between items-center">
    <div class="flex items-center gap-4">
      <img :src="logo" alt="Logo" class="h-12" />
    </div>

    <nav class="flex gap-6">
      <RouterLink to="/user/dashboard" :class="getLinkClasses('/user/dashboard')">
        {{ t(`${tPrefix}.nav.dashboard`) }}
      </RouterLink>

      <RouterLink to="/user/teams" :class="getLinkClasses('/user/teams')">
        {{ t(`${tPrefix}.nav.teams`) }}
      </RouterLink>

      <RouterLink to="/user/projects" :class="getLinkClasses('/user/projects')">
        {{ t(`${tPrefix}.nav.projects`) }}
      </RouterLink>

      <RouterLink to="/user/faq" :class="getLinkClasses('/user/faq')">
        {{ t(`${tPrefix}.nav.faq`) }}
      </RouterLink>
    </nav>

    <div class="flex items-center gap-4">
      <LanguageSelector />
      <RouterLink to="/user/profile" class="text-white">
        <VBtn icon class="bg-transparent">
          <VIcon size="36">mdi-account-circle</VIcon>
        </VBtn>
      </RouterLink>
    </div>
  </header>
</template>
