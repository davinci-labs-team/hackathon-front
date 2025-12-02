<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { TeamDTO } from '@/types/team'

const { t } = useI18n()

const props = defineProps<{
  teamsList: TeamDTO[]
  modelValue: number // selectedIndex
  teamInfo: TeamDTO | null
  tPrefix: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()
</script>

<template>
  <div class="flex items-center justify-between mb-8">
    <h1 class="text-3xl font-bold">{{ t(`${tPrefix}.nav.projects`) }}</h1>

    <!-- Carrousel de sélection d'équipe -->
    <div v-if="teamsList.length >= 1" class="flex items-center space-x-2">
      <v-btn
        icon="mdi-chevron-left"
        variant="text"
        :disabled="modelValue === 0"
        @click="emit('update:modelValue', modelValue - 1)"
      />
      <span class="font-semibold">{{ teamInfo?.name || '-' }}</span>
      <v-btn
        icon="mdi-chevron-right"
        variant="text"
        :disabled="modelValue === teamsList.length - 1"
        @click="emit('update:modelValue', modelValue + 1)"
      />
    </div>
  </div>
</template>
