<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { userService } from '@/services/userService'
import { submissionService } from '@/services/submissionService'
import { configurationService } from '@/services/configurationService'
import { TeamDTO } from '@/types/team'
import { SubmissionDTO } from '@/types/submission'
import { ThemesDTO } from '@/types/config'
import { ConfigurationKey } from '@/utils/configuration/configurationKey'
import { getRole, getTPrefix } from '@/utils/user'
import ExpertTeamsTable from '@/components/expert/ExpertTeamsTable.vue'

const { t } = useI18n()
const authStore = useAuthStore()

const role = getRole()
const tPrefix = getTPrefix(role, true)

const loading = ref(false)
const teams = ref<TeamDTO[]>([])
const themes = ref<ThemesDTO[]>([])
const submissions = ref<Record<string, SubmissionDTO | null>>({})

const fetchThemes = async () => {
  try {
    const response = await configurationService.findOne(ConfigurationKey.THEMES)
    if (response?.value?.themes && Array.isArray(response.value.themes)) {
      themes.value = response.value.themes as ThemesDTO[]
    } else {
      themes.value = []
    }
  } catch (error) {
    console.error('Error fetching themes:', error)
    themes.value = []
  }
}

const fetchTeamsAndSubmissions = async () => {
  if (!authStore.user?.id) return

  try {
    loading.value = true
    const userResponse = await userService.getExpertTeamsById(authStore.user.id)
    
    let expertTeams: TeamDTO[] = []
    if (userResponse.juryTeams?.length) {
      expertTeams = userResponse.juryTeams
    } else if (userResponse.mentorTeams?.length) {
      expertTeams = userResponse.mentorTeams
    }
    teams.value = expertTeams

    // Fetch submissions for each team
    const submissionPromises = expertTeams.map(async (team) => {
      try {
        const submission = await submissionService.getbyTeamId(team.id)
        return { teamId: team.id, submission }
      } catch (error) {
        return { teamId: team.id, submission: null }
      }
    })

    const results = await Promise.all(submissionPromises)
    results.forEach(({ teamId, submission }) => {
      submissions.value[teamId] = submission
    })

  } catch (error) {
    console.error('Error fetching teams:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await Promise.all([fetchThemes(), fetchTeamsAndSubmissions()])
})
</script>

<template>
  <v-container class="py-10">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold">{{ t('expert.teams.title') }}</h1>
    </div>

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

    <ExpertTeamsTable
      v-if="!loading && teams.length > 0"
      :teams="teams"
      :themes="themes"
      :submissions="submissions"
    />

    <div v-else-if="!loading" class="text-center py-12 text-gray-500">
      {{ t('organizer.submissionManagement.noSubmissions') }}
    </div>
  </v-container>
</template>
