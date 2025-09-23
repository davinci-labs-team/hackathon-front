<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { ThemesDTO, SubjectDTO } from '@/types/hackathon'
  import ThemeCard from '@/components/organizer/themes/ThemeCard.vue'

  const { t } = useI18n()

  const themes = ref<ThemesDTO[]>([
    {
      id: '1',
      name: 'Sustainability',
      description: 'Projects focused on environmental sustainability and green technologies.',
      subjects: [
        {
          id: '1',
          name: 'Renewable Energy',
          description: 'Projects related to solar, wind, and other renewable energy sources.',
        },
        {
          id: '2',
          name: 'Waste Management',
          description: 'Innovative solutions for reducing and managing waste.',
        },
      ],
    },
    {
      id: '2',
      name: 'Healthcare',
      description: 'Innovative solutions in the healthcare sector.',
      subjects: [
        {
          id: '3',
          name: 'Telemedicine',
          description: 'Projects that enhance remote healthcare services.',
        },
        {
          id: '4',
          name: 'Medical Devices',
          description: 'Development of new medical devices and technologies.',
        },
      ],
    },
  ])

  // --- THEMES ---
  const addTheme = () => {
    const newTheme: ThemesDTO = {
      id: Date.now().toString(),
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
      id: Date.now().toString(),
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
</script>

<template>
  <v-container>
    <v-row justify="center" class="mt-8">
      <v-col cols="12" md="8" lg="6">
        <h1 class="text-3xl font-bold">{{ t('organizer.nav.themes') }}</h1>

        <div class="flex items-center justify-between mb-5">
          <p class="text-gray-600 text-lg mb-0">{{ t('themes.subtitle') }}</p>
          <v-btn color="primary" @click="addTheme">{{ t('themes.addThemeBtn') }}</v-btn>
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
      </v-col>
    </v-row>
  </v-container>
</template>
