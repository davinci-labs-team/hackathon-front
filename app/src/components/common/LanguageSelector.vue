<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
</script>

<template>
  <select v-model="locale" class="border p-2 rounded">
    <option value="fr">Français</option>
    <option value="en">English</option>
  </select>
</template>
