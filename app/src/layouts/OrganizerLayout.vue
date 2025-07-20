<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LanguageSelector from '../components/common/LanguageSelector.vue'
import Footer from '../components/common/Footer.vue'

const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-green-50">
    <header class="p-4 bg-green-600 text-white flex justify-between">
      <span>{{ t('header.organizer') }}</span>
      <LanguageSelector />
    </header>

    <main class="p-4 flex-grow">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

