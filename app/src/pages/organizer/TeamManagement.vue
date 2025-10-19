<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'

  import type { TeamDTO, TeamFormDTO } from '@/types/team'
  import TeamForm from '@/components/organizer/team_management/TeamForm.vue'
  import { TeamStatus } from '@/types/team_status'
  import { UserRole } from '@/types/roles'
  import { UserDTO } from '@/types/user'
  import { userService } from '@/services/userService'
  import { ThemesDTO } from '@/types/config'
  import { configurationService } from '@/services/configurationService'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'

  const { t } = useI18n()

  const showTeamForm = ref(false)
  const viewMode = ref<'team' | 'individual'>('team')
  const selectedTeam = ref<TeamDTO | null>(null)
  const editMode = ref(false)

  // Filters for Team View
  const selectedTeamStatus = ref<string>('')
  const teamStatus = computed(() => [
    { title: t('organizer.teamManagement.all'), value: '' },
    { title: t('organizer.teamManagement.status.locked'), value: TeamStatus.LOCKED },
    { title: t('organizer.teamManagement.status.unlocked'), value: TeamStatus.UNLOCKED },
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
    { title: t('organizer.teamManagement.withoutTeam') , value: 'withoutTeam' },
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

  const onAddTeam = () => {
    showTeamForm.value = true
    editMode.value = false
  }

  const onEditTeam = (team: TeamDTO) => {
    selectedTeam.value = team
    showTeamForm.value = true
    editMode.value = true
  }

  const onSaveTeam = async (team: TeamFormDTO) => {
    if (editMode.value) {
      // Update team logic here
    } else {
      // Create team logic here
    }
    // Refresh user list to update team assignments
    await fetchUsers()
    showTeamForm.value = false
    selectedTeam.value = null
  }

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll()
      if (response) {
        members.value = response.filter(user => user.role === UserRole.PARTICIPANT && !user.teamId)
        mentors.value = response.filter(user => user.role === UserRole.MENTOR)
        juries.value = response.filter(user => user.role === UserRole.JURY)
        console.log('Fetched users:', { members: members.value, mentors: mentors.value, juries: juries.value })
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
        console.log('Fetched themes:', themes.value)
      }
    } catch (error) {
      console.error('Error fetching media settings:', error)
    }
  }

  onMounted(() => {
    fetchUsers()
    fetchThemes()
  })
</script>

<template>
  <v-container>
    <v-row justify="center" class="mt-8">
      <div class="w-full md:w-8/12 lg:w-9/12 px-4">
        <div class="flex w-full justify-between items-center mb-6">
          <h1 class="text-3xl font-bold">{{ t('organizer.teamManagement.title') }}</h1>
          <div class="flex">
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
                {{ viewMode === 'individual' ? t('organizer.teamManagement.role')  : t('organizer.teamManagement.constraints.label') }}
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
        :edit-mode="editMode"
        :team="selectedTeam"
        :members="members"
        :mentors="mentors"
        :juries="juries"
        :themes="themes"
        />
    </v-row>
  </v-container>
</template>
