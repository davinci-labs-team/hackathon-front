<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="text-center">
    <h1 class="text-4xl font-bold mb-4">{{ t('home.title') }}</h1>
    <router-link to="/login" class="text-blue-600 underline">
      {{ t('home.loginLink') }}
    </router-link>
  </div>
</template>
