<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { TaskKey } from '@/types/hackathon_phase'
  import { computed, ref, watch } from 'vue'
  import AppCountdown from '../common/AppCountdown.vue'
  import { SubmissionDTO } from '@/types/submission'
  import { UserDTO } from '@/types/user'
  import { SubmissionStatus } from '@/types/submission_status'
  import { userService } from '@/services/userService'
  import { submissionService } from '@/services/submissionService'
  import { useAuthStore } from '@/stores/auth'

  const authStore = useAuthStore()
  const userInfo = ref<UserDTO | null>(null)

  const { t, tm } = useI18n()

  const props = defineProps<{
    deadline?: string | null
  }>()

  const taskData = computed(() => {
    return tm(`dashboard.participant.${TaskKey.PROJECT_SUBMISSION}`) as
      | { title: string; description: string; [key: string]: any }
      | undefined
  })

  const submissionInfo = ref<SubmissionDTO | null>(null)
  const isCompleted = ref<boolean>(false)

  watch(
    () => authStore.user?.id,
    async (newUserId) => {
      if (newUserId) {
        try {
          const userResponse = await userService.getById(newUserId)
          userInfo.value = userResponse

          if (!userResponse.teamId) return

          const submissionResponse = (await submissionService.getbyTeamId(
            userResponse.teamId
          )) as SubmissionDTO | null
          submissionInfo.value = submissionResponse

          if (!submissionInfo.value) {
            isCompleted.value = false
          } else {
            isCompleted.value = submissionInfo.value.status === SubmissionStatus.PENDING
          }
        } catch (err) {
          console.error('Error fetching user data:', err)
        } finally {
        }
      }
    },
    { immediate: true }
  )
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

    <v-btn color="primary" block size="large" to="/user/project" v-if="!isCompleted">
      {{ t('dashboard.participant.project_submission.submit') }}
    </v-btn>
  </v-sheet>
</template>
