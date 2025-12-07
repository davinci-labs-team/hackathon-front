<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  defineProps<{
    phaseName: string
  }>()
</script>

<template>
  <v-card class="my-6 pa-4 rounded-lg elevation-4">
    <v-card-title>
      {{ phaseName }}
    </v-card-title>

    <v-card-text>
      <div class="text-center">
        {{ t('hackathonManagement.stats.submission.noData') }}
      </div>
    </v-card-text>
  </v-card>
</template>
