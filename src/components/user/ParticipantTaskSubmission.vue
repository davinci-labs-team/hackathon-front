<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { TaskKey } from '@/types/hackathon_phase'
  import { computed, ref } from 'vue'
  import AppCountdown from '../common/AppCountdown.vue'

  const { t, tm } = useI18n()

  const props = defineProps<{
    deadline?: string | null
  }>()

  const taskData = computed(() => {
    return tm(`dashboard.participant.${TaskKey.PROJECT_SUBMISSION}`) as
      | { title: string; description: string; [key: string]: any }
      | undefined
  })

  const isCompleted = ref<boolean>(false)
</script>

<template>
  <div class="mb-4 flex justify-between items-center">
    <h3 class="text-h6 d-flex align-center">
      <v-icon :color="isCompleted ? 'success' : 'warning'" class="mr-2">
        {{ isCompleted ? 'mdi-check-circle' : 'mdi-alert-circle' }}
      </v-icon>
      {{ taskData?.title || 'dashboard.participant.project_submission.title' }}
    </h3>

    <v-chip label :color="isCompleted ? 'success' : 'warning'" class="mb-4">
      <v-icon size="small" class="mr-1">
        {{ isCompleted ? 'mdi-check' : 'mdi-clock-outline' }}
      </v-icon>
      {{ isCompleted ? t('common.completed') : t('common.pending') }}
    </v-chip>
  </div>

  <p class="text-medium-emphasis mb-4">
    {{ taskData?.description || 'dashboard.participant.project_submission.description' }}
  </p>

  <v-sheet rounded class="pa-6 text-center">
    <h3 class="text-h6 mb-4">
      {{ t('dashboard.participant.project_submission.hackathonEndsIn') }}
    </h3>

    <AppCountdown :deadline="props.deadline" class="justify-center" />

    <v-divider class="my-4"></v-divider>

    <v-btn color="primary" block size="large" to="/user/project">
      {{ t('dashboard.participant.project_submission.submit') }}
    </v-btn>
  </v-sheet>
</template>
