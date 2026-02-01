<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { ref, computed, watch } from 'vue'
  import AppSnackbar from '@/components/common/AppSnackbar.vue'
  import { ConstraintDTO, MatchmakingSettingsDTO, PartnersDTO } from '@/types/config'
  import Constraints from '@/components/organizer/matchmaking/Constraints.vue'
  import ConstraintForm from '../matchmaking/ConstraintForm.vue'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'
  import { useConfiguration } from '@/composables/useConfiguration'

  const { t } = useI18n()

  const {
    configuration: matchmakingConfig,
    loading: matchmakingLoading,
    error: matchmakingError,
    updateConfiguration: updateMatchmaking,
  } = useConfiguration(ConfigurationKey.MATCHMAKING)

  const { configuration: partnersConfig, loading: partnersLoading } = useConfiguration(
    ConfigurationKey.PARTNERS
  )

  // Snackbar
  const snackbar = ref(false)
  const text = ref(t('common.changesSaved'))
  const timeout = ref(1500)
  const error = ref(false)

  const errorMessage = ref<string>('')

  const isSaving = ref(false)

  const isLoading = computed(() => matchmakingLoading.value || partnersLoading.value)

  // Matchmaking settings
  const showCriterionForm = ref(false)
  const matchmakingSettings = ref<MatchmakingSettingsDTO>({
    isActive: false,
    teamSizeMin: 1,
    teamSizeMax: 4,
    constraints: [],
  })

  const schoolNames = ref<string[]>([])

  const validateConstraints = (constraints: ConstraintDTO[]) => {
    const schoolMap: Record<string, ConstraintDTO[]> = {}

    constraints.forEach((constraint) => {
      constraint.schools.forEach((school) => {
        if (!schoolMap[school]) schoolMap[school] = []
        schoolMap[school].push(constraint)
      })
    })

    const errors: string[] = []

    Object.entries(schoolMap).forEach(([school, cons]) => {
      const rules = cons.map((c) => c.rule)
      const counts = rules.reduce<Record<string, number>>((acc, r) => {
        acc[r] = (acc[r] || 0) + 1
        return acc
      }, {})

      // Verify uniqueness of rules
      if (counts.MIN && counts.MIN > 1)
        errors.push(`${t('matchmakingSettings.errors.moreThanOneMin')}${school}`)
      if (counts.MAX && counts.MAX > 1)
        errors.push(`${t('matchmakingSettings.errors.moreThanOneMax')}${school}`)
      if (counts.EQUAL && counts.EQUAL > 1)
        errors.push(`${t('matchmakingSettings.errors.moreThanOneEqual')}${school}`)
      if (counts.EQUAL && (counts.MIN || counts.MAX))
        errors.push(`${t('matchmakingSettings.errors.incompatibleRules')}${school}`)

      // Check MIN/MAX coherence
      const minConstraint = cons.find((c) => c.rule === 'MIN')
      const maxConstraint = cons.find((c) => c.rule === 'MAX')

      if (minConstraint && maxConstraint) {
        const minValue = Number(minConstraint.value)
        const maxValue = Number(maxConstraint.value)
        if (minValue > maxValue) {
          errors.push(`${t('matchmakingSettings.errors.minGreaterThanMax')}${school}`)
        }
      }
    })

    return errors
  }

  const handleSave = async () => {
    isSaving.value = true
    try {
      const payload = {
        ...matchmakingSettings.value,
        teamSizeMin: Number(matchmakingSettings.value.teamSizeMin),
        teamSizeMax: Number(matchmakingSettings.value.teamSizeMax),
        constraints: matchmakingSettings.value.constraints.map((c) => ({
          ...c,
          value: Number(c.value),
        })),
      }

      await updateMatchmaking({ value: payload })

      text.value = t('common.changesSaved')
      error.value = false
      snackbar.value = true
    } catch (e) {
      console.error('Error saving matchmaking settings:', e)
      text.value = t('common.error')
      error.value = true
      snackbar.value = true
    } finally {
      isSaving.value = false
    }
  }

  const deleteConstraint = (criterion: ConstraintDTO) => {
    matchmakingSettings.value.constraints = matchmakingSettings.value.constraints.filter(
      (c) => c !== criterion
    )
    handleSave()
  }

  const addConstraint = (criterion: ConstraintDTO) => {
    const temporaryConstraints = [...matchmakingSettings.value.constraints, criterion]
    const validationErrors = validateConstraints(temporaryConstraints)
    if (validationErrors.length > 0) {
      errorMessage.value = validationErrors.join(', ')
      return
    }
    matchmakingSettings.value.constraints.push(criterion)
    errorMessage.value = ''
    handleSave()
  }

  const updateConstraint = (index: number | undefined, updatedCriterion: ConstraintDTO) => {
    const temporaryConstraints = matchmakingSettings.value.constraints.map((c, i) =>
      i === index ? updatedCriterion : c
    )
    const validationErrors = validateConstraints(temporaryConstraints)
    if (validationErrors.length > 0) {
      errorMessage.value = validationErrors.join(', ')
      return
    }
    if (index === undefined) return
    matchmakingSettings.value.constraints[index] = updatedCriterion
    errorMessage.value = ''
    handleSave()
  }

  const hasConstraints = computed(
    () => matchmakingSettings.value.constraints && matchmakingSettings.value.constraints.length > 0
  )

  watch(
    partnersConfig,
    (newConfig) => {
      if (newConfig && newConfig.value && Array.isArray(newConfig.value.partners)) {
        const partners = newConfig.value.partners as PartnersDTO[]
        schoolNames.value = partners.filter((p) => p.isParticipatingSchool).map((p) => p.name)
      } else {
        schoolNames.value = []
      }
    },
    { immediate: true }
  )

  watch(
    matchmakingConfig,
    (newConfig) => {
      if (newConfig && newConfig.value) {
        matchmakingSettings.value = newConfig.value as MatchmakingSettingsDTO

        if (matchmakingError.value) {
          text.value = t('common.error')
          error.value = true
          snackbar.value = true
        }
      }
    },
    { immediate: true }
  )
</script>

<template>
  <v-container class="py-10 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-2">{{ t('matchmakingSettings.title') }}</h1>
    <div class="flex-direction-row mb-5 flex items-center justify-between">
      <p class="mb-0 text-lg text-gray-600">{{ t('matchmakingSettings.subtitle') }}</p>
      <v-btn color="primary" @click="handleSave" :disabled="isLoading || isSaving">{{ t('common.saveChanges') }}</v-btn>
    </div>

    <AppSnackbar v-model="snackbar" :message="text" :timeout="timeout" :error="error" />

    <v-alert v-if="isLoading" type="info" class="mb-4"> {{ t('common.loading') }}... </v-alert>

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

        <p v-if="errorMessage" class="text-red-600 mb-4">{{ errorMessage }}</p>

        <p v-if="!hasConstraints">{{ t('matchmakingSettings.noConstraints') }}</p>

        <Constraints
          v-if="hasConstraints"
          :constraints="matchmakingSettings?.constraints || []"
          :items-per-page="5"
          :school-names="schoolNames"
          :max-team-size="matchmakingSettings.teamSizeMax"
          @delete="deleteConstraint"
          @edit="updateConstraint"
        />

        <ConstraintForm
          v-model="showCriterionForm"
          :school-names="schoolNames"
          :edit-mode="false"
          :max-team-size="Number(matchmakingSettings.teamSizeMax)"
          @save="addConstraint"
        />
      </v-container>
    </v-container>
  </v-container>
</template>
