<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  import type { TeamDTO } from '@/types/team'
  import { TeamStatus } from '@/types/team_status'
  import { UserRole } from '@/types/roles'

  const { t } = useI18n()

  const showTeamForm = ref(false)
  const viewMode = ref<'team' | 'individual'>('team')

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

  const onAddTeam = () => {
    showTeamForm.value = true
  }
</script>

<template>
  <v-container>
    <v-row justify="center" class="mt-8">
      <div class="w-full md:w-8/12 lg:w-9/12 px-4">
        <div class="flex w-full justify-between items-center mb-6">
          <h1 class="text-3xl font-bold">{{ t('organizer.teamManagement.title') }}</h1>
          <div class="flex">
            <v-btn color="primary" class="h-full" @click="onAddTeam">
              {{ t('organizer.teamManagement.actions.addBtn') }}
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
            <div class="flex-1">
              <label class="block mb-2 text-sm font-medium">
                {{ t('organizer.userManagement.name') }}
              </label>
              <v-text-field
                v-model="filterName"
                :placeholder="t('organizer.userManagement.namePlaceholder')"
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
    </v-row>
  </v-container>
</template>
