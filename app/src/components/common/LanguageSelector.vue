<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { watch } from 'vue';

const { locale } = useI18n()
watch(locale, (newLocale) => {
  localStorage.setItem('lang', newLocale);
});
</script>

<template>
  <select v-model="locale" class="border p-2 rounded">
    <option value="fr">🇫🇷</option>
    <option value="en">🇺🇸</option>
  </select>
</template>
