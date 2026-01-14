<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { ref, watch, computed } from 'vue'
  import { getRole, getTPrefix } from '@/utils/user'
  import { faqService } from '@/services/faqService'
  import type { FAQItemDTO } from '@/types/faq'

  const { t } = useI18n()

  const role = getRole()
  const tPrefix = getTPrefix(role, true)

  const faq = ref<FAQItemDTO[]>([])
  const searchQuery = ref('')

  const filteredFAQ = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()
    if (!query) return faq.value
    return faq.value.filter(
      (a) => a.question.toLowerCase().includes(query) || a.answer.toLowerCase().includes(query)
    )
  })

  const fetchFAQ = async () => {
    try {
      faq.value = await faqService.getAll()
    } catch (error) {
      console.error('Error fetching FAQ:', error)
    }
  }

  watch(() => role, fetchFAQ, { immediate: true })
</script>

<template>
  <v-container>
    <v-row justify="center" class="mt-8">
      <div class="w-full md:w-8/12 lg:w-9/12 px-4">
        <h1 class="text-3xl font-bold mb-6">{{ t(`${tPrefix}.nav.faq`) }}</h1>
        <div class="flex mb-4 gap-4 items-center">
          <v-text-field
            v-model="searchQuery"
            :placeholder="t('common.search')"
            variant="solo"
            hide-details
            density="comfortable"
            clearable
            class="flex-grow"
            @click:clear="searchQuery = ''"
          />
        </div>
      </div>
    </v-row>

    <v-row justify="center" class="mb-12">
      <div class="w-full md:w-8/12 lg:w-9/12 px-4">
        <v-alert v-if="filteredFAQ.length === 0" type="info" variant="tonal" class="mt-4">
          {{ t('faq.noQuestions') }}
        </v-alert>

        <v-expansion-panels variant="accordion" class="mt-4">
          <v-expansion-panel
            v-for="item in filteredFAQ"
            :key="item.id"
            :elevation="1"
            class="mb-2 rounded-lg border"
          >
            <v-expansion-panel-title class="font-weight-bold text-primary">
              {{ item.question }}
            </v-expansion-panel-title>

            <v-expansion-panel-text class="text-grey-darken-3 pt-4">
              <div v-html="item.answer"></div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </v-row>
  </v-container>
</template>
