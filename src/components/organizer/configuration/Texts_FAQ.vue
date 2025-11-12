<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AppSnackbar from '@/components/common/AppSnackbar.vue'
import FAQForm from '@/components/organizer/faq/FAQForm.vue'
import FAQItemCard from '@/components/organizer/faq/FAQItemCard.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useFaq } from '@/composables/useFaq'
import { configurationService, getOrCreateConfiguration } from '@/services/configurationService'
import { HackathonTextDTO, UpdateConfigurationDTO } from '@/types/config'
import { ConfigurationKey } from '@/utils/configuration/configurationKey'
import { FAQItemDTO } from '@/types/faq'

const { t } = useI18n()

// --- Hackathon Texts ---
const hackathonTexts = ref<HackathonTextDTO>({
  hackathonName: '',
  slogan: '',
  hackathonDescription: '',
  location: '',
})

const saveAttempted = ref(false)

onMounted(async () => {
  try {
    const response = await getOrCreateConfiguration(ConfigurationKey.TEXTS)
    if (response && response.value) {
      hackathonTexts.value = response.value
    }
  } catch (error) {
    console.error('Error fetching hackathon texts:', error)
  }
})

// --- FAQ ---
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

// --- Validation & Limits ---
const hackathonNameMaxLength = 60
const sloganMaxLength = 60
const hackathonDescriptionMaxLength = 500

const validateTexts = () => {
  const texts = hackathonTexts.value
  if (!texts.hackathonName || texts.hackathonName.length > hackathonNameMaxLength) return false
  if (texts.slogan && texts.slogan.length > sloganMaxLength) return false
  if (!texts.hackathonDescription || texts.hackathonDescription.length > hackathonDescriptionMaxLength)
    return false
  return true
}

// --- Snackbar ---
const snackbar = ref(false)
const snackbarText = ref(t('common.changesSaved'))
const snackbarTimeout = ref(1500)
const snackbarError = ref(false)

const handleSaveTexts = async () => {
  saveAttempted.value = true

  if (!validateTexts()) {
    snackbarText.value = t('textsSettings.errors.fixErrors')
    snackbarError.value = true
    snackbar.value = true
    return
  }

  const updateDto: UpdateConfigurationDTO = {
    value: {
      hackathonName: hackathonTexts.value.hackathonName,
      slogan: hackathonTexts.value.slogan,
      hackathonDescription: hackathonTexts.value.hackathonDescription,
      location: hackathonTexts.value.location,
    },
  }

  try {
    await configurationService.update(ConfigurationKey.TEXTS, updateDto)
    snackbarText.value = t('common.changesSaved')
    snackbarError.value = false
    snackbar.value = true
  } catch (e) {
    snackbarText.value = t('common.error')
    snackbarError.value = true
    snackbar.value = true
  }
}
</script>

<template>
  <v-container class="py-10 max-w-7xl mx-auto">
    <!-- Hackathon Texts -->
    <h1 class="text-3xl font-bold mb-2">{{ t('textsSettings.title') }}</h1>
    <div class="flex flex-row mb-5 items-center justify-between">
      <p class="mb-0 text-lg text-gray-600">{{ t('textsSettings.subtitle') }}</p>
      <v-btn color="primary" @click="handleSaveTexts">{{ t('common.saveChanges') }}</v-btn>
    </div>

    <v-container>
      <!-- Hackathon Name -->
      <p class="mb-2 text-lg font-medium">
        {{ t('textsSettings.hackathonName') }} <span class="text-red-500">*</span>
      </p>
      <v-text-field
        v-model="hackathonTexts.hackathonName"
        :counter="hackathonNameMaxLength"
        variant="outlined"
        class="mb-0"
      />
      <p class="text-red-500 italic mb-5" v-if="!hackathonTexts.hackathonName && saveAttempted">
        {{ t('textsSettings.errors.requiredField') }}
      </p>
      <p class="text-red-500 italic mb-5" v-if="hackathonTexts.hackathonName.length > hackathonNameMaxLength">
        {{ t('textsSettings.errors.maxLength', { max: hackathonNameMaxLength }) }}
      </p>

      <!-- Slogan -->
      <p class="mb-2 text-lg font-medium">{{ t('textsSettings.slogan') }}</p>
      <v-text-field
        v-model="hackathonTexts.slogan"
        :counter="sloganMaxLength"
        variant="outlined"
        dense
        class="mb-2"
      />
      <p class="text-red-500 italic mb-5" v-if="hackathonTexts.slogan && hackathonTexts.slogan.length > sloganMaxLength">
        {{ t('textsSettings.errors.maxLength', { max: sloganMaxLength }) }}
      </p>

      <!-- Hackathon Description -->
      <p class="mb-2 text-lg font-medium">
        {{ t('textsSettings.hackathonDescription') }} <span class="text-red-500">*</span>
      </p>
      <v-textarea
        v-model="hackathonTexts.hackathonDescription"
        :counter="hackathonDescriptionMaxLength"
        variant="outlined"
        auto-grow
        rows="3"
        class="mb-0"
      />
      <p class="text-red-500 italic mb-5" v-if="!hackathonTexts.hackathonDescription && saveAttempted">
        {{ t('textsSettings.errors.requiredField') }}
      </p>
      <p class="text-red-500 italic mb-5" v-if="hackathonTexts.hackathonDescription.length > hackathonDescriptionMaxLength">
        {{ t('textsSettings.errors.maxLength', { max: hackathonDescriptionMaxLength }) }}
      </p>

      <AppSnackbar
        v-model="snackbar"
        :message="snackbarText"
        :timeout="snackbarTimeout"
        :error="snackbarError"
      />
    </v-container>

    <!-- FAQ Section -->
    <h1 class="text-3xl font-bold mb-2">{{ t('faqSettings.title') }}</h1>
    <div class="flex flex-row mb-5 items-center justify-between">
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
      @click="(item: FAQItemDTO) => { editFAQItem = item; showFAQForm = true }"
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
