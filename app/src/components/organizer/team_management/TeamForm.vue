<script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { TeamFormDTO, TeamDTO } from '@/types/team'
  import { UserDTO } from '@/types/user'
  import { ThemesDTO } from '@/types/config'
  import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

  const { t } = useI18n()

  // -----------------------------
  // Props & Emits
  // -----------------------------
  const props = defineProps<{
    modelValue: boolean
    editMode?: boolean
    team?: TeamDTO | null
    members: UserDTO[]
    mentors: UserDTO[]
    juries: UserDTO[]
    themes: ThemesDTO[]
  }>()

  const showConfirmDeleteDialog = ref(false)

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'save', teamId: string, team: TeamFormDTO): void
    (e: 'delete', teamId: string): void
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
  const filteredSubjects = computed(() => {
    const theme = props.themes.find((t) => t.id === teamForm.value.themeId)
    return theme ? theme.subjects : []
  })

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
    emit('save', props.team?.id || '', payload)
    close()
  }

  // ------------------------------
  // Delete team
  // ------------------------------
  const onDeleteTeam = () => {
    showConfirmDeleteDialog.value = true
  }

  const deleteTeam = async () => {
    if (!props.team?.id) return
    emit('delete', props.team.id)

    showConfirmDeleteDialog.value = false
    localModelValue.value = false
  }

  // ----------------------------------
  // Initialize form when dialog opens
  // ----------------------------------
  const filteredMembers = ref<UserDTO[]>(props.members)
  watch(
    localModelValue,
    (open) => {
      if (!open) return

      if (props.editMode) {
        // On ne fait rien si l’équipe n’est pas encore prête
        if (!props.team) return

        teamForm.value = {
          name: props.team.name || '',
          themeId: props.team.themeId || '',
          subjectId: props.team.subjectId || '',
          memberIds: (props.team.members ?? []).map((u) => u.id),
          mentorIds: (props.team.mentors ?? []).map((u) => u.id),
          juryIds: (props.team.juries ?? []).map((u) => u.id),
        }
        filteredMembers.value = props.members // garder la liste complète
      } else {
        resetForm()
        filteredMembers.value = props.members.filter((u) => !u.teamId)
      }
    },
    { immediate: true }
  )

  watch(
    () => teamForm.value.themeId,
    (newThemeId) => {
      teamForm.value.subjectId = ''

      const theme = props.themes.find((t) => t.id === newThemeId)
      if (theme && theme.subjects.length > 0) {
        teamForm.value.subjectId = theme.subjects[0].id
      }
    }
  )
</script>

<template>
  <v-dialog v-model="localModelValue" max-width="800">
    <v-card>
      <v-card-title class="text-lg font-bold px-6 pt-6">
        {{
          props.editMode
            ? t('organizer.teamManagement.actions.edit')
            : t('organizer.teamManagement.actions.add')
        }}
        <v-btn icon class="absolute top-2 right-2" @click="close" aria-label="Close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="save">
          <label class="block mb-1 text-m">
            {{ t('organizer.teamManagement.name') }}
          </label>
          <v-text-field
            v-model="teamForm.name"
            :rules="[required]"
            required
            variant="solo"
            density="comfortable"
            class="w-full mb-8"
          />

          <label class="block mb-1 text-m">
            {{ t('organizer.teamManagement.theme') }}
          </label>
          <v-select
            v-model="teamForm.themeId"
            :items="themes"
            item-title="name"
            item-value="id"
            :rules="[required]"
            required
            variant="solo"
            density="comfortable"
            class="w-full mb-8"
          />

          <template v-if="teamForm.themeId">
            <label class="block mb-1 text-m">
              {{ t('organizer.teamManagement.subject') }}
            </label>
            <v-select
              v-model="teamForm.subjectId"
              :items="filteredSubjects"
              item-title="name"
              item-value="id"
              placeholder="Choisir un sujet"
              :rules="[required]"
              required
              variant="solo"
              density="comfortable"
              class="w-full mb-8"
            />
          </template>

          <label class="block mb-1 text-m">{{
            t('organizer.teamManagement.modale.addMembers')
          }}</label>
          <v-autocomplete
            v-model="teamForm.memberIds"
            :items="filteredMembers"
            :item-title="(user) => `${user.firstname} ${user.lastname} (${user.school})`"
            item-value="id"
            :placeholder="t('organizer.teamManagement.modale.membersPlaceholder')"
            :rules="[required]"
            multiple
            chips
            variant="solo"
            class="mb-4"
            :no-data-text="t('common.noDataText')"
          />

          <label class="block mb-1 text-m">{{
            t('organizer.teamManagement.modale.addJury')
          }}</label>
          <v-autocomplete
            v-model="teamForm.juryIds"
            :items="juries"
            :item-title="(user) => `${user.firstname} ${user.lastname}`"
            item-value="id"
            :placeholder="t('organizer.teamManagement.modale.membersPlaceholder')"
            :rules="[required]"
            multiple
            chips
            variant="solo"
            class="mb-4"
            :no-data-text="t('common.noDataText')"
          />

          <label class="block mb-1 text-m">{{
            t('organizer.teamManagement.modale.addMentors')
          }}</label>
          <v-autocomplete
            v-model="teamForm.mentorIds"
            :items="mentors"
            :item-title="(user) => `${user.firstname} ${user.lastname}`"
            item-value="id"
            :placeholder="t('organizer.teamManagement.modale.membersPlaceholder')"
            :rules="[required]"
            multiple
            chips
            variant="solo"
            class="mb-4"
            :no-data-text="t('common.noDataText')"
          />

          <v-card-actions class="justify-between mt-6">
            <v-btn
              v-if="props.editMode"
              color="red"
              variant="elevated"
              class="px-8 mb-3"
              @click="onDeleteTeam"
            >
              {{ t('common.delete') }}
            </v-btn>
            <v-btn color="primary" type="submit" variant="elevated" class="px-8 mb-3">
              {{ props.editMode ? t('common.edit') : t('common.create') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>

  <ConfirmDialog
    v-model="showConfirmDeleteDialog"
    :title="t('organizer.teamManagement.dialog.deleteConfirmTitle')"
    :text="t('organizer.teamManagement.dialog.deleteConfirmText', { teamName: props.team?.name })"
    :confirm-label="t('common.delete')"
    confirm-color="red"
    @confirm="deleteTeam"
  />
</template>
