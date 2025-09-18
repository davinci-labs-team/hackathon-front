<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { ref, onMounted } from 'vue'
  import AppSnackbar from '@/components/common/AppSnackbar.vue'
  import { settingsService } from '@/services/settingsService'
import { PartnersDTO } from '@/types/hackathon'

  const { t } = useI18n()

  // Snackbar
  const snackbar = ref(false)
  const text = ref(t('common.changesSaved'))
  const timeout = ref(1500)
  const error = ref(false)

  // Matchmaking settings
  const matchmakingEnabled = ref(false)
  const showCriterionForm = ref(false)
  const minTeamSize = ref(2)
  const maxTeamSize = ref(5)

  const partners = ref<PartnersDTO[]>([])
  const schoolNames = ref<string[]>([])

  onMounted(async () => {
    try {
      const settings = await settingsService.findWithKey('partners')
      partners.value = settings.value
      schoolNames.value = partners.value.filter(p => p.isParticipatingSchool).map(p => p.name)
      console.log(schoolNames.value)
    } catch (e) {
      text.value = t('common.errorOccurred')
      error.value = true
      snackbar.value = true
    }
  })

  const handleSave = async () => {
    snackbar.value = true
  }
</script>

<template>
  <v-container class="py-10 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-2">{{ t('matchmakingSettings.title') }}</h1>
    <div class="flex-direction-row mb-5 flex items-center justify-between">
      <p class="mb-0 text-lg text-gray-600">{{ t('matchmakingSettings.subtitle') }}</p>
      <v-btn color="primary" @click="handleSave">{{ t('common.saveChanges') }}</v-btn>
    </div>

    <AppSnackbar v-model="snackbar" :message="text" :timeout="timeout" :error="error" />

    <v-container>
      <v-switch
        v-model="matchmakingEnabled"
        :label="
          matchmakingEnabled
            ? t('matchmakingSettings.matchmakingEnabled')
            : t('matchmakingSettings.matchmakingDisabled')
        "
        class="mb-2"
        color="green"
      ></v-switch>

      <v-row v-if="matchmakingEnabled" class="mb-2" self-align="center">
        <v-col cols="12" md="6">
          <p class="mb-2 font-medium">{{ t('matchmakingSettings.minTeamSize') }}</p>
          <v-text-field
            v-model="minTeamSize"
            :placeholder="t('matchmakingSettings.minTeamSize')"
            type="number"
            min="1"
            class="w-full"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <p class="mb-2 font-medium">{{ t('matchmakingSettings.maxTeamSize') }}</p>
          <v-text-field
            v-model="maxTeamSize"
            :placeholder="t('matchmakingSettings.maxTeamSize')"
            type="number"
            :min="minTeamSize"
            class="w-full"
            variant="outlined"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-container v-if="matchmakingEnabled" class="p-0">
        <div class="flex-direction-row mb-5 flex items-center justify-between">
          <h2 class="text-2xl font-bold mb-2">{{ t('matchmakingSettings.criteria') }}</h2>
          <v-btn color="primary" @click="showCriterionForm = true">
            {{ t('matchmakingSettings.addCriterionBtn') }}
          </v-btn>
        </div>
      </v-container>
    </v-container>
  </v-container>
</template>
