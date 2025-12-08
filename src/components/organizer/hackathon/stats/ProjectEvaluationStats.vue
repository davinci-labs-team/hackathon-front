<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  defineProps<{
    phaseName: string
  }>()

  const emit = defineEmits(['update:evaluationsCompleted'])
</script>

<template>
  <v-card variant="flat">
    <v-card-title>
      {{ phaseName }}
    </v-card-title>

    <v-card-text>
      <div class="text-center">
        {{ t('hackathonManagement.stats.noData') }}
      </div>
    </v-card-text>
  </v-card>
</template>
