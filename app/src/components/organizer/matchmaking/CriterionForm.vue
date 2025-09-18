<script setup lang="ts">
  import { CriterionDTO } from '@/types/hackathon';
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  // -----------------------------
  // Props & Emits
  // -----------------------------
  const props = defineProps<{
    modelValue: boolean
    editMode?: boolean
    criterion?: CriterionDTO | null
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'save', criterion: CriterionDTO): void
  }>()

  // -----------------------------
  // Dialog state
  // -----------------------------
  const localModelValue = ref(props.modelValue)
  watch(
    () => props.modelValue,
    (val) => (localModelValue.value = val)
  )
  watch(localModelValue, (val) => emit('update:modelValue', val))

  const criterion = ref<CriterionDTO>({
    rule: 'MIN',
    schools: [],
    value: 2,
  })

  const resetForm = () => {
    criterion.value = {
      rule: 'MIN',
      schools: [],
      value: 1,
    }
  }

  const close = () => {
    localModelValue.value = false
    resetForm()
  }

  // -----------------------------
  // Save criterion (add or edit to list from backend)
  // -----------------------------
  const save = async () => {
    console.log('Nouveau critère sauvegardé:', criterion.value)
    emit('save', criterion.value)
    close()
  }

  // -----------------------------
  // Initialize form when dialog opens
  // -----------------------------
  watch(
    localModelValue,
    (open) => {
      if (!open) return
      if (props.editMode && props.criterion) {
        criterion.value = { ...props.criterion }
      } else {
        resetForm()
      }
    },
    { immediate: true }
  )
</script>

<template>
  <v-dialog v-model="localModelValue" max-width="800">
    <v-card>
      <v-card-title class="text-lg font-bold px-6 pt-6">
        {{ props.editMode ? t('matchmakingSettings.editCriterion') : t('matchmakingSettings.addCriterion') }}
        <v-btn icon class="absolute top-2 right-2" @click="close" aria-label="Close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="save">
          

          <v-card-actions class="justify-center">
            <v-btn color="primary" type="submit" variant="elevated" class="px-8 mb-3">
              {{ props.editMode ? t('common.edit') : t('common.create') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
