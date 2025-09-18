<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { settingsService } from '@/services/settingsService'
  import { Section } from '@/types/legal_texts'
  import { ref, onMounted, computed } from 'vue'

  const { t, locale } = useI18n()

  const terms_and_conditions = ref<Section[] | null>(null)

  const currentLocale = computed<'en' | 'fr'>(() => locale.value as 'en' | 'fr')

  onMounted(async () => {
    try {
      const response = await settingsService.findWithKey('1', 'legal')
      terms_and_conditions.value = response.value.terms
    } catch (error) {
      console.error('Error fetching privacy policy:', error)
    }
  })
</script>

<template>
  <v-container class="py-12 max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">
      {{ t('legal.termsConditions') }}
    </h1>

    <div v-for="section in terms_and_conditions ?? []" :key="section.id" class="mb-6">
      <h2 class="text-xl font-semibold mt-6 mb-2">
        {{ section.title[currentLocale] }}
      </h2>
      <p>
        {{ section.content[currentLocale] }}
      </p>
    </div>
  </v-container>
</template>
