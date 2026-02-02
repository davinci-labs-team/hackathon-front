<script setup lang="ts">
  import { ref, watch, computed, nextTick } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { TeamFormDTO, TeamDTO } from '@/types/team'
  import { ThemesDTO } from '@/types/config'

  const { t } = useI18n()

  // -----------------------------
  // Props & Emits
  // -----------------------------
  const props = defineProps<{
    modelValue: boolean
    editMode?: boolean
    team?: TeamDTO | null
    subjectId?: string | null
    themes: ThemesDTO[]
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'save', teamId: string, team: TeamFormDTO): void
  }>()

  // -----------------------------
  // Dialog state & Form logic
  // -----------------------------
  const localModelValue = ref(props.modelValue)

  const getThemeIdFromSubjectId = (subjectId: string | null | undefined) => {
    if (!subjectId) return ''
    const theme = props.themes.find((th) => th.subjects.some((s) => s.id === subjectId))
    return theme ? theme.id : ''
  }

  // État initial du formulaire
  const teamForm = ref<TeamFormDTO>({
    name: '',
    description: '',
    subjectId: '',
    themeId: '',
    memberIds: [],
  })

  // Modal synchronization with props
  watch(
    () => props.modelValue,
    (val) => {
      localModelValue.value = val
      if (val) {
        const sId = props.subjectId || props.team?.subjectId || ''
        const tId = getThemeIdFromSubjectId(sId) || props.team?.themeId || ''

        teamForm.value = {
          name: props.team?.name || '',
          description: props.team?.description || '',
          subjectId: sId,
          themeId: tId,
          memberIds: [],
        }
      }
    }
  )

  watch(localModelValue, (val) => emit('update:modelValue', val))

  // -----------------------------
  // Validation
  // -----------------------------
  const required = (v: any) => !!v || t('common.fieldRequired')

  const noAccentsNoSpaces = (v: string) =>
    /^[a-zA-Z0-9_-]*$/.test(v) || t('organizer.teamManagement.nameValidation')

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
      description: '',
      subjectId: '',
      themeId: '',
      memberIds: [],
    }
  }

  const close = () => {
    localModelValue.value = false
    resetForm()
  }

  const save = async () => {
    if (!teamForm.value.name || !teamForm.value.themeId || !teamForm.value.subjectId) return

    const payload: TeamFormDTO = { ...teamForm.value }
    emit('save', props.team?.id || '', payload)
    close()
  }

  watch(
    () => teamForm.value.themeId,
    (newThemeId, oldThemeId) => {
      if (!oldThemeId || props.subjectId) return

      const theme = props.themes.find((t) => t.id === newThemeId)
      if (theme && theme.subjects.length > 0) {
        teamForm.value.subjectId = theme.subjects[0].id
      } else {
        teamForm.value.subjectId = ''
      }
    }
  )
</script>

<template>
  <v-dialog v-model="localModelValue" max-width="800" persistent>
    <v-card>
      <v-card-title class="text-lg font-bold px-6 pt-6 flex justify-between items-center">
        {{
          props.editMode
            ? t('organizer.teamManagement.actions.edit')
            : t('organizer.teamManagement.actions.add')
        }}
        <v-btn icon variant="text" @click="close" aria-label="Close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="save">
          <label class="block mb-1 text-m font-medium">
            {{ t('organizer.teamManagement.name') }}
          </label>
          <v-text-field
            v-model="teamForm.name"
            :rules="[required, noAccentsNoSpaces]"
            required
            variant="solo"
            density="comfortable"
            class="w-full mb-4"
          />

          <label class="block mb-1 text-m font-medium">
            {{ t('organizer.teamManagement.theme') }}
          </label>
          <v-select
            v-model="teamForm.themeId"
            :disabled="!!props.subjectId"
            :items="themes"
            item-title="name"
            item-value="id"
            :rules="[required]"
            required
            variant="solo"
            density="comfortable"
            class="w-full mb-4"
          />

          <template v-if="teamForm.themeId">
            <label class="block mb-1 text-m font-medium">
              {{ t('organizer.teamManagement.subject') }}
            </label>
            <v-select
              v-model="teamForm.subjectId"
              :disabled="!!props.subjectId"
              :items="filteredSubjects"
              item-title="name"
              item-value="id"
              :rules="[required]"
              required
              variant="solo"
              density="comfortable"
              class="w-full mb-4"
            />
          </template>

          <label class="block mb-1 text-m font-medium">
            {{ t('organizer.teamManagement.modale.addDescription') }}
          </label>
          <v-textarea
            v-model="teamForm.description"
            variant="solo"
            density="comfortable"
            class="w-full mb-4"
            rows="3"
          />

          <v-card-actions class="justify-end px-0 mt-4">
            <v-btn color="grey-lighten-1" variant="text" class="mr-2" @click="close">
              {{ t('common.cancel') }}
            </v-btn>
            <v-btn color="primary" type="submit" variant="elevated" class="px-8">
              {{ props.editMode ? t('common.edit') : t('common.create') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
