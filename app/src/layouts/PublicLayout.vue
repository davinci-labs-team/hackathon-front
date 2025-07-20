<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LanguageSelector from '../components/common/LanguageSelector.vue'
import Footer from '../components/common/Footer.vue'

const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 justify-between">
    <header class="p-4 bg-blue-500 text-white flex justify-between">
      <span>{{ t('header.public') }}</span>
      <LanguageSelector />
    </header>

    <main class="p-4">
      <router-view />
    </main>

    <Footer />
  </div>
</template>
