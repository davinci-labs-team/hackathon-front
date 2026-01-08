<script setup lang="ts">
import { useRoute } from 'vue-router'
import { getRole, getTPrefix } from '@/utils/user'
import { ExpertTeamsResponse } from '@/types/user'
import { onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { userService } from '@/services/userService'
import { SubmissionDTO } from '@/types/submission'
import { submissionService } from '@/services/submissionService'
import { TeamDTO } from '@/types/team'
import { UserRole } from '@/types/roles'
import { ConfigurationKey } from '@/utils/configuration/configurationKey'
import { HackathonMediaDTO } from '@/types/config'
import { getOrCreateConfiguration } from '@/services/configurationService'
import { defaultConfigurations } from '@/utils/configuration/defaultConfiguration'

import ProjectHeader from '@/components/expert/ProjectHeader.vue'
import SubmissionDetails from '@/components/expert/SubmissionDetails.vue'
import JuryEvaluation from '@/components/expert/JuryEvaluation.vue'
import MentorFeedback from '@/components/expert/MentorFeedback.vue'

const authStore = useAuthStore()
const route = useRoute()
const mediaSettings = ref<HackathonMediaDTO>({ ...defaultConfigurations[ConfigurationKey.MEDIA] })  

const role = getRole()
const tPrefix = getTPrefix(role, true)
const loading = ref(false)

const userInfo = ref<ExpertTeamsResponse | null>(null)
const teamInfo = ref<TeamDTO | null>(null)
const submissionInfo = ref<SubmissionDTO | null>(null)
const teamsList = ref<TeamDTO[]>([])
const selectedIndex = ref(0)

const loadSubmission = async (teamId: string) => {
  try {
    loading.value = true
    const submissionResponse = await submissionService.getbyTeamId(teamId)
    submissionInfo.value = submissionResponse
  } catch (err) {
    submissionInfo.value = null
    console.error('Error loading submission:', err)
  } finally {
    loading.value = false
  }
}

const refreshSubmission = async () => {
  if (teamInfo.value) {
    await loadSubmission(teamInfo.value.id)
  }
}

onMounted(async () => {
  if (authStore.user?.id) {
    try {
      const response = await getOrCreateConfiguration(ConfigurationKey.MEDIA)
      if (response && response.value) {
        mediaSettings.value = response.value as HackathonMediaDTO
      }

      loading.value = true
      const userResponse = await userService.getExpertTeamsById(authStore.user.id)
      userInfo.value = userResponse
      if (!userResponse) return

      // Récupération des équipes selon le rôle
      if (userResponse.juryTeams?.length) {
        teamsList.value = userResponse.juryTeams
      } else if (userResponse.mentorTeams?.length) {
        teamsList.value = userResponse.mentorTeams
      }

      // Sélection par défaut ou via query param
      if (teamsList.value.length > 0) {
        const teamIdFromQuery = route.query.teamId as string
        const index = teamIdFromQuery 
          ? teamsList.value.findIndex(t => t.id === teamIdFromQuery) 
          : 0
        
        selectedIndex.value = index !== -1 ? index : 0
        teamInfo.value = teamsList.value[selectedIndex.value]
        await loadSubmission(teamInfo.value.id)
      }
    } catch (err) {
      console.error('Error fetching user data:', err)
    } finally {
      loading.value = false
    }
  }
})

// Quand on change d'équipe via le carrousel
watch(selectedIndex, async (newIndex) => {
  const newTeam = teamsList.value[newIndex]
  if (newTeam) {
    teamInfo.value = newTeam
    await loadSubmission(newTeam.id)
  }
})
</script>

<template>
  <v-container class="py-10">
    <ProjectHeader
      v-model="selectedIndex"
      :teams-list="teamsList"
      :team-info="teamInfo"
      :t-prefix="tPrefix"
    />

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

    <!-- Bloc principal - Soumission -->
    <SubmissionDetails
      :submission-info="submissionInfo"
      :team-info="teamInfo"
      :t-prefix="tPrefix"
    />

    <!-- Bloc secondaire pour Jury - Evaluation et commentaire -->
    <JuryEvaluation
      v-if="role === UserRole.JURY"
      :submission-info="submissionInfo"
      :t-prefix="tPrefix"
      :media-settings="mediaSettings"
      @refresh="refreshSubmission"
    />

    <!-- Bloc secondaire pour Mentor - Commentaire -->
    <MentorFeedback
      v-if="role === UserRole.MENTOR"
      :submission-info="submissionInfo"
      :t-prefix="tPrefix"
      @refresh="refreshSubmission"
    />
  </v-container>
</template>