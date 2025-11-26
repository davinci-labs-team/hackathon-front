<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FAQForm from '@/components/organizer/faq/FAQForm.vue'
import FAQItemCard from '@/components/organizer/faq/FAQItemCard.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useFaq } from '@/composables/useFaq'
import { FAQItemDTO } from '@/types/faq'

const { t } = useI18n()

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
</script>

<template>
  <v-container>
    <v-row justify="center" class="mt-8">
      <div class="w-full md:w-8/12 lg:w-9/12 px-4">
        <h1 class="text-3xl font-bold mb-6">{{ t('faqSettings.title') }}</h1>
        <div class="flex flex-row mb-5 items-center justify-between">
          <p class="mb-0 text-lg text-gray-600">{{ t('faqSettings.subtitle') }}</p>
          <v-btn color="primary" @click="() => { editFAQItem = null; showFAQForm = true }">
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
      </div>
    </v-row>
  </v-container>
</template>
