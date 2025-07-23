<script setup lang="ts">
  import basicImg from '@/assets/images/basic.jpg'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  // TODO:
  // Call API to list all partners with name and picture
</script>

<template>
  <div
    class="w-full bg-white border border-gray-300 rounded p-6 flex flex-col items-center gap-6"
    style="height: 100%"
  >
    <h3 class="text-2xl font-medium">{{ t('partners.title') }}</h3>
    <img :src="basicImg" alt="Partenaire 1" class="rounded shadow" />
    <img :src="basicImg" alt="Partenaire 2" class="rounded shadow" />
    <img :src="basicImg" alt="Partenaire 3" class="rounded shadow" />
  </div>
</template>
