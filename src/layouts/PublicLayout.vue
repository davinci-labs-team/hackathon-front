<script setup lang="ts">
  import Footer from '@/components/common/Footer.vue'
  import NavBarPublic from '@/components/public/NavBarPublic.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <NavBarPublic class="flex-none" />

    <main class="flex-grow">
      <router-view />
    </main>

    <Footer class="flex-none h-[10vh]" />
  </div>
</template>
