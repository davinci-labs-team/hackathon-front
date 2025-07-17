<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LanguageSelector from '../components/common/LanguageSelector.vue'

const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen bg-green-50">
    <header class="p-4 bg-green-600 text-white flex justify-between">
      <span>{{ t('header.organizer') }}</span>
      <LanguageSelector />
    </header>
    <main class="p-4">
      <router-view />
    </main>
  </div>
</template>
