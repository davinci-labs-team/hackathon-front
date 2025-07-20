<script setup lang="ts">
import LanguageSelector from '../common/LanguageSelector.vue';
import logo from '@/assets/images/basic.jpg'
</script>

<template>
  <header class="p-4 bg-green-600 text-white flex justify-between items-center">
    <div class="flex items-center gap-4">
      <img :src="logo" alt="Logo" class="h-12" />
    </div>

      
    <div class="flex items-center gap-4">
      <LanguageSelector />
      <RouterLink to="/user/profile" class="text-white">
        <VBtn icon class="bg-transparent">
          <VIcon size="36">mdi-account-circle</VIcon>
        </VBtn>
      </RouterLink>
    </div>
  </header>
</template>
