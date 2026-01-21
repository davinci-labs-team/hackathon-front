<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { ref, onMounted } from 'vue'
  import { formatDate, getDaysBetween } from '@/utils/dateUtils'
  import { HackathonTextDTO } from '@/types/config'
  import { configurationService } from '@/services/configurationService'
  import { PublicConfigurationKey } from '@/utils/configuration/configurationKey'

  const infos = ref<HackathonTextDTO>({
    hackathonName: '',
    slogan: '',
    hackathonDescription: '',
    location: '',
    startDate: '',
    endDate: ''
  })

  const startDate = ref('')
  const endDate = ref('')
  const numberOfDays = ref(0)

  const { t, locale } = useI18n()

  onMounted(async () => {
  try {
    const textsResponse = await configurationService.findOnePublic(PublicConfigurationKey.TEXTS)
    infos.value = textsResponse.value as HackathonTextDTO

    startDate.value = infos.value.startDate || ''
    endDate.value = infos.value.endDate || ''
    numberOfDays.value = getDaysBetween(startDate.value, endDate.value) || 0
    
  } catch (error) {
    console.error('Error fetching partners:', error)
  }
})
</script>

<template>
  <div class="flex flex-col h-full">
    <h1 class="text-5xl font-bold">{{ infos.hackathonName}}</h1>
    <p class="text-2xl italic text-gray-600 mb-8">
      {{ infos.slogan }}
    </p>
    <p class="mb-6 text-xl text-gray-700 mb-8">
      {{ infos.hackathonDescription }}
    </p>

    <div class="flex gap-6 items-center">
      <div class="flex-1 space-y-4">
        <div class="flex items-center gap-4 mb-10">
          <v-icon size="55">mdi-calendar</v-icon>
          <div>
            <div class="text-2xl font-semibold">{{ t('hackathon.dateText', numberOfDays) }}</div>
            <div class="text-xl text-gray-600">
              {{ formatDate(startDate, locale) }} - {{ formatDate(endDate, locale) }}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <v-icon size="55">mdi-map-marker</v-icon>
          <div>
            <div class="text-2xl font-semibold">{{ t('hackathon.locationText') }}</div>
            <div class="text-xl text-gray-600">{{ infos.location }}</div>
          </div>
        </div>
      </div>

      <v-card class="flex-[0.5] p-4 self-start" outlined shaped>
        <v-card-title
          class="bg-primary text-white rounded-t px-4 py-2"
          style="font-size: 1.5rem; font-weight: 600"
        >
          {{ t('hackathon.inscriptionTitle') }}
        </v-card-title>

        <v-card-text class="px-4 py-4">
          {{ t('hackathon.inscriptionMessage') }}
        </v-card-text>

        <v-card-actions class="px-4 pb-4 justify-center">
          <router-link to="/first-login">
            <v-btn color="primary" variant="flat" class="text-white px-6 py-2" rounded>
              {{ t('hackathon.firstLoginBtn') }}
            </v-btn>
          </router-link>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>
