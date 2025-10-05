<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import LanguageSelector from '@/components/common/LanguageSelector.vue'
  import { useHackathonLogo } from '@/composables/useHackathonLogo'

  const { t } = useI18n()

  const { logoPicture } = useHackathonLogo()
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
