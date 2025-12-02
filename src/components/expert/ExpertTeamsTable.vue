<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { TeamDTO } from '@/types/team'
import { ThemesDTO } from '@/types/config'
import { SubmissionDTO } from '@/types/submission'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { UserRole } from '@/types/roles'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const props = defineProps<{
  teams: TeamDTO[]
  themes: ThemesDTO[]
  submissions: Record<string, SubmissionDTO | null> // Map teamId -> Submission
}>()

const getSubject = (subjectId: string) => {
  for (const theme of props.themes) {
    const subject = theme.subjects.find((subj) => subj.id === subjectId)
    if (subject) {
      return subject.name
    }
  }
  return ''
}

const getTheme = (subjectId: string) => {
  for (const theme of props.themes) {
    const subject = theme.subjects.find((subj) => subj.id === subjectId)
    if (subject) {
      return theme.name
    }
  }
  return ''
}

const getStatus = (teamId: string) => {
  const submission = props.submissions[teamId]
  if (!submission) return 'not_submitted'

  const userId = authStore.user?.id
  if (!userId) return 'unknown'

  if (authStore.user?.role === UserRole.JURY) {
    const evaluation = submission.evaluations?.find(e => e.juryId === userId)
    return evaluation ? 'evaluated' : 'pending'
  } else if (authStore.user?.role === UserRole.MENTOR) {
    const comment = submission.comments?.find(c => c.mentorId === userId)
    return comment ? 'commented' : 'pending'
  }
  return 'unknown'
}

const navigateToProject = (teamId: string) => {
  router.push({ path: '/expert/project', query: { teamId } })
}
</script>

<template>
  <div class="bg-white border rounded-lg overflow-x-auto">
    <table class="min-w-full text-sm">
      <thead>
        <tr class="border-b">
          <th class="px-4 py-2 text-left font-semibold">
            {{ t('expert.teams.teamName') }}
          </th>
          <th class="px-4 py-2 text-center font-semibold">
            {{ t('expert.teams.themeAndSubject') }}
          </th>
          <th class="px-4 py-2 text-center font-semibold">
            {{ t('expert.teams.status') }}
          </th>
          <th class="px-4 py-2 text-center font-semibold">
            {{ t('expert.teams.action') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="team in teams"
          :key="team.id"
          class="border-b hover:bg-gray-50"
        >
          <td class="px-4 py-3">
            <div class="font-medium">{{ team.name }}</div>
          </td>
          <td class="px-4 py-3 text-center">
            <div class="font-medium">
              {{ getTheme(team.subjectId) }}
            </div>
            <div class="text-sm text-gray-600">
              {{ getSubject(team.subjectId) }}
            </div>
          </td>
          <td class="px-4 py-3 text-center">
            <v-chip
              v-if="getStatus(team.id) === 'evaluated'"
              color="success"
              size="small"
            >
              {{ t('expert.teams.evaluated') }}
            </v-chip>
            <v-chip
              v-else-if="getStatus(team.id) === 'commented'"
              color="success"
              size="small"
            >
              {{ t('expert.teams.commented') }}
            </v-chip>
            <v-chip
              v-else-if="getStatus(team.id) === 'pending'"
              color="warning"
              size="small"
            >
              {{ t('expert.teams.pending') }}
            </v-chip>
             <v-chip
              v-else
              color="grey"
              size="small"
            >
              {{ t('expert.teams.notSubmitted') }}
            </v-chip>
          </td>
          <td class="px-4 py-3 text-center">
            <v-btn
              color="primary"
              size="small"
              variant="outlined"
              @click="navigateToProject(team.id)"
            >
              {{ t('expert.teams.viewProject') }}
            </v-btn>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
