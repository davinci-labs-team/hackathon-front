<script setup lang="ts">
  import Footer from '@/components/common/Footer.vue'
  import NavBarOrganizer from '@/components/organizer/NavBarOrganizer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white">
    <NavBarOrganizer class="flex-none" />

    <main class="p-4 flex-grow">
      <router-view />
    </main>

    <Footer class="flex-none h-[10vh]" />
  </div>
</template>
