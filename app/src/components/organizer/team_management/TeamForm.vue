<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { TeamFormDTO, TeamDTO } from '@/types/team'

  const { t } = useI18n()

  // -----------------------------
  // Props & Emits
  // -----------------------------
  const props = defineProps<{
    modelValue: boolean
    editMode?: boolean
    team?: TeamDTO | null
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'save', team: TeamDTO): void
  }>()

  // -----------------------------
  // Dialog state
  // -----------------------------
  const localModelValue = ref(props.modelValue)
  watch(
    () => props.modelValue,
    (val) => (localModelValue.value = val)
  )
  watch(localModelValue, (val) => emit('update:modelValue', val))

  // -----------------------------
  // Form state
  // -----------------------------
  const teamForm = ref<TeamFormDTO>({
    name: '',
    subjectId: '',
    themeId: '',
    memberIds: [],
    juryIds: [],
    mentorIds: [],
  })

  // -----------------------------
  // Validation
  // -----------------------------
  const required = (v: string | null | undefined) => !!v || t('common.fieldRequired')

  // -----------------------------
  // Form actions
  // -----------------------------
  const resetForm = () => {
    teamForm.value = {
      name: '',
      subjectId: '',
      themeId: '',
      memberIds: [],
      juryIds: [],
      mentorIds: [],
    }
  }

  const close = () => {
    localModelValue.value = false
    resetForm()
  }

  // -----------------------------
  // Save team
  // -----------------------------
  const save = async () => {
    if (!teamForm.value.name || !teamForm.value.themeId || !teamForm.value.subjectId) return

    const payload: TeamFormDTO = { ...teamForm.value }
    emit('save', payload)
    close()
  }

  // ----------------------------------
  // Initialize form when dialog opens
  // ----------------------------------
  watch(
    localModelValue,
    (open) => {
      if (!open) return
      if (props.editMode && props.team) {
        // Map TeamDTO to TeamFormDTO
        teamForm.value = {
          name: props.team.name,
          themeId: props.team.themeId,
          subjectId: props.team.subjectId,
          memberIds: props.team.members.map((u) => u.id),
          mentorIds: props.team.mentors.map((u) => u.id),
          juryIds: props.team.juries.map((u) => u.id),
        }
      } else {
        resetForm()
      }
    },
    { immediate: true }
  )
</script>

<template>
  <v-dialog v-model="localModelValue" max-width="800">
    <v-card>
      <v-card-title class="text-lg font-bold px-6 pt-6">
        {{ props.editMode ? t('organizer.teamManagement.actions.edit') : t('organizer.teamManagement.actions.add') }}
        <v-btn icon class="absolute top-2 right-2" @click="close" aria-label="Close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="save">
          <label class="block mb-1 text-m">{{ t('organizer.userManagement.name') }}</label>
          <div class="flex gap-8">
            <v-text-field
              v-model="firstname"
              :placeholder="t('users.firstname')"
              :rules="[required]"
              required
              variant="solo"
              class="mb-4"
            />

            <v-text-field
              v-model="lastname"
              :placeholder="t('users.lastname')"
              :rules="[required]"
              required
              variant="solo"
              class="mb-4"
            />
          </div>

          <label class="block mb-1 text-m">{{ t('organizer.userManagement.email') }}</label>
          <v-text-field
            v-model="email"
            :rules="[required, emailRule]"
            required
            variant="solo"
            class="mb-4"
          />

          <label class="block mb-1 text-m">{{ t('organizer.userManagement.role') }}</label>
          <v-radio-group v-model="role" :rules="[required]" row class="mb-4">
            <div class="grid grid-cols-2 gap-x-1">
              <div><v-radio :label="t('roles.participant')" value="PARTICIPANT" /></div>
              <div><v-radio :label="t('roles.mentor')" value="MENTOR" /></div>
              <div><v-radio :label="t('roles.jury')" value="JURY" /></div>
              <div><v-radio :label="t('roles.organizer')" value="ORGANIZER" /></div>
            </div>
          </v-radio-group>

          <!-- TODO: Get the right naming for this field -->
          <label class="block mb-1 text-m">{{ t('users.school') }}</label>
          <template v-if="role === 'PARTICIPANT'">
            <v-select
              v-model="school"
              :items="schools"
              :rules="[required]"
              required
              variant="solo"
              density="comfortable"
              class="w-full mb-8"
            />
          </template>
          <template v-else>
            <v-text-field
              v-model="school"
              :placeholder="t('users.school')"
              variant="solo"
              class="mb-4"
            />
          </template>

          <v-card-actions class="justify-center">
            <v-btn color="primary" type="submit" variant="elevated" class="px-8 mb-3">
              {{ props.editMode ? t('common.edit') : t('common.create') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
