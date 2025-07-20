<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <v-container class="text-center py-16">
    <h1 class="text-4xl font-bold mb-6">{{ t('home.title') }}</h1>
    <router-link to="/login">
      <v-btn color="primary" variant="outlined">{{ t('home.loginLink') }}</v-btn>
    </router-link>
  </v-container>
</template>
