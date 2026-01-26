<script setup lang="ts">
  import { watch, ref, computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import type { TeamDTO, TeamFormDTO } from '@/types/team'
  import TeamForm from '@/components/organizer/team_management/TeamForm.vue'
  import { UserRole } from '@/types/roles'
  import { UserReducedDTO } from '@/types/user'
  import { userService } from '@/services/userService'
  import { MatchmakingSettingsDTO, PartnersDTO, ThemesDTO } from '@/types/config'
  import { configurationService } from '@/services/configurationService'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'
  import TeamTable from '@/components/organizer/team_management/TeamTable.vue'
  import UsersTable from '@/components/organizer/team_management/UsersTable.vue'
  import { calculateAllTeamsConstraints } from '@/utils/teamConstraints'
  import { TeamConstraintViolation } from '@/types/config'
  import AppSnackbar from '@/components/common/AppSnackbar.vue'
  import TeamFilters from '../../components/organizer/team_management/TeamFilters.vue'
  import { filterTeams, filterUsers } from '@/utils/filterUtils'
  import { TeamStatus } from '@/types/team_status'
  import { useTeamStore } from '@/stores/teamStore'
  import { githubService } from '@/services/githubService'

  const { t } = useI18n()

  // ---- PINIA STORE ----
  const teamStore = useTeamStore()
  const loadingTeams = computed(() => teamStore.loading)

  // Snackbar
  const snackbar = ref(false)
  const text = ref('')
  const timeout = ref(2500)
  const error = ref<boolean>(false)

  // View state
  const showTeamForm = ref(false)
  const viewMode = ref<'team' | 'individual'>('team')
  const selectedTeam = ref<TeamDTO | null>(null)
  const editMode = ref(false)

  // Filters
  const selectedTeamStatus = ref<string>('')
  const selectedConstraints = ref<string>('')
  const selectedUserTeamStatus = ref<string>('')
  const selectedRole = ref<UserRole | ''>('')
  const filterName = ref('')
  const selectedSchool = ref<string>('')

  // Data
  const members = ref<UserReducedDTO[]>([])
  const juries = ref<UserReducedDTO[]>([])
  const mentors = ref<UserReducedDTO[]>([])
  const themes = ref<ThemesDTO[]>([])
  const teams = computed(() => teamStore.teams)

  const teamsCreated = ref<number>(0)
  const autogenerating = ref(false)
  const showAutogenerateResult = ref(false)

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
        await teamStore.createTeam(team)
        text.value = t('organizer.teamManagement.teamCreated')
      }
      error.value = false
      snackbar.value = true

      await teamStore.fetchTeams()
      await fetchUsers()

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

  const deleteTeam = async (teamId: string) => {
    try {
      await teamStore.deleteTeam(teamId)
      text.value = t('organizer.teamManagement.teamDeleted')
      error.value = false
      snackbar.value = true
      await fetchUsers()
    } catch (err) {
      console.error('Error deleting team:', err)
      text.value = t('organizer.teamManagement.teamDeleteError')
      error.value = true
      snackbar.value = true
    } finally {
      showTeamForm.value = false
      selectedTeam.value = null
    }
  }

  const assignToTeam = async (payload: { userId: string; teamId: string }) => {
    const { userId, teamId } = payload
    try {
      await teamStore.assignUserToTeam(teamId, userId)
      text.value = t('organizer.teamManagement.userAssignedToTeam')
      error.value = false
      snackbar.value = true
      await fetchUsers()
    } catch (err) {
      console.error('Error assigning user to team:', err)
      text.value = t('organizer.teamManagement.userAssignError')
      error.value = true
      snackbar.value = true
    }
  }

  const withdrawFromTeam = async (payload: { userId: string; teamId: string }) => {
    const { userId, teamId } = payload
    try {
      await teamStore.withdrawUserFromTeam(teamId, userId)
      text.value = t('organizer.teamManagement.userWithdrawnFromTeam')
      error.value = false
      snackbar.value = true
      await fetchUsers()
    } catch (err) {
      console.error('Error withdrawing user from team:', err)
      text.value = t('organizer.teamManagement.userWithdrawError')
      error.value = true
      snackbar.value = true
    }
  }

  const toggleConstraints = async (ignoreConstraints: boolean, teamId: string) => {
    try {
      await teamStore.toggleIgnoreConstraints(teamId, ignoreConstraints)
    } catch (err) {
      console.error('Error toggling team constraints:', err)
      text.value = t('organizer.teamManagement.teamConstraintsToggleError')
      error.value = true
      snackbar.value = true
    }
  }

  const updateLockStatus = async (status: TeamStatus, teamId: string) => {
    const teamConstraints = teamConstraintsMap.value[teamId]
    if (status === TeamStatus.LOCKED && teamConstraints && teamConstraints.length > 0) {
      text.value = t('organizer.teamManagement.lockImpossible')
      error.value = true
      snackbar.value = true
      return
    }
    try {
      await teamStore.updateTeamStatus(teamId, status)
    } catch (err) {
      console.error('Error updating team lock status:', err)
      text.value = t('organizer.teamManagement.teamLockStatusUpdateError')
      error.value = true
      snackbar.value = true
    }
  }

  // ------ CONSTRAINTS ------
  const matchmakingConfig = ref<MatchmakingSettingsDTO | null>(null)
  const teamConstraintsMap = ref<Record<string, TeamConstraintViolation[]>>({})

  const schools = ref<string[]>([])

  const updateConstraints = () => {
    if (matchmakingConfig.value && matchmakingConfig.value.isActive) {
      const result = calculateAllTeamsConstraints(teams.value, matchmakingConfig.value)
      teamConstraintsMap.value = result.reduce(
        (acc, r) => ((acc[r.teamId] = r.violations), acc),
        {} as Record<string, TeamConstraintViolation[]>
      )
    }
  }

  watch([teams, matchmakingConfig], updateConstraints, { deep: true, immediate: true })

  // ----- FETCH DATA -----

  const fetchUsers = async () => {
    const response = await userService.getAllReduced()
    if (response) {
      members.value = response.filter((u) => u.role === UserRole.PARTICIPANT)
      mentors.value = response.filter((u) => u.role === UserRole.MENTOR)
      juries.value = response.filter((u) => u.role === UserRole.JURY)
    }
  }

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

  const fetchMatchmakingConfig = async () => {
    const response = await configurationService.findOne(ConfigurationKey.MATCHMAKING)
    if (response?.value) matchmakingConfig.value = response.value
  }

  const fetchSchools = async () => {
    try {
      const response = await configurationService.findOne(ConfigurationKey.PARTNERS)
      if (response?.value?.partners && Array.isArray(response.value.partners)) {
        const partners: PartnersDTO[] = response.value.partners
        schools.value = partners.filter((p) => p.isParticipatingSchool).map((p) => p.name)
      } else {
        schools.value = []
      }
    } catch (error) {
      console.error('Error fetching schools:', error)
      schools.value = []
    }
  }

  const autogenerateTeams = async () => {
    autogenerating.value = true
    showAutogenerateResult.value = false
    teamsCreated.value = 0
    try {
      const res = await teamStore.autogenerateTeams()
      teamsCreated.value = res

      text.value = t('organizer.teamManagement.teamAutogenerateSuccess', { count: res })
      error.value = false
      snackbar.value = true

      await fetchUsers()
    } catch (err) {
      console.error('Error autogenerating teams:', err)
      text.value = t('organizer.teamManagement.teamAutogenerateError')
      error.value = true
      snackbar.value = true
    } finally {
      autogenerating.value = false
      showAutogenerateResult.value = true
    }
  }

  const closeAutogenerateResult = () => {
    showAutogenerateResult.value = false
  }

  const isInitializingRepos = ref(false)

  const initializeRepos = async () => {
    isInitializingRepos.value = true
    try {
      const results = await githubService.initializeOrganization()
      const successCount = results.filter((r: any) => r.status === 'success').length

      text.value = t('organizer.teamManagement.reposCreated', { count: successCount })
      error.value = false
      snackbar.value = true
    } catch (err: any) {
      console.error('Error initializing repos:', err)
      text.value =
        err.response?.data?.message ||
        t('organizer.teamManagement.reposCreationError') ||
        'Error creating repositories'
      error.value = true
      snackbar.value = true
    } finally {
      isInitializingRepos.value = false
    }
  }

  onMounted(() => {
    fetchUsers()
    fetchThemes()
    fetchMatchmakingConfig()
    fetchSchools()
    teamStore.fetchTeams()
  })

  // FILTERED TEAMS OR USERS
  const filteredTeams = computed(() =>
    filterTeams(
      teams.value.sort((a: TeamDTO, b: TeamDTO) => a.name.localeCompare(b.name)),
      selectedTeamStatus.value,
      selectedConstraints.value,
      filterName.value,
      teamConstraintsMap.value
    )
  )

  const filteredUsers = computed(() =>
    filterUsers(
      members.value
        .concat(mentors.value)
        .concat(juries.value)
        .sort((a: UserReducedDTO, b: UserReducedDTO) => a.lastname.localeCompare(b.lastname)),
      selectedUserTeamStatus.value,
      filterName.value,
      selectedRole.value,
      selectedSchool.value
    )
  )
</script>

<template>
  <v-container>
    <v-row justify="center" class="mt-8">
      <div class="w-full md:w-8/12 lg:w-9/12 px-4">
        <div class="flex w-full justify-between items-center mb-6">
          <h1 class="text-3xl font-bold">{{ t('organizer.teamManagement.title') }}</h1>
          <v-btn color="primary" class="h-full" @click="onAddTeam">
            {{ t('organizer.teamManagement.actions.add') }}
          </v-btn>
        </div>

        <div class="flex flex-col gap-2 mb-4">
          <v-btn color="secondary" @click="autogenerateTeams" :disabled="loadingTeams">
            {{ t('organizer.teamManagement.actions.autogenerate') }}
          </v-btn>
          <v-btn
            color="black"
            @click="initializeRepos"
            :loading="isInitializingRepos"
            :disabled="loadingTeams"
          >
            <v-icon start>mdi-github</v-icon>
            Create GitHub Repos
          </v-btn>
        </div>

        <TeamFilters
          v-model:view-mode="viewMode"
          v-model:selectedTeamStatus="selectedTeamStatus"
          v-model:selectedConstraints="selectedConstraints"
          v-model:selectedUserTeamStatus="selectedUserTeamStatus"
          v-model:selectedRole="selectedRole"
          v-model:filterName="filterName"
          v-model:selectedSchool="selectedSchool"
          :schools="schools"
        />
      </div>

      <TeamForm
        v-model="showTeamForm"
        @save="onSaveTeam"
        @delete="deleteTeam"
        :edit-mode="editMode"
        :team="selectedTeam"
        :members="members"
        :mentors="mentors"
        :juries="juries"
        :themes="themes"
      />
    </v-row>

    <v-row justify="center" class="mb-12">
      <div class="w-full md:w-8/12 lg:w-9/12 px-4">
        <TeamTable
          v-if="viewMode === 'team' && !loadingTeams && filteredTeams.length > 0"
          :teams="filteredTeams"
          :themes="themes"
          :constraints-map="teamConstraintsMap"
          @edit="onEditTeam"
          @toggle-constraints="toggleConstraints"
          @toggle-lock="updateLockStatus"
        />

        <div v-else-if="viewMode === 'team' && loadingTeams" class="text-center py-12">
          <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
        </div>

        <div
          v-else-if="viewMode === 'team' && !loadingTeams && filteredTeams.length === 0"
          class="text-center py-12"
        >
          {{ t('organizer.teamManagement.noTeams') }}
        </div>

        <UsersTable
          v-if="viewMode === 'individual'"
          :users="filteredUsers"
          :themes="themes"
          :teams="teams"
          :config="matchmakingConfig"
          @assign-team="assignToTeam"
          @withdraw-team="withdrawFromTeam"
        />
      </div>
    </v-row>

    <AppSnackbar v-model="snackbar" :message="text" :timeout="timeout" :error="error" />

    <!-- AUTOGENERATE DIALOGS -->
    <v-dialog v-model="autogenerating" persistent width="auto">
      <v-card>
        <v-card-title class="text-h6">{{
          t('organizer.teamManagement.autogenerate.inProgressTitle')
        }}</v-card-title>
        <v-card-text>
          {{ t('organizer.teamManagement.autogenerate.inProgressText') }}
          <v-progress-linear color="blue-darken-2" indeterminate class="mt-3"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showAutogenerateResult" persistent width="auto">
      <v-card>
        <v-card-title class="text-h6">{{
          t('organizer.teamManagement.autogenerate.resultTitle')
        }}</v-card-title>
        <v-card-text>
          <p v-if="teamsCreated > 0">
            {{ t('organizer.teamManagement.autogenerate.resultSuccess', { count: teamsCreated }) }}
          </p>
          <p v-else>
            {{ t('organizer.teamManagement.autogenerate.resultNoChange') }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="closeAutogenerateResult">
            {{ t('common.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
