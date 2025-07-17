<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="text-center space-y-6">
    <h2 class="text-2xl">{{ t('login.title') }}</h2>
    <router-link to="/organizer/dashboard">
      <button class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
        {{ t('login.organizer') }}
      </button>
    </router-link>
    <router-link to="/user/dashboard">
      <button class="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
        {{ t('login.user') }}
      </button>
    </router-link>
  </div>
</template>
