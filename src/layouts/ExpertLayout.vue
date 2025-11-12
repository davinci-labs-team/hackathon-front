<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import Footer from '@/components/common/Footer.vue'
  import NavBarExpert from '@/components/expert/NavBarExpert.vue'

  const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white">
    <NavBarExpert />

    <main class="p-4 flex-grow">
      <router-view />
    </main>

    <Footer />
  </div>
</template>
