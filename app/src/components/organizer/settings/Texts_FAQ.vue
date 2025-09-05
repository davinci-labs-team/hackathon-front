<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import AppSnackbar from '@/components/common/AppSnackbar.vue'
  import { FAQItemDTO } from '@/types/faq'
  import FAQForm from '@/components/organizer/faq/FAQForm.vue'
  const { t } = useI18n()

  // TODO: Fetch infos from backend

  const sloganMaxLength = 60
  const hackathonNameMaxLength = 60
  const hackathonDescriptionMaxLength = 500

  const slogan = ref('Build the future with us!')
  const hackathonName = ref('Qubit or not Qubit')
  const hackathonDescription = ref('')

  // Snackbar to inform user of successful save
  const snackbar = ref(false)
  const text = ref(t('common.changesSaved'))
  const timeout = ref(1500)

  // TODO: Save changes to backend if needed
  const handleSave = () => {
    // Implement save logic here
    // Compare with original values to detect changes
    // if (changesDetected) {
    //   // Save to backend
    // }
    // Snackbar to inform user of successful save
    snackbar.value = true
    console.log('Saving changes...')
  }

  const faqs = ref<FAQItemDTO[]>([])

  // State of the FAQ form dialog
  const showFAQForm = ref(false)
  const editFAQItem = ref<FAQItemDTO | null>(null)
</script>

<template>
  <v-container class="py-10 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-2">{{ t('textsSettings.title') }}</h1>
    <div class="flex-direction-row mb-5 flex items-center justify-between">
      <p class="mb-0 text-lg text-gray-600">{{ t('textsSettings.subtitle') }}</p>
      <v-btn color="primary" @click="handleSave">{{ t('common.saveChanges') }}</v-btn>
    </div>

    <v-container>
      <p class="mb-2 text-lg text-600">{{ t('textsSettings.hackathonName') }}</p>
      <v-text-field
        v-model="hackathonName"
        :counter="hackathonNameMaxLength"
        :rules="[
          (v: string) =>
            (v && v.length <= hackathonNameMaxLength) ||
            t('textsSettings.errors.maxLength', { max: hackathonNameMaxLength }),
        ]"
        variant="outlined"
        dense
        class="mb-2"
      />

      <p class="mb-2 text-lg text-600">{{ t('textsSettings.slogan') }}</p>
      <v-text-field
        v-model="slogan"
        :counter="sloganMaxLength"
        :rules="[
          (v: string) =>
            (v && v.length <= sloganMaxLength) ||
            t('textsSettings.errors.maxLength', { max: sloganMaxLength }),
        ]"
        variant="outlined"
        dense
        class="mb-2"
      />

      <p class="mb-2 text-lg text-600">{{ t('textsSettings.hackathonDescription') }}</p>
      <v-textarea
        v-model="hackathonDescription"
        :counter="hackathonDescriptionMaxLength"
        :rules="[
          (v: string) =>
            (v && v.length <= hackathonDescriptionMaxLength) ||
            t('textsSettings.errors.maxLength', { max: hackathonDescriptionMaxLength }),
        ]"
        variant="outlined"
        auto-grow
        rows="3"
        class="mb-2"
      />

      <AppSnackbar v-model="snackbar" :message="text" :timeout="timeout" />
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

    <!-- Next will be a component FAQ Item Card -->
    <v-container>
      <div v-for="(faq, index) in faqs" :key="index" class="mb-4 p-4 border rounded">
        <p class="font-bold">{{ faq.question }}</p>
        <p>{{ faq.answer }}</p>
        <v-btn
          text
          small
          color="blue"
          @click="
            () => {
                editFAQItem = faq
                showFAQForm = true
            }
          "
        >
          {{ t('common.edit') }}
        </v-btn>
      </div>
    </v-container>

    <FAQForm
      v-model="showFAQForm"
      :editMode="!!editFAQItem"
      :faqItem="editFAQItem"
      @close="editFAQItem = null"
      @save="
        (faqItem: FAQItemDTO) => {
          if (editFAQItem) {
            // Edit existing FAQ item
            const index = faqs.findIndex((item) => item.id === faqItem.id)
            if (index !== -1) {
              faqs[index] = faqItem
            }
          } else {
            // Add new FAQ item
            faqs.push(faqItem)
          }
          editFAQItem = null
        }
      "
    />
  </v-container>
</template>
