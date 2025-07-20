<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Footer from '../components/common/Footer.vue'
import NavBarOrganizer from '../components/organizer/NavBarOrganizer.vue'

const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-green-50">
    <NavBarOrganizer />
    
    <main class="p-4 flex-grow">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

