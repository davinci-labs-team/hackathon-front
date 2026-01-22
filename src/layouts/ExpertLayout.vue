<script setup lang="ts">
  import Footer from '@/components/common/Footer.vue'
  import NavBarExpert from '@/components/expert/NavBarExpert.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white">
    <NavBarExpert class="flex-none" />

    <main class="flex-grow p-4">
      <v-container>
        <router-view />
      </v-container>
    </main>

    <Footer class="flex-none h-[10vh]" />
  </div>
</template>
