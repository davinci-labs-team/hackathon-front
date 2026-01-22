<script setup lang="ts">
  import Footer from '@/components/common/Footer.vue'
  import NavBarUser from '@/components/user/NavBarUser.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <NavBarUser class="flex-none" />

    <main class="flex-grow p-4">
      <v-container>
        <router-view />
      </v-container>
    </main>

    <Footer class="flex-none h-[10vh]" />
  </div>
</template>
