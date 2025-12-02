<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import AppSnackbar from '@/components/common/AppSnackbar.vue'

  const { t } = useI18n()

  // Snackbar
  const snackbar = ref(false)
  const text = ref('')
  const timeout = ref(1500)
  const error = ref(false)
</script>

<template>
  <v-container>
    <v-row justify="center" class="mt-8">
      <div class="w-full md:w-8/12 lg:w-8/12 px-4">
        <h1 class="text-3xl font-bold">{{ t('hackathonManagement.title') }}</h1>
        <p class="text-gray-600 text-lg mb-0">{{ t('hackathonManagement.subtitle') }}</p>

        <AppSnackbar v-model="snackbar" :message="text" :timeout="timeout" :error="error" />

      </div>
    </v-row>
  </v-container>
</template>
