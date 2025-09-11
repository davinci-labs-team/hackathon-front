<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { settingsService } from '@/services/settingsService'
  import type { LegalText, Section } from '@/types/legal_texts'
  import AppSnackbar from '@/components/common/AppSnackbar.vue'

  const { t, locale } = useI18n()
  const documentType = ref<'privacy' | 'terms'>('privacy')

  // Snackbar
  const snackbar = ref(false)
  const text = ref('')
  const timeout = ref(1500)
  const error = ref(false)

  // Stocke les sections chargées depuis la BDD
  const sections = ref<Section[]>([])

  const loaded = ref(false)

  // Charger depuis le backend
  const legalData = ref<LegalText>({ privacy: [], terms: [] })

  onMounted(async () => {
    try {
      const response = await settingsService.findWithKey('1', 'legal')
      if (response && response.value) {
        legalData.value = response.value as LegalText
        sections.value = legalData.value[documentType.value] 
        loaded.value = true
      }
    } catch (e) {
      console.error('Error fetching legal documents:', e)
    }
  })

  // Ajouter une section dynamique
  const addSection = () => {
    const newSection: Section = {
      id: `custom_${Date.now()}`,
      title: { en: 'New section', fr: 'Nouvelle section' },
      content: { en: '', fr: '' },
      isDefault: false,
    }
    sections.value.push(newSection)
  }

  // Supprimer uniquement les sections ajoutées dynamiquement
  const removeSection = (id: string) => {
  sections.value = sections.value.filter(
    (s) => s.isDefault || s.id !== id
  )
}

  // Export JSON prêt à envoyer au backend
  const exportJSON = async () => {
    const data: LegalText = {
      privacy:
        documentType.value === 'privacy'
          ? sections.value.map(({ id, title, content, isDefault }) => ({ id, title, content, isDefault }))
          : legalData.value.privacy,
      terms:
        documentType.value === 'terms'
          ? sections.value.map(({ id, title, content, isDefault}) => ({ id, title, content, isDefault}))
          : legalData.value.terms,
    }

    console.log('Exported Legal Text JSON:', JSON.stringify(data, null, 2))

    try {
      await settingsService.update('1', { key: 'legal', value: data })
      text.value = t('common.changesSaved')
      error.value = false
      snackbar.value = true
    } catch (e) {
      console.error('Error saving legal documents:', e)
      text.value = t('common.error')
      error.value = true
      snackbar.value = true
    }
  }

  const activeLocale = computed<'en' | 'fr'>(() => locale.value as 'en' | 'fr')

  watch(documentType, (newType) => {
    if (loaded.value) {
      sections.value = legalData.value[newType]
    }
  })
</script>

<template>
  <v-container class="py-10 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-2">{{ t('legalEditor.title') }}</h1>
    <p class="mb-10 text-lg text-gray-600">{{ t('legalEditor.subtitle') }}</p>
    
    <!-- Type of document toggle -->
    <div class="mb-6">
      <label class="mr-4 font-semibold">{{ t('legalEditor.documentType') }}</label>
      <select v-model="documentType" class="border px-3 py-2 rounded-lg">
        <option value="privacy">{{ t('legalEditor.privacyPolicy') }}</option>
        <option value="terms">{{ t('legalEditor.termsConditions') }}</option>
      </select>
    </div>
    
    <!-- List of sections -->
    <div v-for="section in sections" :key="section.id" class="mb-6 p-4 border rounded-lg shadow-sm">
      <div class="flex items-center justify-between mb-2">
        <input
          v-model="section.title[activeLocale]"
          class="border-b border-gray-400 font-semibold text-lg w-full mr-2 bg-transparent focus:outline-none"
        />
        <button
          v-if="!section.isDefault"
          class="text-red-600 text-sm hover:underline"
          @click="removeSection(section.id)"
        >
          {{ t('legalEditor.delete') }}
        </button>
      </div>
      <textarea
        v-model="section.content[activeLocale]"
        class="w-full border p-2 rounded-lg text-sm focus:outline-none focus:ring"
        rows="4"
      ></textarea>
    </div>
    
    <!-- Buttons -->
    <div class="flex gap-4 mt-6">
      <button class="px-4 py-2 bg-blue-600 text-white rounded-lg" @click="addSection">
        {{ t('legalEditor.addSection') }}
      </button>
      <button class="px-4 py-2 bg-green-600 text-white rounded-lg" @click="exportJSON">
        {{ t('legalEditor.save') }}
      </button>
    </div>

    <AppSnackbar v-model="snackbar" :message="text" :timeout="timeout" :error="error" />

  </v-container>
</template>

<style scoped>
  textarea {
    resize: vertical;
  }
</style>
