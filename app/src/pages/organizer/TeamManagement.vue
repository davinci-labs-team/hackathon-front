<script setup lang="ts">
  import { watch, ref, computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'

  import type { TeamDTO, TeamFormDTO } from '@/types/team'
  import TeamForm from '@/components/organizer/team_management/TeamForm.vue'
  import { TeamStatus } from '@/types/team_status'
  import { UserRole } from '@/types/roles'
  import { UserDTO } from '@/types/user'
  import { userService } from '@/services/userService'
  import { MatchmakingSettingsDTO, ThemesDTO } from '@/types/config'
  import { configurationService } from '@/services/configurationService'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'
  import TeamTable from '@/components/organizer/team_management/TeamTable.vue'
  import { calculateAllTeamsConstraints } from '@/utils/teamConstraints'
  import { TeamConstraintViolation } from '@/types/config'
  import { teamService } from '@/services/teamService'
  import AppSnackbar from '@/components/common/AppSnackbar.vue'

  const { t } = useI18n()

  // App Snackbar
  const snackbar = ref(false)
  const text = ref('')
  const timeout = ref(2500)
  const error = ref<boolean>(false)
  // ----------------------

  const showTeamForm = ref(false)
  const viewMode = ref<'team' | 'individual'>('team')
  const selectedTeam = ref<TeamDTO | null>(null)
  const editMode = ref(false)

  // Filters for Team View
  const selectedTeamStatus = ref<string>('')
  const teamStatus = computed(() => [
    { title: t('organizer.teamManagement.all'), value: '' },
    { title: t('organizer.teamManagement.status.LOCKED'), value: TeamStatus.LOCKED },
    { title: t('organizer.teamManagement.status.UNLOCKED'), value: TeamStatus.UNLOCKED },
  ])

  const selectedConstraints = ref<string>('')
  const teamConstraints = computed(() => [
    { title: t('organizer.teamManagement.all'), value: '' },
    { title: t('organizer.teamManagement.constraints.valid'), value: 'valid' },
    { title: t('organizer.teamManagement.constraints.invalid'), value: 'invalid' },
  ])

  // Filters for Individual View
  const selectedUserTeamStatus = ref<string>('')
  const userTeamStatus = computed(() => [
    { title: t('organizer.teamManagement.all'), value: '' },
    { title: t('organizer.teamManagement.withTeam'), value: 'withTeam' },
    { title: t('organizer.teamManagement.withoutTeam'), value: 'withoutTeam' },
  ])

  const selectedRole = ref<UserRole | ''>('')
  const roles = computed(() => [
    { title: t('organizer.userManagement.roleAll'), value: '' },
    { title: t('roles.organizer'), value: 'ORGANIZER' },
    { title: t('roles.jury'), value: 'JURY' },
    { title: t('roles.mentor'), value: 'MENTOR' },
    { title: t('roles.participant'), value: 'PARTICIPANT' },
  ])

  // Both Views
  const filterName = ref('')

  // Fetch user list
  const members = ref<UserDTO[]>([])
  const juries = ref<UserDTO[]>([])
  const mentors = ref<UserDTO[]>([])
  const themes = ref<ThemesDTO[]>([])

  const teams = ref<TeamDTO[]>([])

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
      error.value = false
      snackbar.value = true
    } else {
      await teamService.create(team)
      text.value = t('organizer.teamManagement.teamCreated')
      error.value = false
      snackbar.value = true
    }

    await fetchUsers()
    await fetchTeams()
    showTeamForm.value = false
    selectedTeam.value = null
  }

  // ----------------------
  // TEAM CONSTRAINTS LOGIC
  // ----------------------
  const matchmakingConfig = ref<MatchmakingSettingsDTO | null>(null)
  const teamConstraintsMap = ref<Record<string, TeamConstraintViolation[]>>({})

  const updateConstraints = () => {
    if (matchmakingConfig.value && matchmakingConfig.value.isActive) {
      const result = calculateAllTeamsConstraints(teams.value, matchmakingConfig.value)
      teamConstraintsMap.value = result.reduce(
        (acc, r) => {
          acc[r.teamId] = r.violations
          return acc
        },
        {} as Record<string, TeamConstraintViolation[]>
      )
    }
  }

  watch([teams, matchmakingConfig], updateConstraints, { deep: true, immediate: true })

  // ----------------------
  // FETCHING DATA
  // ----------------------

  const fetchTeams = async () => {
    const response = await teamService.getAll()
    if (response) {
      teams.value = response
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll()
      if (response) {
        members.value = response.filter((user) => user.role === UserRole.PARTICIPANT)
        mentors.value = response.filter((user) => user.role === UserRole.MENTOR)
        juries.value = response.filter((user) => user.role === UserRole.JURY)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchThemes = async () => {
    try {
      const response = await configurationService.findOne(ConfigurationKey.THEMES)
      if (response && response.value) {
        themes.value = response.value
      }
    } catch (error) {
      console.error('Error fetching media settings:', error)
    }
  }

  const fetchMatchmakingConfig = async () => {
    try {
      const response = await configurationService.findOne(ConfigurationKey.MATCHMAKING)
      if (response && response.value) {
        matchmakingConfig.value = response.value
      }
    } catch (error) {
      console.error('Error fetching matchmaking config:', error)
    }
  }

  onMounted(() => {
    fetchUsers()
    fetchThemes()
    fetchMatchmakingConfig()
    fetchTeams()
  })

  const onToggleLock = async (team: TeamDTO) => {
    if (teamConstraintsMap.value[team.id]?.length > 0 && team.status !== TeamStatus.LOCKED) {
      text.value = t('organizer.teamManagement.lockImpossible')
      error.value = true
      snackbar.value = true
      return
    }
    try {
      const newStatus = team.status === TeamStatus.LOCKED ? TeamStatus.UNLOCKED : TeamStatus.LOCKED
      await teamService.updateStatus(team.id, newStatus)

      team.status = newStatus
    } catch (error) {
      console.error('Erreur lors du verrouillage/déverrouillage:', error)
    }
  }

  const onToggleConstraints = async (team: TeamDTO) => {
    try {
      const newIgnoreState = !team.ignoreConstraints
      await teamService.toggleIgnoreConstraints(team.id, newIgnoreState)

      team.ignoreConstraints = newIgnoreState
    } catch (error) {
      console.error('Erreur lors du changement de mode contraintes:', error)
    }
  }

  const deleteTeam = async (teamId: string) => {
    try {
      await teamService.delete(teamId)
      text.value = t('organizer.teamManagement.teamDeleted')
      error.value = false
      snackbar.value = true

      teams.value = teams.value.filter((t) => t.id !== teamId)

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

  const filteredTeams = computed(() => {
    return teams.value.filter((team) => {
      const query = filterName.value.toLowerCase()

      const matchesName =
        !filterName.value ||
        team.name.toLowerCase().includes(query) ||
        team.members.some((member) =>
          (member.firstname + ' ' + member.lastname).toLowerCase().includes(query)
        ) ||
        team.mentors.some((mentor) =>
          (mentor.firstname + ' ' + mentor.lastname).toLowerCase().includes(query)
        ) ||
        team.juries.some((jury) =>
          (jury.firstname + ' ' + jury.lastname).toLowerCase().includes(query)
        )

      const matchesStatus = !selectedTeamStatus.value || team.status === selectedTeamStatus.value

      const violations = teamConstraintsMap.value[team.id] || []
      const hasViolations = violations.length > 0

      const matchesConstraints =
        !selectedConstraints.value ||
        (selectedConstraints.value === 'valid' && !hasViolations) ||
        (selectedConstraints.value === 'invalid' && hasViolations)

      return matchesName && matchesStatus && matchesConstraints
    })
  })
</script>

<template>
  <v-container>
    <v-row justify="center" class="mt-8">
      <div class="w-full md:w-8/12 lg:w-9/12 px-4">
        <div class="flex w-full justify-between items-center mb-6">
          <h1 class="text-3xl font-bold">{{ t('organizer.teamManagement.title') }}</h1>
          <div class="flex gap-2">
            <v-btn color="green" class="h-full" @click="onAddTeam">
              {{ t('common.validate') }}
            </v-btn>
            <v-btn color="primary" class="h-full" @click="onAddTeam">
              {{ t('organizer.teamManagement.actions.add') }}
            </v-btn>
          </div>
        </div>

        <div class="mb-6 p-4 border rounded-lg shadow-sm">
          <div class="flex gap-8">
            <div class="flex-1">
              <label class="block mb-2 text-sm font-medium">
                {{ t('organizer.teamManagement.status.name') }}
              </label>
              <v-select
                v-if="viewMode === 'team'"
                v-model="selectedTeamStatus"
                :items="teamStatus"
                variant="solo"
                hide-details
                density="comfortable"
                class="w-full"
              />
              <v-select
                v-else
                v-model="selectedUserTeamStatus"
                :items="userTeamStatus"
                variant="solo"
                hide-details
                density="comfortable"
                class="w-full"
              />
            </div>
            <div class="flex-1">
              <label class="block mb-2 text-sm font-medium">
                {{
                  viewMode === 'individual'
                    ? t('organizer.teamManagement.role')
                    : t('organizer.teamManagement.constraints.label')
                }}
              </label>
              <!-- Role filter only for Individual View else Team Constraints -->
              <v-select
                v-if="viewMode === 'individual'"
                v-model="selectedRole"
                :items="roles"
                variant="solo"
                hide-details
                density="comfortable"
                class="w-full"
              />
              <v-select
                v-else
                v-model="selectedConstraints"
                :items="teamConstraints"
                variant="solo"
                hide-details
                density="comfortable"
                class="w-full"
              />
            </div>
            <div class="flex-[2]">
              <label class="block mb-2 text-sm font-medium">
                {{ t('organizer.userManagement.name') }}
              </label>
              <v-text-field
                v-model="filterName"
                :placeholder="t('organizer.teamManagement.namePlaceholder')"
                variant="solo"
                hide-details
                density="comfortable"
                class="w-full"
                clearable
                @click:clear="filterName = ''"
              />
            </div>
            <div class="flex-1">
              <label class="block mb-2 text-sm font-medium">
                {{ t('organizer.teamManagement.viewMode.label') }}
              </label>
              <v-btn-toggle v-model="viewMode" color="primary" border divded>
                <v-btn value="team">
                  {{ t('organizer.teamManagement.viewMode.team') }}
                </v-btn>
                <v-btn value="individual">
                  {{ t('organizer.teamManagement.viewMode.individual') }}
                </v-btn>
              </v-btn-toggle>
            </div>
          </div>
        </div>
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
          v-if="viewMode === 'team' && filteredTeams.length > 0"
          :teams="filteredTeams"
          :themes="themes"
          :constraints-map="teamConstraintsMap"
          @edit="onEditTeam"
          @toggle-lock="onToggleLock"
          @toggle-constraints="onToggleConstraints"
        />
        <div v-else-if="viewMode === 'team' && filteredTeams.length === 0" class="text-center py-12">
          {{ t('organizer.teamManagement.noTeams') }}
        </div>
        <!-- Individual User Management Table can be placed here -->
      </div>
    </v-row>

    <AppSnackbar v-model="snackbar" :message="text" :timeout="timeout" :error="error" />
  </v-container>
</template>
