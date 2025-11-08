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
  import { teamService } from '@/services/teamService'
  import AppSnackbar from '@/components/common/AppSnackbar.vue'
  import TeamFilters from '../../components/organizer/team_management/TeamFilters.vue'
  import { filterTeams, filterUsers } from '@/utils/filterUtils'
  import { TeamStatus } from '@/types/team_status'

  const { t } = useI18n()

  const loadingTeams = ref<boolean>(false)

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
  const teams = ref<TeamDTO[]>([])

  // ----------------------
  // ACTIONS
  // ----------------------
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
    if (editMode.value) {
      await teamService.update(teamId, team)
      text.value = t('organizer.teamManagement.teamUpdated')
    } else {
      await teamService.create(team)
      text.value = t('organizer.teamManagement.teamCreated')
    }
    error.value = false
    snackbar.value = true
    await Promise.all([fetchUsers(), fetchTeams()])
    showTeamForm.value = false
    selectedTeam.value = null
  }

  const deleteTeam = async (teamId: string) => {
    try {
      await teamService.delete(teamId)
      text.value = t('organizer.teamManagement.teamDeleted')
      error.value = false
      snackbar.value = true
      teams.value = teams.value.filter((t: TeamDTO) => t.id !== teamId)
      await fetchTeams()
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
    console.log('assigning', userId, teamId)
    try {
      await teamService.assignUserToTeam(teamId, userId)
      text.value = t('organizer.teamManagement.userAssignedToTeam')
      error.value = false
      snackbar.value = true
      await fetchUsers()
      await fetchUpdatedTeam(teamId)
    } catch (err) {
      console.error('Error assigning user to team:', err)
      text.value = t('organizer.teamManagement.userAssignToTeamError')
      error.value = true
      snackbar.value = true
    }
  }

  const withdrawFromTeam = async (payload: { userId: string; teamId: string }) => {
    const { userId, teamId } = payload
    console.log('withdrawing', userId, teamId)
    try {
      await teamService.withdrawUserFromTeam(teamId, userId)
      text.value = t('organizer.teamManagement.userWithdrawnFromTeam')
      error.value = false
      snackbar.value = true
      await fetchUsers()
      await fetchUpdatedTeam(teamId)
    } catch (err) {
      console.error('Error withdrawing user from team:', err)
      text.value = t('organizer.teamManagement.userWithdrawFromTeamError')
      error.value = true
      snackbar.value = true
    }
  }

  const toggleConstraints = async (ignoreConstraints: boolean, teamId: string) => {
    try {
      await teamService.toggleIgnoreConstraints(teamId, ignoreConstraints)
      await fetchUpdatedTeam(teamId)
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
      await teamService.updateStatus(teamId, status)
      await fetchUpdatedTeam(teamId)
    } catch (err) {
      console.error('Error updating team lock status:', err)
      text.value = t('organizer.teamManagement.teamLockStatusUpdateError')
      error.value = true
      snackbar.value = true
    }
  }

  // ----------------------
  // CONSTRAINTS
  // ----------------------
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

  // ----------------------
  // FETCH
  // ----------------------
  const fetchTeams = async () => {
    loadingTeams.value = true
    try {
      const response = await teamService.getAll()
      if (response) teams.value = response
    } catch (err) {
      console.error('Error fetching teams:', err)
      text.value = t('organizer.teamManagement.teamFetchError')
      error.value = true
      snackbar.value = true
    } finally {
      loadingTeams.value = false
    }
  }

  const fetchUpdatedTeam = async (teamId: string) => {
    const updatedTeam = await teamService.getById(teamId)
    if (updatedTeam) {
      const index = teams.value.findIndex((t) => t.id === teamId)
      if (index !== -1) {
        teams.value.splice(index, 1, updatedTeam)
      } else {
        teams.value.push(updatedTeam)
      }
    }
  }

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

  onMounted(() => {
    fetchUsers()
    fetchThemes()
    fetchMatchmakingConfig()
    fetchSchools()
    fetchTeams()
  })

  // ----------------------
  // FILTERED TEAMS OR USERS
  // ----------------------
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
          <div class="flex gap-4">
            <v-btn color="green" class="h-full">
              {{ t('common.validate') }}
            </v-btn>
            <v-btn color="primary" class="h-full" @click="onAddTeam">
              {{ t('organizer.teamManagement.actions.add') }}
            </v-btn>
          </div>
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
  </v-container>
</template>
