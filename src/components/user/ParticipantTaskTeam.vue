<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed, ref, watch } from 'vue'
  import AppSnackbar from '../common/AppSnackbar.vue'
  import { useAuthStore } from '@/stores/auth'
  import { storeToRefs } from 'pinia'
  import { TaskKey } from '@/types/hackathon_phase'
  import { useTeamStore } from '@/stores/teamStore'
  import TeamFormParticipant from './TeamFormParticipant.vue'
  import { TeamFormDTO, TeamDTO } from '@/types/team'
  import { ThemesDTO } from '@/types/config'
  import { useConfiguration } from '@/composables/useConfiguration'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'


  const { t, tm } = useI18n()

  // --- Themes configration ---
  const {
    configuration: themesConfig,
    error: themesError,
  } = useConfiguration(ConfigurationKey.THEMES)

  const themes = ref<ThemesDTO[]>([])

  watch(
    themesConfig,
    (newConfig) => {
      if (newConfig?.value?.themes && Array.isArray(newConfig.value.themes)) {
        themes.value = newConfig.value.themes as ThemesDTO[]
      } else {
        themes.value = []
      }

      if (themesError.value) {
        console.error('Error fetching themes from hook:', themesError.value)
      }
    },
    { immediate: true }
  )


  // Snackbar
  const snackbar = ref(false)
  const text = ref('')
  const timeout = ref(1500)
  const error = ref(false)

  // Team Store
  const teamStore = useTeamStore()
  const loadingTeams = computed(() => teamStore.loading)
  const teams = computed(() => teamStore.teams)

  const authStore = useAuthStore()
  const { user } = storeToRefs(authStore)
  const { updateUserFields } = authStore

  const taskData = computed(() => {
    return tm(`dashboard.participant.${TaskKey.TEAMS_FORMED}`) as
      | { title: string; description: string; [key: string]: any }
      | undefined
  })

  const isCompleted = computed<boolean>(() => {
    return user?.value?.teamId !== null && user?.value?.teamId !== undefined
  })

  // TODO:
  // Add button to create team
  // Add list of available teams to join (according to the constraints)
  const searchQuery = ref('')

  const showTeamForm = ref(false)
  const editMode = ref(false)
  const selectedTeam = ref<TeamDTO | null>(null)

  // ----- TEAM FORM HANDLERS -----
  const onAddTeam = () => {
    showTeamForm.value = true
    editMode.value = false
  }

  const onEditTeam = (team: TeamDTO) => {
    selectedTeam.value = team
    showTeamForm.value = true
    editMode.value = true
  }

  const onSaveTeam = async (teamId: string, team: TeamFormDTO) => {
    try {
      if (editMode.value) {
        await teamStore.updateTeam(teamId, team)
        text.value = t('organizer.teamManagement.teamUpdated')
      } else {
        team.memberIds = [authStore.user?.id as string]
        await teamStore.createTeam(team)
        text.value = t('organizer.teamManagement.teamCreated')
      }
      error.value = false
      snackbar.value = true
      showTeamForm.value = false
      selectedTeam.value = null
    } catch (err) {
      console.error('Error saving team:', err)
      text.value = t(
        editMode.value
          ? 'organizer.teamManagement.teamUpdateError'
          : 'organizer.teamManagement.teamCreateError'
      )
      error.value = true
      snackbar.value = true
    }
  }
</script>

<template>
  <div>
    <div class="mb-4 flex justify-between items-center">
      <h3 class="text-h6 d-flex align-center">
        <v-icon :color="isCompleted ? 'success' : 'warning'" class="mr-2">
          {{ isCompleted ? 'mdi-check-circle' : 'mdi-alert-circle' }}
        </v-icon>
        {{ taskData?.title || t('dashboard.participant.teams_formed.title') }}
      </h3>

      <v-chip label :color="isCompleted ? 'success' : 'warning'" class="mb-4">
        <v-icon size="small" class="mr-1">
          {{ isCompleted ? 'mdi-check' : 'mdi-clock-outline' }}
        </v-icon>
        {{ isCompleted ? t('common.completed') : t('common.pending') }}
      </v-chip>
    </div>

    <!-- Search + Add -->
    <div class="flex mb-4 gap-4 items-center">
      <v-text-field
        v-model="searchQuery"
        :placeholder="t('common.search')"
        variant="solo"
        hide-details
        density="comfortable"
        clearable
        class="flex-grow"
        @click:clear="searchQuery = ''"
      />
      <v-btn color="primary" class="h-full" @click="onAddTeam">
        {{ t('organizer.teamManagement.actions.add') }}
      </v-btn>
    </div>
  </div>

  <TeamFormParticipant
    v-model="showTeamForm"
    @save="onSaveTeam"
    :edit-mode="editMode"
    :team="selectedTeam"
    :themes="themes"
  />

  <div v-if="loadingTeams" class="text-center py-12">
    <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
  </div>
  <AppSnackbar v-model="snackbar" :message="text" :timeout="timeout" :error="error" />
</template>
