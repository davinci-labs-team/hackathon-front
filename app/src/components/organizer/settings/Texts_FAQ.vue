<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import AppSnackbar from '@/components/common/AppSnackbar.vue'
  import { FAQItemDTO } from '@/types/faq'
  import FAQForm from '@/components/organizer/faq/FAQForm.vue'
  import FAQItemCard from '../faq/FAQItemCard.vue'
  import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
  import { useFaq } from '@/composables/useFaq'
  import { settingsService } from '@/services/settingsService'
import { UpdateSettingDTO } from '@/types/hackathon'

  const { t } = useI18n()

  const slogan = ref('')
  const hackathonName = ref('')
  const hackathonDescription = ref('')

  onMounted(async () => {
    try {
      const response = await settingsService.findOne('1', 'texts')
      if (response && response.value) {
        slogan.value = response.value.slogan || ''
        hackathonName.value = response.value.hackathon_name || ''
        hackathonDescription.value = response.value.hackathon_description || ''

        console.log('Fetched settings:', response.value)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  })

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

  // Snackbar
  const snackbar = ref(false)
  const text = ref(t('common.changesSaved'))
  const timeout = ref(1500)
  const error = ref(false)

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

  const handleSave = async() => {
    if (!validateTexts()) {
      text.value = t('textsSettings.errors.fixErrors')
      error.value = true
      snackbar.value = true
      return
    }

    const payload : UpdateSettingDTO = {
      key: 'texts',
      value: {
        slogan: slogan.value,
        hackathon_name: hackathonName.value,
        hackathon_description: hackathonDescription.value,
      },
    }

    try {
      await settingsService.update('1', payload)
      text.value = t('common.changesSaved')
      error.value = false
      snackbar.value = true
    } catch (e) {
      text.value = t('common.error')
      error.value = true
      snackbar.value = true
    }
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
