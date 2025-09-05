<script setup lang="ts">
  import { ref } from 'vue'

  const model = defineModel<boolean>({ required: true })
  defineProps<{
    message: string
    color?: string
    timeout?: number
    error?: boolean
  }>()
</script>

<template>
  <v-snackbar
    v-model="model"
    :timeout="timeout ?? 2000"
    :color="color ?? (error ? 'error' : 'success')"
    location="top right"
    elevation="4"
    transition="slide-x-reverse-transition"
    class="rounded-lg"
  >
    <div class="flex items-center gap-2 text-white">
      <v-icon size="20">{{ error ? 'mdi-alert-circle' : 'mdi-check-circle' }}</v-icon>
      <span>{{ message }}</span>
    </div>
  </v-snackbar>
</template>
