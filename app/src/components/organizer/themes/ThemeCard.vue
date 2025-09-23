<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { ThemesDTO, SubjectDTO } from '@/types/hackathon'
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

  // --- COPIES LOCALES ---
  const localTheme = ref<ThemesDTO>({
    ...props.theme,
    subjects: props.theme.subjects.map((s) => ({ ...s })),
  })

  const editThemeMode = ref(false)
  const editingSubjects = ref<boolean[]>(props.theme.subjects.map(() => false))

  // --- THEME METHODS ---
  const enterEditTheme = () => {
    localTheme.value = { ...props.theme, subjects: props.theme.subjects.map((s) => ({ ...s })) }
    editThemeMode.value = true
    editingSubjects.value = editingSubjects.value.map(() => false)
  }

  const saveTheme = () => {
    emit('editTheme', props.themeIndex, { ...localTheme.value })
    editThemeMode.value = false
  }

  const cancelEditTheme = () => {
    editThemeMode.value = false
    editingSubjects.value = editingSubjects.value.map(() => false)
  }

  // --- SUBJECT METHODS ---
  const enterEditSubject = (sIndex: number) => {
    editingSubjects.value[sIndex] = true
  }

  const saveSubject = (sIndex: number) => {
    emit('editSubject', props.themeIndex, sIndex, { ...localTheme.value.subjects[sIndex] })
    editingSubjects.value[sIndex] = false
  }

  const cancelEditSubject = (sIndex: number) => {
    // Restaurer la copie initiale du sujet
    localTheme.value.subjects[sIndex] = { ...props.theme.subjects[sIndex] }
    editingSubjects.value[sIndex] = false
  }

  // --- WATCHERS ---
  watch(
    () => props.theme.subjects.length,
    (newLen) => {
      while (editingSubjects.value.length < newLen) editingSubjects.value.push(false)
    }
  )

  watch(editThemeMode, (isEditing) => {
    if (isEditing) {
      editingSubjects.value = editingSubjects.value.map(() => false)
    }
  })
</script>

<template>
  <v-card class="mb-6 overflow-hidden">
    <!-- HEADER THEME -->
    <div class="flex justify-between items-start bg-gray-50 px-4 py-3">
      <div class="flex flex-col w-full">
        <!-- VIEW MODE -->
        <template v-if="!editThemeMode">
          <h3
            class="cursor-pointer font-semibold text-lg hover:text-primary"
            @click="enterEditTheme"
          >
            {{ props.theme.name || t('themes.newTheme') }}
          </h3>
          <p class="text-gray-600 text-sm">{{ props.theme.description }}</p>
        </template>

        <!-- EDIT MODE -->
        <template v-else>
          <div class="flex flex-col gap-2 w-full">
            <v-text-field
              v-model="localTheme.name"
              density="compact"
              variant="underlined"
              hide-details
              placeholder="Name"
              class="w-full"
            />
            <v-textarea
              v-model="localTheme.description"
              density="compact"
              variant="underlined"
              auto-grow
              hide-details
              placeholder="Description"
              class="w-full"
            />
            <div class="flex gap-2 mt-2">
              <v-btn icon="mdi-check" size="small" color="primary" @click="saveTheme" />
              <v-btn icon="mdi-restore" size="small" color="secondary" @click="cancelEditTheme" />
            </div>
          </div>
        </template>
      </div>

      <!-- ACTION BUTTONS -->
      <div class="flex gap-2 ml-4">
        <v-btn
          icon="mdi-plus"
          color="primary"
          variant="text"
          size="small"
          @click.stop="emit('addSubject', props.themeIndex)"
        />
        <v-btn
          icon="mdi-delete"
          color="red"
          variant="text"
          size="small"
          @click.stop="emit('deleteTheme', props.themeIndex)"
        />
      </div>
    </div>

    <!-- SUBJECTS -->
    <div class="mt-4 px-4 pb-4 flex flex-col gap-3">
      <v-card
        v-for="(subject, sIndex) in localTheme.subjects"
        :key="subject.id"
        class="px-4 py-3 rounded-lg transition hover:shadow-sm relative"
        variant="tonal"
        elevation="0"
      >
        <!-- VIEW MODE -->
        <template v-if="!editingSubjects[sIndex]">
          <div class="flex justify-between items-start">
            <div>
              <p class="font-medium">{{ subject.name || t('themes.newSubject') }}</p>
              <p class="text-gray-500 text-sm">{{ subject.description }}</p>
            </div>
            <div class="flex gap-2">
              <v-btn
                icon="mdi-pencil"
                color="primary"
                size="small"
                @click.stop="enterEditSubject(sIndex)"
              />
              <v-btn
                icon="mdi-delete"
                color="red"
                size="small"
                @click.stop="emit('removeSubject', props.themeIndex, sIndex)"
              />
            </div>
          </div>
        </template>

        <!-- EDIT MODE -->
        <template v-else>
          <div class="flex flex-col gap-2 w-full">
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
              <v-btn icon="mdi-check" size="small" color="primary" @click="saveSubject(sIndex)" />
              <v-btn
                icon="mdi-restore"
                size="small"
                color="secondary"
                @click="cancelEditSubject(sIndex)"
              />
            </div>
          </div>
        </template>
      </v-card>
    </div>
  </v-card>
</template>
