<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { TaskKey } from '@/types/hackathon_phase'
  import { useAuthStore } from '@/stores/auth'
  import { computed, ref } from 'vue'
  import { useConfiguration } from '@/composables/useConfiguration'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'
  import { ThemesDTO } from '@/types/config'
  import type { ConfigurationResponse } from '@/types/config'

  const { t, tm } = useI18n()

  const { user } = useAuthStore()

  const taskData = computed(() => {
    return tm(`dashboard.participant.${TaskKey.TOPIC_SELECTION}`) as
      | { title: string; description: string; [key: string]: any }
      | undefined
  })

  const initialFavoriteSubjectId = user?.favoriteSubjectId || null
  const selectedSubjectId = ref<string | null>(initialFavoriteSubjectId)
  const isSaving = ref(false)

  const isCompleted = computed<boolean>(() => {
    return !!user?.favoriteSubjectId
  })

  const isSelectionChanged = computed<boolean>(() => {
    return selectedSubjectId.value !== user?.favoriteSubjectId
  })

  const { configuration: themesConfiguration, loading: isThemesLoading } = useConfiguration(
    ConfigurationKey.THEMES
  )

  const themes = computed<ThemesDTO[]>(() => {
    const config = themesConfiguration.value as ConfigurationResponse | null

    if (config?.value?.themes && Array.isArray(config.value.themes)) {
      return config.value.themes.filter(
        (theme: ThemesDTO) => theme.subjects && theme.subjects.length > 0
      )
    }
    return []
  })

  const saveSelection = async () => {
    if (!selectedSubjectId.value) return

    isSaving.value = true
    try {
      console.log('Sujet sélectionné et en cours de sauvegarde:', selectedSubjectId.value)
      user!.favoriteSubjectId = selectedSubjectId.value
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la sélection du sujet:', error)
    } finally {
      isSaving.value = false
    }
  }

  /**
   * Définit le sujet sélectionné pour la radio-bouton
   * @param subjectId L'ID du sujet cliqué.
   */
  const selectSubject = (subjectId: string) => {
    selectedSubjectId.value = subjectId
  }
</script>

<template>
  <div>
    <div class="mb-4 flex justify-between items-center">
      <h3 class="text-h6 d-flex align-center">
        <v-icon :color="isCompleted ? 'success' : 'warning'" class="mr-2">
          {{ isCompleted ? 'mdi-check-circle' : 'mdi-alert-circle' }}
        </v-icon>
        {{ taskData?.title || t('dashboard.participant.topic_selection.title') }}
      </h3>

      <v-chip label :color="isCompleted ? 'success' : 'warning'" class="mb-4">
        <v-icon size="small" class="mr-1">
          {{ isCompleted ? 'mdi-check' : 'mdi-clock-outline' }}
        </v-icon>
        {{ isCompleted ? t('common.completed') : t('common.pending') }}
      </v-chip>
    </div>

    <div v-if="taskData">
      <p class="text-medium-emphasis mb-4">
        {{ taskData.description || '' }}
      </p>

      <div v-if="!isCompleted || isSelectionChanged">
        <h4 class="text-subtitle-1 font-weight-bold mb-4">
          {{ t('dashboard.participant.topic_selection.actionTitle') }} :
        </h4>
      </div>
    </div>

    <div v-if="themes.length > 0" class="space-y-6">
      <v-expansion-panels variant="accordion">
        <v-expansion-panel v-for="theme in themes" :key="theme.id">
          <v-expansion-panel-title>
            <div class="font-weight-bold">{{ theme.name }}</div>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <p class="text-medium-emphasis mb-4">{{ theme.description }}</p>

            <div v-if="theme.subjects && theme.subjects.length > 0" class="space-y-4">
              <v-card
                v-for="subject in theme.subjects"
                :key="subject.id"
                :color="selectedSubjectId === subject.id ? 'primary' : ''"
                :variant="selectedSubjectId === subject.id ? 'tonal' : 'outlined'"
                class="cursor-pointer"
                @click="selectSubject(subject.id)"
              >
                <v-card-title class="font-weight-medium text-body-1 d-flex align-center">
                  <v-radio
                    :value="subject.id"
                    :model-value="selectedSubjectId"
                    @click.stop="selectSubject(subject.id)"
                    class="mr-2"
                    hide-details
                  ></v-radio>
                  {{ subject.name }}
                </v-card-title>
                <v-card-text>
                  {{ subject.description }}
                </v-card-text>
              </v-card>
            </div>
            <div v-else>
              <p class="text-medium-emphasis">{{ t('common.no_subjects_available') }}</p>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <div v-else class="text-center py-8">
      <v-progress-circular
        v-if="isThemesLoading"
        indeterminate
        color="primary"
      ></v-progress-circular>
      <p v-else class="text-medium-emphasis">{{ t('common.no_themes_available') }}</p>
    </div>

    <div class="mt-8 d-flex justify-end">
      <v-btn
        color="primary"
        :loading="isSaving"
        :disabled="!selectedSubjectId || !isSelectionChanged"
        @click="saveSelection"
      >
        {{ t('common.save') }}
      </v-btn>
    </div>
  </div>
</template>
