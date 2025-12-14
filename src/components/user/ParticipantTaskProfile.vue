<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { TaskKey } from '@/types/hackathon_phase'
  import { useAuthStore } from '@/stores/auth'
  import { computed } from 'vue'

  const { t, tm } = useI18n()

  const { user } = useAuthStore()

  const taskData = computed(() => {
    return tm(`dashboard.participant.${TaskKey.PROFILE_COMPLETION}`) as
      | { title: string; description: string; [key: string]: any }
      | undefined
  })

  const subTasks = computed(() => {
    return Object.keys(taskData.value || {}).filter(
      (key) => key !== 'title' && key !== 'description'
    )
  })

  const getSubTaskCompletionStatus = (subTaskKey: string): boolean => {
    if (!user) return false

    switch (subTaskKey) {
      case 'addBio':
        return !!user.bio && user.bio.trim().length > 0
      case 'addInterests':
        return Array.isArray(user.interests) && user.interests.length > 0
      case 'addDiscord':
        return !!user.discord
      case 'addGithub':
        return !!user.github
      case 'addPicture':
        return !!user?.profilePicturePath
      default:
        return false
    }
  }

  const isCompleted = computed<boolean>(() => {
    if (!user) return false

    const requiredSubTasks = subTasks.value

    if (requiredSubTasks.length === 0) return false

    return requiredSubTasks.every((key) => getSubTaskCompletionStatus(key))
  })
</script>

<template>
  <div>
    <div class="mb-4 flex justify-between items-center">
      <h3 class="text-h6 d-flex align-center">
        <v-icon :color="isCompleted ? 'success' : 'warning'" class="mr-2">
          {{ isCompleted ? 'mdi-check-circle' : 'mdi-alert-circle' }}
        </v-icon>
        {{ taskData?.title || 'dashboard.participant.profile_completion.title' }}
      </h3>

      <v-chip label :color="isCompleted ? 'success' : 'warning'" class="mb-4">
        <v-icon size="small" class="mr-1">
          {{ isCompleted ? 'mdi-check' : 'mdi-clock-outline' }}
        </v-icon>
        {{ isCompleted ? t('common.completed') : t('common.pending') }}
      </v-chip>
    </div>

    <p class="text-medium-emphasis mb-4">
      {{ taskData?.description || '' }}
    </p>

    <div v-if="taskData">
      <h4 class="text-subtitle-1 font-weight-bold mb-1">{{ t('common.details') }} :</h4>
      <v-list density="compact" class="mb-4">
        <v-list-item
          v-for="subTaskKey in subTasks"
          :key="subTaskKey"
          class="px-0"
          :class="{ 'text-grey-darken-1': getSubTaskCompletionStatus(subTaskKey) }"
        >
          <template v-slot:prepend>
            <v-icon
              :color="getSubTaskCompletionStatus(subTaskKey) ? 'success' : 'info'"
              size="small"
              class="mr-2"
            >
              {{ getSubTaskCompletionStatus(subTaskKey) ? 'mdi-check' : 'mdi-minus' }}
            </v-icon>
          </template>
          <v-list-item-title class="text-wrap">
            {{ taskData[subTaskKey] }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>
