<script setup lang="ts">
  import { HackathonPhaseDTO } from '@/types/config'
  import { useI18n } from 'vue-i18n'
  import { computed, inject } from 'vue'

  const { t, tm } = useI18n()

  interface PhaseTasksMap {
    PENDING?: TaskDefinition[]
    IN_PROGRESS?: TaskDefinition[]
    [key: string]: TaskDefinition[] | undefined
  }

  interface TaskDefinition {
    text: string
    required: boolean
    key: string
  }

  const props = defineProps<{
    currentPhase: HackathonPhaseDTO
  }>()

  const dependenciesStatus = inject<{ [key: string]: boolean }>('phaseDependenciesStatus', {})

  type PhaseStatusKey = 'PENDING' | 'IN_PROGRESS';

  const currentTasks = computed<TaskDefinition[]>(() => {
    const orderKey = String(props.currentPhase.order)
    const statusKey = props.currentPhase.status as PhaseStatusKey; 
    
    const allTasksForPhaseRaw = tm(`hackathonManagement.organizerActions.tasks.${orderKey}`);
    const allTasksForPhase = (
        allTasksForPhaseRaw && typeof allTasksForPhaseRaw === 'object'
            ? allTasksForPhaseRaw
            : {}
    ) as PhaseTasksMap;

    return allTasksForPhase[statusKey] || []
  })

  const tasksWithStatus = computed(() => {
    return currentTasks.value.map((task) => ({
      ...task,
      completed: dependenciesStatus[task.key] || false,
    }))
  })

  const shouldShowCard = computed(() => {
    return tasksWithStatus.value.length > 0
  })
</script>

<template>
  <v-card v-if="shouldShowCard" class="my-6 pa-4 rounded-lg elevation-4">
    <v-card-title>
      <v-icon class="mr-2">mdi-clipboard-list-outline</v-icon>
      {{ t('hackathonManagement.organizerActions.title') }}
    </v-card-title>

    <v-card-text>
      <v-alert v-if="currentPhase.status === 'PENDING'" type="info" variant="tonal" class="mb-4">
        <span>{{
          t('hackathonManagement.organizerActions.alertPending')
        }}</span>
      </v-alert>

      <v-list density="compact">
        <v-list-item
          v-for="task in tasksWithStatus"
          :key="task.key"
          :class="{ 'text-grey-darken-1': task.completed }"
        >
          <template v-slot:prepend>
            <v-icon :color="task.completed ? 'success' : task.required ? 'warning' : 'info'">
              {{ task.completed ? 'mdi-check-circle' : 'mdi-alert-circle-outline' }}
            </v-icon>
          </template>

          <v-list-item-title class="text-wrap">
            {{ task.text }}
            <v-chip v-if="task.required && !task.completed" size="small" color="red" class="ml-2">
              {{ t('hackathonManagement.organizerActions.blockingChip') }}
            </v-chip>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
