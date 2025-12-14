<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { TaskKey } from '@/types/hackathon_phase'
  import { useAuthStore } from '@/stores/auth'
  import { storeToRefs } from 'pinia'
  import { computed, ref } from 'vue'
  import { useConfiguration } from '@/composables/useConfiguration'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'
  import { ThemesDTO } from '@/types/config'
  import type { ConfigurationResponse } from '@/types/config'
  import { UserDTO } from '@/types/user'
  import { userService } from '@/services/userService'
  import AppSnackbar from '../common/AppSnackbar.vue'

  const { t, tm } = useI18n()

  // Snackbar
  const snackbar = ref(false)
  const text = ref('')
  const timeout = ref(1500)
  const error = ref(false)

  const authStore = useAuthStore()
  const { user } = storeToRefs(authStore)
  const { updateUserFields } = authStore

  const taskData = computed(() => {
    return tm(`dashboard.participant.${TaskKey.TOPIC_SELECTION}`) as
      | { title: string; description: string; [key: string]: any }
      | undefined
  })

  const initialFavoriteSubjectId = user?.value?.favoriteSubjectId || null
  const selectedSubjectId = ref<string | null>(initialFavoriteSubjectId)
  const isSaving = ref(false)

  const isCompleted = computed<boolean>(() => {
    return user?.value?.favoriteSubjectId !== null && user?.value?.favoriteSubjectId !== undefined
  })

  const isSelectionChanged = computed<boolean>(() => {
    return selectedSubjectId.value !== user?.value?.favoriteSubjectId
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

  const handleSave = async (userToUpdate: UserDTO) => {
    if (!selectedSubjectId.value) return

    isSaving.value = true
    try {
      const updatePayload = {
        favoriteSubjectId: selectedSubjectId.value,
      }
      const savedUser = await userService.update(userToUpdate.id, updatePayload)

      updateUserFields(savedUser)
      selectedSubjectId.value = savedUser.favoriteSubjectId || null

      text.value = t('common.changesSaved')
      error.value = false
      snackbar.value = true
    } catch (err) {
      console.error('Error saving user:', err)
      text.value = t('errors.loadUserFailed')
      error.value = true
      snackbar.value = true
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

    <div v-if="!isCompleted">
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
              <div>{{ theme.name }}</div>
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
          @click="handleSave(user!)"
        >
          {{ t('common.save') }}
        </v-btn>
      </div>
    </div>

    <div v-else>
      <p>
        {{
          t('dashboard.participant.topic_selection.selectedTopic', {
            topicName:
              themes
                .flatMap((theme) => theme.subjects)
                .find((subject) => subject.id === user?.favoriteSubjectId)?.name || '',
          })
        }}
      </p>
    </div>
  </div>

  <AppSnackbar v-model="snackbar" :message="text" :timeout="timeout" :error="error" />
</template>
