<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { TeamStatus } from '@/types/team_status'
import { UserRole } from '@/types/roles'
import type { PropType } from 'vue'

const props = defineProps({
  viewMode: { type: String as PropType<'team' | 'individual'>, required: true },
  selectedTeamStatus: { type: String, default: '' },
  selectedConstraints: { type: String, default: '' },
  selectedUserTeamStatus: { type: String, default: '' },
  selectedRole: { type: String as PropType<UserRole | ''>, default: '' },
  selectedSchool: { type: String, default: '' },
  filterName: { type: String, default: '' },
  schools: { type: Array as PropType<string[]>, default: () => [] },
})

const emit = defineEmits([
  'update:viewMode',
  'update:selectedTeamStatus',
  'update:selectedConstraints',
  'update:selectedUserTeamStatus',
  'update:selectedRole',
  'update:selectedSchool',
  'update:filterName',
])

const { t } = useI18n()

// Options
const teamStatus = computed(() => [
  { title: t('organizer.teamManagement.all'), value: '' },
  { title: t('organizer.teamManagement.status.LOCKED'), value: TeamStatus.LOCKED },
  { title: t('organizer.teamManagement.status.UNLOCKED'), value: TeamStatus.UNLOCKED },
])

const teamConstraints = computed(() => [
  { title: t('organizer.teamManagement.all'), value: '' },
  { title: t('organizer.teamManagement.constraints.valid'), value: 'valid' },
  { title: t('organizer.teamManagement.constraints.invalid'), value: 'invalid' },
])

const userTeamStatus = computed(() => [
  { title: t('organizer.teamManagement.all'), value: '' },
  { title: t('organizer.teamManagement.withTeam'), value: 'withTeam' },
  { title: t('organizer.teamManagement.withoutTeam'), value: 'withoutTeam' },
])

const roles = computed(() => [
  { title: t('organizer.userManagement.roleAll'), value: '' },
  { title: t('roles.jury'), value: 'JURY' },
  { title: t('roles.mentor'), value: 'MENTOR' },
  { title: t('roles.participant'), value: 'PARTICIPANT' },
])

const schoolsOptions = computed(() => {
  const uniqueSchools = Array.from(new Set(props.schools))
  return [{ title: t('organizer.teamManagement.all'), value: '' }].concat(
    uniqueSchools.map((school) => ({ title: school, value: school }))
  )
})
</script>

<template>
  <div class="mb-6 p-4 border rounded-lg shadow-sm">
    <div class="flex gap-4 items-end flex-nowrap overflow-x-auto pb-2">
      <div class="w-[150px] flex-shrink-0">
        <label class="block mb-2 text-sm font-medium whitespace-nowrap">
          {{ t('organizer.teamManagement.status.name') }}
        </label>
        <v-select
          v-if="viewMode === 'team'"
          :model-value="selectedTeamStatus"
          :items="teamStatus"
          variant="solo"
          hide-details
          density="comfortable"
          @update:model-value="v => emit('update:selectedTeamStatus', v)"
        />
        <v-select
          v-else
          :model-value="selectedUserTeamStatus"
          :items="userTeamStatus"
          variant="solo"
          hide-details
          density="comfortable"
          @update:model-value="v => emit('update:selectedUserTeamStatus', v)"
        />
      </div>

      <div class="w-[150px] flex-shrink-0">
        <label class="block mb-2 text-sm font-medium whitespace-nowrap">
          {{ viewMode === 'individual'
            ? t('organizer.teamManagement.role')
            : t('organizer.teamManagement.constraints.label') }}
        </label>
        <v-select
          v-if="viewMode === 'individual'"
          :model-value="selectedRole"
          :items="roles"
          variant="solo"
          hide-details
          density="comfortable"
          @update:model-value="v => emit('update:selectedRole', v)"
        />
        <v-select
          v-else
          :model-value="selectedConstraints"
          :items="teamConstraints"
          variant="solo"
          hide-details
          density="comfortable"
          @update:model-value="v => emit('update:selectedConstraints', v)"
        />
      </div>

      <div class="w-[200px] flex-shrink-0" v-if="viewMode === 'individual'">
        <label class="block mb-2 text-sm font-medium whitespace-nowrap">
          {{ t('organizer.teamManagement.school') }}
        </label>
        <v-select
          :model-value="selectedSchool"
          :items="schoolsOptions"
          variant="solo"
          hide-details
          density="comfortable"
          @update:model-value="v => emit('update:selectedSchool', v)"
        />
      </div>

      <div class="w-[250px] flex-grow">
        <label class="block mb-2 text-sm font-medium whitespace-nowrap">
          {{ t('organizer.userManagement.name') }}
        </label>
        <v-text-field
          :model-value="filterName"
          :placeholder="t('organizer.teamManagement.namePlaceholder')"
          variant="solo"
          hide-details
          density="comfortable"
          clearable
          @update:model-value="v => emit('update:filterName', v)"
        />
      </div>

      <div class="flex-shrink-0">
        <label class="block mb-2 text-sm font-medium whitespace-nowrap">
          {{ t('organizer.teamManagement.viewMode.label') }}
        </label>
        <v-btn-toggle
          :model-value="viewMode"
          color="primary"
          border
          divided
          @update:model-value="v => emit('update:viewMode', v)"
        >
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
</template>
