<script setup lang="ts">
  import { ref } from 'vue'
  import { PartnersDTO } from '@/types/hackathon'
  import { useI18n } from 'vue-i18n'
  import PartnerCard from '../partners/PartnerCard.vue'
  const { t } = useI18n()

  /* TODO in this file
    - check if pictures have changed, if yes upload them to backend and get their urls
    - fetch partners from backend instead of using hardcoded data
    - call API to update partners object in backend when deleting or updating a partner
  */

  const partners = ref<PartnersDTO[]>([
    // Example partner data
    {
      name: 'EPITA',
      websiteUrl: 'https://epita.fr',
      logoId: 'https://upload.wikimedia.org/wikipedia/fr/d/d8/Epita.png',
      isParticipatingSchool: false,
    },
    {
      name: 'Université de Tours',
      websiteUrl: 'https://www.univ-tours.fr/',
      logoId:
        'https://upload.wikimedia.org/wikipedia/fr/c/c9/Logo_Universit%C3%A9_Tours_-_2017.svg',
      isParticipatingSchool: true,
    },
  ])

  function onDeletePartner(partner: PartnersDTO) {
    const index = partners.value.findIndex((p) => p === partner)
    if (index !== -1) partners.value.splice(index, 1)

    // TODO: call API to update partners object in backend
  }

  function onUpdatePartner(updatedPartner: PartnersDTO) {
    const index = partners.value.findIndex((p) => p.name === updatedPartner.name)
    if (index !== -1) {
      partners.value[index] = { ...updatedPartner }
    }

    // TODO: call API to update partners object in backend
  }

  // TODO: fetch all images from backend to display logos

  const addPartner = () => {
    partners.value.push({
      name: '',
      websiteUrl: '',
      logoId: '',
      isParticipatingSchool: false,
    })
  }
</script>

<template>
  <v-container class="py-10 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-2">{{ t('partnersSettings.title') }}</h1>
    <div class="flex-direction-row mb-5 flex items-center justify-between">
      <p class="mb-0 text-lg text-gray-600">{{ t('partnersSettings.subtitle') }}</p>
      <v-btn color="primary" @click="addPartner">
        {{ t('partnersSettings.addPartner') }}
      </v-btn>
    </div>

    <div v-if="partners.length === 0" class="text-center text-gray-600 my-10">
      {{ t('partnersSettings.noPartners') }}
    </div>

    <PartnerCard
      v-for="(partner, index) in partners"
      :key="index"
      :partner="partner"
      class="mb-4"
      @delete="onDeletePartner"
      @update="onUpdatePartner"
    />
  </v-container>
</template>
