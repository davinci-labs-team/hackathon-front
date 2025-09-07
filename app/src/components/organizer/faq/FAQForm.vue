<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { FAQItemDTO } from '@/types/faq'

  const { t } = useI18n()

  // -----------------------------
  // Props & Emits
  // -----------------------------
  const props = defineProps<{
    modelValue: boolean
    editMode?: boolean
    faqItem?: FAQItemDTO | null
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'save', faqItem: FAQItemDTO): void
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

  // -----------------------------
  // Form state
  // -----------------------------
  const question = ref('')
  const answer = ref('')
  const isPrivate = ref(false)

  // -----------------------------
  // Validation
  // -----------------------------
  const required = (v: string | null | undefined) => !!v || t('common.fieldRequired')

  // -----------------------------
  // Form actions
  // -----------------------------
  const resetForm = () => {
    question.value = ''
    answer.value = ''
    isPrivate.value = false
  }

  const close = () => {
    localModelValue.value = false
    resetForm()
  }

  // -----------------------------
  // Save FAQ item (via backend => TODO)
  // -----------------------------
  const save = async () => {
    if (!question.value || !answer.value) return

    // Création d'un objet FAQItemDTO
    const faqItem: FAQItemDTO = {
      question: question.value,
      answer: answer.value,
      isPrivate: isPrivate.value,
    }
    emit('save', faqItem)
    close()
  }

  // -----------------------------
  // Initialize form when dialog opens
  // -----------------------------
  watch(
    localModelValue,
    (open) => {
      if (!open) return
      if (props.editMode && props.faqItem) {
        question.value = props.faqItem.question
        answer.value = props.faqItem.answer
        isPrivate.value = props.faqItem.isPrivate
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
        {{ props.editMode ? t('faqSettings.editQuestion') : t('faqSettings.addQuestion') }}
        <v-btn icon class="absolute top-2 right-2" @click="close" aria-label="Close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="save">
          <v-text-field
            v-model="question"
            :placeholder="t('faq.question')"
            :rules="[required]"
            variant="outlined"
            dense
            class="mb-4"
          />

          <v-textarea
            v-model="answer"
            :placeholder="t('faq.answer')"
            :rules="[required]"
            variant="outlined"
            auto-grow
            rows="3"
            class="mb-4"
          />

          <v-switch
            v-model="isPrivate"
            :label="isPrivate ? t('announcements.private') : t('announcements.public')"
            :hint="isPrivate ? t('announcements.privateHint') : t('announcements.publicHint')"
            color="blue"
          />

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
