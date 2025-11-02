<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ThemesDTO, SubjectDTO, UpdateConfigurationDTO } from '@/types/config'
import ThemeCard from '@/components/organizer/themes/ThemeCard.vue'
import { configurationService, getOrCreateConfiguration } from '@/services/configurationService'
import { ConfigurationKey } from '@/utils/configuration/configurationKey'
import AppSnackbar from '@/components/common/AppSnackbar.vue'
import { v4 as uuidv4 } from 'uuid'

const { t } = useI18n()

const themes = ref<ThemesDTO[]>([])

// Snackbar
const snackbar = ref(false)
const text = ref('')
const timeout = ref(1500)
const error = ref(false)

onMounted(async () => {
  try {
    const response = await getOrCreateConfiguration(ConfigurationKey.THEMES)
    themes.value = response.value as ThemesDTO[]
  } catch (error) {
    console.error('Error fetching partners:', error)
  }
})

const saveThemes = async () => {
  const updateDto: UpdateConfigurationDTO = {
    value: themes.value
  }

  try {
    await configurationService.update(ConfigurationKey.THEMES, updateDto)
    text.value = t('common.changesSaved')
    error.value = false
    snackbar.value = true
  } catch (e) {
    console.error('Error updating themes: ', e)
    text.value = t('common.error')
    error.value = true
    snackbar.value = true
  }
}

// --- THEMES ---
const addTheme = () => {
  if (themes.value.some(theme => !theme.name.trim())) return

  const newTheme: ThemesDTO = {
    id: uuidv4(),
    name: '',
    description: '',
    subjects: [],
  }
  themes.value.push(newTheme)
}

const removeTheme = (themeIndex: number) => {
  themes.value.splice(themeIndex, 1)
}

const editTheme = (themeIndex: number, updatedTheme: ThemesDTO) => {
  themes.value[themeIndex] = updatedTheme
}

// --- SUBJECTS ---
const addSubject = (themeIndex: number) => {
  const newSubject: SubjectDTO = {
    id: uuidv4(),
    name: '',
    description: '',
  }
  themes.value[themeIndex].subjects.push(newSubject)
}

const removeSubject = (themeIndex: number, subjectIndex: number) => {
  themes.value[themeIndex].subjects.splice(subjectIndex, 1)
}

const editSubject = (themeIndex: number, subjectIndex: number, updatedSubject: SubjectDTO) => {
  themes.value[themeIndex].subjects[subjectIndex] = updatedSubject
}

const validThemes = (): boolean => {
  if (themes.value.length === 0) return false

  if (themes.value.some(theme => !theme.name || !theme.name.trim())) return false

  if (themes.value.some(theme => !theme.subjects || theme.subjects.length === 0)) return false

  if (themes.value.some(theme => theme.subjects.some(s => !s.name || !s.name.trim()))) return false

  return true
}
</script>

<template>
  <v-container>
    <v-row justify="center" class="mt-8">
      <div class="w-full md:w-8/12 lg:w-8/12 px-4">
        <h1 class="text-3xl font-bold">{{ t('organizer.nav.themes') }}</h1>

        <div class="flex items-center justify-between mb-5">
          <p class="text-gray-600 text-lg mb-0">{{ t('themes.subtitle') }}</p>
          <div class="flex items-center justify-end mb-5">
          <v-btn color="primary" @click="saveThemes" :disabled="!validThemes()">
            {{ t('common.saveChanges') }}
          </v-btn>
        </div>
        </div>

        <div v-if="themes.length === 0" class="text-center text-gray-600 my-10">
          {{ t('themes.noThemes') }}
        </div>

        <ThemeCard
          v-for="(theme, index) in themes"
          :key="theme.id"
          :theme="theme"
          :themeIndex="index"
          @deleteTheme="removeTheme"
          @addSubject="addSubject"
          @removeSubject="removeSubject"
          @editTheme="editTheme"
          @editSubject="editSubject"
        />

        <AppSnackbar v-model="snackbar" :message="text" :timeout="timeout" :error="error" />

        <div class="flex justify-center mt-6">
          <v-btn 
            color="primary" 
            @click="addTheme"
            :disabled="themes.some(theme => !theme.name.trim())"
          >
            {{ t('themes.addThemeBtn') }}
          </v-btn>
        </div>
      </div>
    </v-row>
  </v-container>
</template>
