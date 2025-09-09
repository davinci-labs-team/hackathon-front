<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import AppSnackbar from '@/components/common/AppSnackbar.vue'
  import { FAQItemDTO } from '@/types/faq'
  import FAQForm from '@/components/organizer/faq/FAQForm.vue'
  import FAQItemCard from '../faq/FAQItemCard.vue'
  import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
  import { useFaq } from '@/composables/useFaq'

  const { t } = useI18n()

  /* FAQ */

  // Composable
  const { faqs, createFaq, updateFaq, deleteFaq } = useFaq()

  const showFAQForm = ref(false)
  const editFAQItem = ref<FAQItemDTO | null>(null)
  const faqToDelete = ref<FAQItemDTO | null>(null)
  const showConfirmDialog = ref(false)

  const confirmDelete = (faq: FAQItemDTO) => {
    faqToDelete.value = faq
    showConfirmDialog.value = true
  }

  const handleDelete = async () => {
    if (!faqToDelete.value?.id) return
    await deleteFaq(faqToDelete.value.id)
    showConfirmDialog.value = false
    faqToDelete.value = null
  }

  const handleSaveFAQ = async (faqItem: FAQItemDTO) => {
    if (editFAQItem.value?.id) {
      await updateFaq(editFAQItem.value.id, faqItem)
    } else {
      await createFaq(faqItem)
    }
    editFAQItem.value = null
  }

  const sloganMaxLength = 60
  const hackathonNameMaxLength = 60
  const hackathonDescriptionMaxLength = 500

  const slogan = ref('Build the future with us!')
  const hackathonName = ref('Qubit or not Qubit')
  const hackathonDescription = ref('Hello World')

  // Snackbar to inform user of successful save
  const snackbar = ref(false)
  const text = ref(t('common.changesSaved'))
  const timeout = ref(1500)
  const error = ref(false)

  const hackathonNameRules = computed(() => [
    (v: string) => {
      if (!v) return t('textsSettings.errors.requiredField')
      if (v.length > hackathonNameMaxLength)
        return t('textsSettings.errors.maxLength', { max: hackathonNameMaxLength })
      return true
    },
  ])

  const sloganRules = computed(() => [
    (v: string) => {
      if (v && v.length > sloganMaxLength)
        return t('textsSettings.errors.maxLength', { max: sloganMaxLength })
      return true
    },
  ])

  const hackathonDescriptionRules = computed(() => [
    (v: string) => {
      if (!v) return t('textsSettings.errors.requiredField')
      if (v.length > hackathonDescriptionMaxLength)
        return t('textsSettings.errors.maxLength', { max: hackathonDescriptionMaxLength })
      return true
    },
  ])

  const validateTexts = () => {
    if (!hackathonName.value || hackathonName.value.length > hackathonNameMaxLength) return false
    if (slogan.value && slogan.value.length > sloganMaxLength) return false
    if (
      !hackathonDescription.value ||
      hackathonDescription.value.length > hackathonDescriptionMaxLength
    )
      return false
    return true
  }

  // TODO: replace console.log by actual API call
  const handleSave = () => {
    if (!validateTexts()) {
      text.value = t('textsSettings.errors.fixErrors')
      error.value = true
      snackbar.value = true
      return
    }

    snackbar.value = true
    error.value = false

    const payload = {
      texts: {
        hackathonName: hackathonName.value,
        slogan: slogan.value,
        hackathonDescription: hackathonDescription.value,
      },
    }

    console.log('Payload à envoyer:', JSON.stringify(payload))
  }
</script>

<template>
  <v-container class="py-10 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-2">{{ t('textsSettings.title') }}</h1>
    <div class="flex-direction-row mb-5 flex items-center justify-between">
      <p class="mb-0 text-lg text-gray-600">{{ t('textsSettings.subtitle') }}</p>
      <v-btn color="primary" @click="handleSave">{{ t('common.saveChanges') }}</v-btn>
    </div>

    <v-container>
      <p class="mb-2 text-lg text-600">
        {{ t('textsSettings.hackathonName') }} <span class="text-red-500">*</span>
      </p>
      <v-text-field
        v-model="hackathonName"
        :counter="hackathonNameMaxLength"
        variant="outlined"
        class="mb-0"
      />
      <p class="text-red-500 italic mb-5" v-if="!hackathonName">
        {{ t('textsSettings.errors.requiredField') }}
      </p>
      <p class="text-red-500 italic mb-5" v-if="hackathonName.length > hackathonNameMaxLength">
        {{ t('textsSettings.errors.maxLength', { max: hackathonNameMaxLength }) }}
      </p>

      <p class="mb-2 text-lg text-600">{{ t('textsSettings.slogan') }}</p>
      <v-text-field
        v-model="slogan"
        :counter="sloganMaxLength"
        variant="outlined"
        dense
        class="mb-2"
      />
      <p class="text-red-500 italic mb-5" v-if="slogan.length > sloganMaxLength">
        {{ t('textsSettings.errors.maxLength', { max: sloganMaxLength }) }}
      </p>

      <p class="mb-2 text-lg text-600">
        {{ t('textsSettings.hackathonDescription') }} <span class="text-red-500">*</span>
      </p>
      <v-textarea
        v-model="hackathonDescription"
        :counter="hackathonDescriptionMaxLength"
        variant="outlined"
        auto-grow
        rows="3"
        class="mb-0"
      />
      <p class="text-red-500 italic mb-5" v-if="!hackathonDescription">
        {{ t('textsSettings.errors.requiredField') }}
      </p>
      <p
        class="text-red-500 italic mb-5"
        v-if="hackathonDescription.length > hackathonDescriptionMaxLength"
      >
        {{ t('textsSettings.errors.maxLength', { max: hackathonDescriptionMaxLength }) }}
      </p>

      <AppSnackbar v-model="snackbar" :message="text" :timeout="timeout" :error="error" />
    </v-container>

    <h1 class="text-3xl font-bold mb-2">{{ t('faqSettings.title') }}</h1>
    <div class="flex-direction-row mb-5 flex items-center justify-between">
      <p class="mb-0 text-lg text-gray-600">{{ t('faqSettings.subtitle') }}</p>

      <v-btn color="primary" @click="showFAQForm = true">
        {{ t('faqSettings.addQuestionBtn') }}
      </v-btn>
    </div>

    <div v-if="faqs.length === 0" class="text-center text-gray-600 my-10">
      {{ t('faqSettings.noQuestions') }}
    </div>

    <FAQItemCard
      v-for="faq in faqs"
      :key="faq.id"
      :faqItem="faq"
      @click="
        (item: FAQItemDTO) => {
          editFAQItem = item
          showFAQForm = true
        }
      "
      @delete="confirmDelete(faq)"
    />

    <FAQForm
      v-model="showFAQForm"
      :editMode="!!editFAQItem"
      :faqItem="editFAQItem"
      @close="editFAQItem = null"
      @save="handleSaveFAQ"
    />

    <ConfirmDialog
      v-model="showConfirmDialog"
      :title="t('faqSettings.confirmTitle')"
      :text="`${t('faqSettings.confirmText')} : ${faqToDelete?.question}`"
      :confirmLabel="t('common.delete')"
      :cancelLabel="t('common.cancel')"
      @confirm="handleDelete"
      @cancel="faqToDelete = null"
    />
  </v-container>
</template>
