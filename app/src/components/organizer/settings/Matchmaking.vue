<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { ref, onMounted } from 'vue'
  import AppSnackbar from '@/components/common/AppSnackbar.vue'
  import { settingsService } from '@/services/settingsService'
  import {
    ConstraintDTO,
    MatchmakingSettingsDTO,
    PartnersDTO,
    UpdateSettingDTO,
  } from '@/types/hackathon'
  import Constraints from '@/components/organizer/matchmaking/Constraints.vue'
  import ConstraintForm from '../matchmaking/ConstraintForm.vue'

  const { t } = useI18n()

  // Snackbar
  const snackbar = ref(false)
  const text = ref(t('common.changesSaved'))
  const timeout = ref(1500)
  const error = ref(false)

  // Matchmaking settings
  const showCriterionForm = ref(false)
  const matchmakingSettings = ref<MatchmakingSettingsDTO>({
    isActive: false,
    teamSizeMin: 1,
    teamSizeMax: 4,
    constraints: [],
  })

  const partners = ref<PartnersDTO[]>([])
  const schoolNames = ref<string[]>([])

  onMounted(async () => {
    try {
      const settings = await settingsService.findWithKey('partners')
      partners.value = settings.value
      schoolNames.value = partners.value.filter((p) => p.isParticipatingSchool).map((p) => p.name)

      const matchmaking = await settingsService.findWithKey('matchmaking')
      console.log('matchmaking', matchmaking)
      matchmakingSettings.value = matchmaking.value
      console.log(matchmakingSettings.value)
      console.log(schoolNames.value)
    } catch (e) {
      text.value = t('common.errorOccurred')
      error.value = true
      snackbar.value = true
    }
  })

  const handleSave = async () => {
    const payload: UpdateSettingDTO = {
      key: 'matchmaking',
      value: matchmakingSettings.value,
    }
    try {
      await settingsService.update('1', payload)
      text.value = t('common.changesSaved')
      error.value = false
      snackbar.value = true
    } catch (e) {
      text.value = t('common.errorOccurred')
      error.value = true
      snackbar.value = true
    }
  }

  const deleteConstraint = (criterion: ConstraintDTO) => {
    console.log('Deleting constraint', criterion)
    matchmakingSettings.value.constraints = matchmakingSettings.value.constraints.filter(
      (c) => c !== criterion
    )
    handleSave()
  }

  const addConstraint = (criterion: ConstraintDTO) => {
    console.log('Adding constraint', criterion)
    matchmakingSettings.value.constraints.push(criterion)
    handleSave()
  }

  const updateConstraint = (updatedCriterion: ConstraintDTO) => {
    matchmakingSettings.value.constraints = matchmakingSettings.value.constraints.map((c) =>
      c.schools.join('-') === updatedCriterion.schools.join('-') ? updatedCriterion : c
    )
    handleSave()
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
        v-model="matchmakingSettings.isActive"
        :label="
          matchmakingSettings.isActive
            ? t('matchmakingSettings.matchmakingEnabled')
            : t('matchmakingSettings.matchmakingDisabled')
        "
        class="mb-2"
        color="green"
      ></v-switch>

      <v-row v-if="matchmakingSettings?.isActive" class="mb-2" self-align="center">
        <v-col cols="12" md="6">
          <p class="mb-2 font-medium">{{ t('matchmakingSettings.minTeamSize') }}</p>
          <v-text-field
            v-model="matchmakingSettings.teamSizeMin"
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
            v-model="matchmakingSettings.teamSizeMax"
            :placeholder="t('matchmakingSettings.maxTeamSize')"
            type="number"
            :min="matchmakingSettings.teamSizeMin"
            class="w-full"
            variant="outlined"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-container v-if="matchmakingSettings?.isActive" class="p-0">
        <div class="flex-direction-row mb-5 flex items-center justify-between">
          <h2 class="text-2xl font-bold mb-2">{{ t('matchmakingSettings.constraint') }}</h2>
          <v-btn color="primary" @click="showCriterionForm = true">
            {{ t('matchmakingSettings.addConstraintBtn') }}
          </v-btn>
        </div>

        <Constraints
          :constraints="matchmakingSettings?.constraints || []"
          :items-per-page="5"
          :school-names="schoolNames"
          @edit="updateConstraint"
          @delete="deleteConstraint"
        />

        <ConstraintForm
          v-model="showCriterionForm"
          :school-names="schoolNames"
          :edit-mode="false"
          @save="addConstraint"
        />
      </v-container>
    </v-container>
  </v-container>
</template>
