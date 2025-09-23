<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { configurationService, getOrCreateConfiguration } from '@/services/configurationService'
  import type { LegalText, Section } from '@/types/legal_texts'
  import AppSnackbar from '@/components/common/AppSnackbar.vue'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'

  const { t, locale } = useI18n()
  const documentType = ref<'privacy' | 'terms'>('privacy')

  // Snackbar
  const snackbar = ref(false)
  const text = ref('')
  const timeout = ref(1500)
  const error = ref(false)

  const sections = ref<Section[]>([])
  const loaded = ref(false)

  const legalData = ref<LegalText>({ privacy: [], terms: [] })

  onMounted(async () => {
    try {
      const response = await getOrCreateConfiguration(ConfigurationKey.LEGAL)
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
    sections.value = sections.value.filter((s) => s.isDefault || s.id !== id)
  }

  const exportJSON = (): LegalText => {
    return {
      privacy:
        documentType.value === 'privacy'
          ? sections.value.map(({ id, title, content, isDefault }) => ({
              id,
              title,
              content,
              isDefault,
            }))
          : legalData.value.privacy,
      terms:
        documentType.value === 'terms'
          ? sections.value.map(({ id, title, content, isDefault }) => ({
              id,
              title,
              content,
              isDefault,
            }))
          : legalData.value.terms,
    }
  }

  const save = async () => {
    // Vérification que toutes les sections ont du contenu
    const emptySection = sections.value.find((s) => !s.content[activeLocale.value]?.trim())

    if (emptySection) {
      text.value = t('legal.errorEmptyContent')
      error.value = true
      snackbar.value = true
      return
    }

    const data = exportJSON()
    console.log('Exported Legal Text JSON:', JSON.stringify(data, null, 2))

    try {
      await configurationService.update(ConfigurationKey.LEGAL, { value: data })
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
    <h1 class="text-3xl font-bold mb-2">{{ t('legal.title') }}</h1>
    <p class="mb-10 text-lg text-gray-600">{{ t('legal.subtitle') }}</p>

    <!-- Type of document toggle -->
    <div class="mb-6">
      <label class="mr-4 font-semibold">{{ t('legal.documentType') }}</label>
      <select v-model="documentType" class="border px-3 py-2 rounded-lg">
        <option value="privacy">{{ t('legal.privacyPolicy') }}</option>
        <option value="terms">{{ t('legal.termsConditions') }}</option>
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
          {{ t('legal.delete') }}
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
        {{ t('legal.addSection') }}
      </button>
      <button class="px-4 py-2 bg-green-600 text-white rounded-lg" @click="save">
        {{ t('legal.save') }}
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
