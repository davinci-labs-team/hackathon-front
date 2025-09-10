<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import legalDocuments from '@/tests/data/legal'
  import { Section, LegalText, Translation } from '@/types/legal_texts'

  interface LegalSection extends Section {
    isDefault: boolean
  }

  const { t, locale } = useI18n()

  const documentType = ref<'privacy' | 'terms'>('privacy')

  // Générer les sections à partir du legalDocuments pour la langue active
  function generateSections(type: 'privacy' | 'terms'): LegalSection[] {
    const rawSections: Section[] = legalDocuments[type] || []
    return rawSections.map((section) => ({
      ...section,
      isDefault: true,
    }))
  }

  const sections = ref<LegalSection[]>(generateSections(documentType.value))

  let nextId = sections.value.length + 1

  watch(documentType, (newType) => {
    sections.value = generateSections(newType)
    nextId = sections.value.length + 1
  })

  // Ajouter une section dynamique
  const addSection = () => {
    const newSection: LegalSection = {
      id: `custom_${Date.now()}`,
      title: { en: 'New section', fr: 'Nouvelle section' },
      content: { en: '', fr: '' },
      isDefault: false,
    }
    sections.value.push(newSection)
  }

  // Supprimer uniquement les sections ajoutées dynamiquement
  const removeSection = (id: string) => {
    sections.value = sections.value.filter((s) => !s.isDefault && s.id !== id)
  }

  // Export JSON prêt à envoyer au backend
  const exportJSON = () => {
    const data: LegalText = {
      privacy:
        documentType.value === 'privacy'
          ? sections.value.map(({ id, title, content }) => ({ id, title, content }))
          : legalDocuments.privacy,
      terms:
        documentType.value === 'terms'
          ? sections.value.map(({ id, title, content }) => ({ id, title, content }))
          : legalDocuments.terms,
    }

    console.log('Exported Legal Text JSON:', JSON.stringify(data, null, 2))
  }

  // Langue active pour l’affichage
  const activeLocale = computed<'en' | 'fr'>(() => locale.value as 'en' | 'fr')
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
  </v-container>
</template>

<style scoped>
  textarea {
    resize: vertical;
  }
</style>
