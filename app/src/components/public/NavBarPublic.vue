<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LanguageSelector from '../common/LanguageSelector.vue'
import logo from '@/assets/images/basic.jpg'

const { t } = useI18n()
</script>

<template>
  <header class="p-4 bg-white shadow flex justify-between items-center">
    <div class="flex items-center gap-4">
      <img :src="logo" alt="Logo" class="h-12" />
    </div>

    <div class="flex items-center gap-4">
      <LanguageSelector />
      <router-link to="/login">
        <v-btn color="primary" elevation="1" class="text-white">
          {{ t('login.title') }}
        </v-btn>
      </router-link>
    </div>
  </header>
</template>
