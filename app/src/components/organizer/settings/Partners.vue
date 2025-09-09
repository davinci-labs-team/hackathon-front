<script setup lang="ts">
  import { PartnersDTO } from '@/types/hackathon';
import { useI18n } from 'vue-i18n'
import PartnerCard from '../partners/PartnerCard.vue';
  const { t } = useI18n()

  const partners: PartnersDTO[] = [
    // Example partner data
    {
      name: 'Tech Corp',
      websiteUrl: 'https://techcorp.com',
      logoId: 'https://via.placeholder.com/150',
      isParticipatingSchool: false,
    },
    {
      name: 'Innovate Inc',
      websiteUrl: 'https://innovateinc.com',
      logoId: 'https://via.placeholder.com/150',
      isParticipatingSchool: true,
    },
  ];

  // TODO: fetch all images from backend to display logos
  const addPartner = () => {}

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
    />
  </v-container>
</template>
