<script setup lang="ts">
import { ref } from 'vue'
import { ThemesDTO, SubjectDTO } from '@/types/config'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  theme: ThemesDTO
  themeIndex: number
}>()

const emit = defineEmits<{
  (e: 'deleteTheme', themeIndex: number): void
  (e: 'addSubject', themeIndex: number): void
  (e: 'removeSubject', themeIndex: number, subjectIndex: number): void
  (e: 'editTheme', themeIndex: number, updatedTheme: ThemesDTO): void
  (e: 'editSubject', themeIndex: number, subjectIndex: number, updatedSubject: SubjectDTO): void
}>()

const { t } = useI18n()

// --- EDIT STATES ---
const editThemeMode = ref(false)
const editingSubjects = ref<boolean[]>(props.theme.subjects.map(() => false))

// Copie temporaire pour pouvoir annuler
let themeBackup: ThemesDTO | null = null
const subjectBackups: Record<number, SubjectDTO> = {}

// --- THEME METHODS ---
const enterEditTheme = () => {
  themeBackup = { ...props.theme, subjects: props.theme.subjects.map(s => ({ ...s })) }
  editThemeMode.value = true
  editingSubjects.value = editingSubjects.value.map(() => false)
}

const saveTheme = () => {
  emit('editTheme', props.themeIndex, props.theme)
  editThemeMode.value = false
  themeBackup = null
}

const cancelEditTheme = () => {
  if (themeBackup) {
    props.theme.name = themeBackup.name
    props.theme.description = themeBackup.description
    props.theme.subjects = themeBackup.subjects.map(s => ({ ...s }))
  }
  editThemeMode.value = false
  editingSubjects.value = editingSubjects.value.map(() => false)
  themeBackup = null
}

// --- SUBJECT METHODS ---
const enterEditSubject = (sIndex: number) => {
  subjectBackups[sIndex] = { ...props.theme.subjects[sIndex] }
  editingSubjects.value[sIndex] = true
}

const saveSubject = (sIndex: number) => {
  emit('editSubject', props.themeIndex, sIndex, props.theme.subjects[sIndex])
  editingSubjects.value[sIndex] = false
  delete subjectBackups[sIndex]
}

const cancelEditSubject = (sIndex: number) => {
  if (subjectBackups[sIndex]) {
    props.theme.subjects[sIndex] = { ...subjectBackups[sIndex] }
    delete subjectBackups[sIndex]
  }
  editingSubjects.value[sIndex] = false
}
</script>

<template>
  <v-card class="mb-6 overflow-hidden">
    <!-- HEADER THEME -->
    <div class="flex justify-between items-start bg-gray-50 px-4 py-3">
      <div class="flex flex-col w-full">
        <!-- VIEW MODE -->
        <template v-if="!editThemeMode">
          <h3 class="cursor-pointer font-semibold text-lg hover:text-primary" @click="enterEditTheme">
            <span v-if="props.theme.name">{{ props.theme.name }}</span>
            <span v-else class="text-gray-400 italic">{{ t('themes.noName') }}</span>
          </h3>
          <p class="text-gray-600 text-sm">
            <span v-if="props.theme.description">{{ props.theme.description }}</span>
            <span v-else class="text-gray-400 italic">{{ t('themes.noDescription') }}</span>
          </p>
        </template>

        <!-- EDIT MODE -->
        <template v-else>
          <div class="flex flex-col gap-2 w-full">
            <v-text-field
              v-model="props.theme.name"
              density="compact"
              variant="underlined"
              hide-details
              :placeholder="t('themes.namePlaceholder')"
              class="w-full"
            />
            <v-textarea
              v-model="props.theme.description"
              density="compact"
              variant="underlined"
              auto-grow
              hide-details
              :placeholder="t('themes.descriptionPlaceholder')"
              class="w-full"
            />

            <div class="flex gap-2">
              <v-btn icon="mdi-check" size="small" color="green" @click="saveTheme" :title="t('common.save')"/>
              <v-btn icon="mdi-restore" size="small" color="grey" variant="text" @click="cancelEditTheme" :title="t('common.cancel')"/>
            </div>
          </div>
        </template>
      </div>

      <!-- ACTION BUTTONS -->
      <div class="flex gap-2 ml-4">
        <v-btn icon="mdi-plus-thick" color="primary" variant="text" size="small" @click="emit('addSubject', props.themeIndex)" :title="t('themes.addTopic')"/>
        <v-btn icon="mdi-pencil" color="primary" variant="text" size="small" @click="enterEditTheme" :title="t('common.edit')"/>
        <v-btn icon="mdi-delete" color="red" variant="text" size="small" @click.stop="emit('deleteTheme', props.themeIndex)" :title="t('common.delete')"/>
      </div>
    </div>

    <!-- SUBJECTS -->
    <div class="mt-4 px-4 pb-4 flex flex-col gap-3">
      <v-card
        v-for="(subject, sIndex) in props.theme.subjects"
        :key="subject.id"
        class="px-4 py-3 rounded-lg transition hover:shadow-sm relative"
        variant="tonal"
        elevation="0"
      >
        <!-- VIEW MODE SUBJECT -->
        <template v-if="!editingSubjects[sIndex]">
          <div class="flex justify-between items-start">
            <div>
              <p class="font-medium">
                <span v-if="subject.name">{{ subject.name }}</span>
                <span v-else class="text-gray-400 italic">{{ t('themes.noName') }}</span>
              </p>
              <p class="text-gray-500 text-sm">
                <span v-if="subject.description">{{ subject.description }}</span>
                <span v-else class="text-gray-400 italic">{{ t('themes.noDescription') }}</span>
              </p>
            </div>
            <div class="flex gap-2">
              <v-btn icon="mdi-pencil" color="primary" size="small" variant="text" @click.stop="enterEditSubject(sIndex)" :title="t('common.edit')"/>
              <v-btn icon="mdi-delete" color="red" size="small" variant="text" @click.stop="emit('removeSubject', props.themeIndex, sIndex)" :title="t('common.delete')"/>
            </div>
          </div>
        </template>

        <!-- EDIT MODE SUBJECT -->
        <template v-else>
          <div class="flex flex-col gap-2 w-full mt-2">
            <v-text-field
              v-model="subject.name"
              density="compact"
              variant="underlined"
              hide-details
              placeholder="Name"
              class="w-full"
            />
            <v-textarea
              v-model="subject.description"
              density="compact"
              variant="underlined"
              auto-grow
              hide-details
              placeholder="Description"
              class="w-full"
            />
            <div class="flex gap-2 mt-2">
              <v-btn icon="mdi-check" size="small" color="green" @click="saveSubject(sIndex)" :title="t('common.save')"/>
              <v-btn icon="mdi-restore" size="small" color="grey" variant="text" @click="cancelEditSubject(sIndex)" :title="t('common.cancel')"/>
            </div>
          </div>
        </template>
      </v-card>
    </div>
  </v-card>
</template>
