<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LanguageSelector from '../components/common/LanguageSelector.vue'

const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen bg-purple-50">
    <header class="p-4 bg-purple-600 text-white flex justify-between">
      <span>{{ t('header.user') }}</span>
      <LanguageSelector />
    </header>
    <main class="p-4">
      <router-view />
    </main>
  </div>
</template>
