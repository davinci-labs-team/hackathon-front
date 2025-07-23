<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import Footer from '@/components/common/Footer.vue'
  import NavBarPublic from '@/components/public/NavBarPublic.vue'

  const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 justify-between">
    <NavBarPublic />

    <main class="p-">
      <router-view />
    </main>

    <Footer />
  </div>
</template>
