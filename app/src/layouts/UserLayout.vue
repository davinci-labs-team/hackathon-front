<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import Footer from '@/components/common/Footer.vue'
  import NavBarUser from '@/components/user/NavBarUser.vue'

  const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white">
    <NavBarUser />

    <main class="p-4 flex-grow">
      <router-view />
    </main>

    <Footer />
  </div>
</template>
