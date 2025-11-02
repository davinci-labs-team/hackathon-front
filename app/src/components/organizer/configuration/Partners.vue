<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { PartnersDTO, UpdateConfigurationDTO } from '@/types/config'
  import { useI18n } from 'vue-i18n'
  import PartnerCard from '../partners/PartnerCard.vue'
  import { configurationService, getOrCreateConfiguration } from '@/services/configurationService'
  import { v4 as uuidv4 } from 'uuid'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'

  const { t } = useI18n()

  /* TODO in this file
    - check if pictures have changed, if yes upload them to backend and get their urls
  */

  const partners = ref<PartnersDTO[]>([])

  onMounted(async () => {
    try {
      const response = await getOrCreateConfiguration(ConfigurationKey.PARTNERS)
      partners.value = response.value as PartnersDTO[]
    } catch (error) {
      console.error('Error fetching partners:', error)
    }
  })

  const savePartners = async () => {
    const updateDto: UpdateConfigurationDTO = {
      value: partners.value,
    }

    try {
      await configurationService.update(ConfigurationKey.PARTNERS, updateDto)
    } catch (error) {
      console.error('Error updating partners:', error)
    }
  }

  function onDeletePartner(partner: PartnersDTO) {
    const index = partners.value.findIndex((p) => p.id === partner.id)
    if (index !== -1) {
      partners.value.splice(index, 1)
      savePartners()
    }
  }

  function onUpdatePartner(updatedPartner: PartnersDTO) {
    const index = partners.value.findIndex((p) => p.id === updatedPartner.id)
    if (index !== -1) {
      partners.value[index] = { ...updatedPartner }
      savePartners()
    }
  }

  // TODO: fetch all images from backend to display logos

  const addPartner = () => {
    partners.value.push({
      id: uuidv4(),
      name: '',
      websiteUrl: '',
      logoId: '',
      isParticipatingSchool: false,
    })
    savePartners()
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
      :key="partner.id"
      :partner="partner"
      class="mb-4"
      @delete="onDeletePartner"
      @update="onUpdatePartner"
    />
  </v-container>
</template>
