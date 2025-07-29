<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

type LegalSection = {
  id: number
  title: string
  content: string
  isDefault: boolean
}

const { t, getLocaleMessage , locale } = useI18n()

function generateSectionsFromLocale(type: 'privacy' | 'terms'): LegalSection[] {
  // Récupérer les messages complets de la locale active
  const messages = getLocaleMessage(locale.value) as any
  if (!messages.legalEditor?.sections?.[type]) {
    return []
  }

  const rawSections = messages.legalEditor.sections[type]

  if (!Array.isArray(rawSections)) return []

  return rawSections.map((section: { title: string; content: string }, i: number) => ({
    id: i + 1,
    title: section.title,
    content: section.content,
    isDefault: true,
  }))
}

const documentType = ref<'privacy' | 'terms'>('privacy')
const sections = ref<LegalSection[]>(generateSectionsFromLocale(documentType.value))
let nextId = sections.value.length + 1

watch(documentType, (newType) => {
  sections.value = generateSectionsFromLocale(newType)
  nextId = sections.value.length + 1
})

const addSection = () => {
  sections.value.push({
    id: nextId++,
    title: t('legalEditor.newSection'),
    content: '',
    isDefault: false,
  })
}

const removeSection = (id: number) => {
  sections.value = sections.value.filter(section => section.id !== id)
}

const exportJSON = () => {
  const data = {
    type: documentType.value,
    sections: sections.value.map(s => ({ title: s.title, content: s.content })),
  }
  console.log(data)
  alert(t('legalEditor.alertExport') || 'JSON généré dans la console.')
}
</script>

<template>
  <v-container class="py-10 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">{{ t('legalEditor.title') }}</h1>

    <!-- Choix type de document -->
    <div class="mb-6">
      <label class="mr-4 font-semibold">{{ t('legalEditor.documentType') }}</label>
      <select v-model="documentType" class="border px-3 py-2 rounded-lg">
        <option value="privacy">{{ t('legalEditor.privacyPolicy') }}</option>
        <option value="terms">{{ t('legalEditor.termsConditions') }}</option>
      </select>
    </div>

    <!-- Liste des sections -->
    <div v-for="section in sections" :key="section.id" class="mb-6 p-4 border rounded-lg shadow-sm">
      <div class="flex items-center justify-between mb-2">
        <input
          v-model="section.title"
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
        v-model="section.content"
        class="w-full border p-2 rounded-lg text-sm focus:outline-none focus:ring"
        rows="4"
      ></textarea>
    </div>

    <!-- Boutons -->
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
