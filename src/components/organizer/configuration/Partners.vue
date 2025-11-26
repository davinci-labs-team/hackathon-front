<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { CreatePartnersDTO, PartnersDTO, PartnersSettingsDTO, UpdateConfigurationDTO, UpdatePartnersDTO } from '@/types/config'
  import { useI18n } from 'vue-i18n'
  import PartnerCard from '../partners/PartnerCard.vue'
  import { configurationService, getOrCreateConfiguration } from '@/services/configurationService'
  import { v4 as uuidv4 } from 'uuid'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'
  import PartnerForm from '../partners/PartnerForm.vue'
  import { S3BucketService } from '@/services/s3BucketService'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

  const { t } = useI18n()

  const partners = ref<PartnersDTO[]>([])
  const showForm = ref(false) // une seule popup pour create/update
  const selectedPartner = ref<PartnersDTO | null>(null)
  const editMode = ref(false)
  const partnerToDelete = ref<PartnersDTO | null>(null)
  const showConfirmDialog = ref(false)

  const fetchPartners = async () => {
    try {
      const response = await getOrCreateConfiguration(ConfigurationKey.PARTNERS)
      if (response && response.value && Array.isArray(response.value.partners)) {
        partners.value = response.value.partners as PartnersDTO[]
      } else {
        partners.value = []
      }
    } catch (error) {
      console.error('Error fetching partners:', error)
      partners.value = []
    }
  }

  onMounted(async () => {
    await fetchPartners()
  })

  const savePartners = async () => {
    const updateDto: UpdateConfigurationDTO = {
      value: { partners: partners.value } as PartnersSettingsDTO, // on enveloppe ici
    }

    try {
      await configurationService.update(ConfigurationKey.PARTNERS, updateDto)
    } catch (error) {
      console.error('Error updating partners:', error)
    }
  }

  const handleSave = async (data: CreatePartnersDTO | UpdatePartnersDTO) => {
    if (editMode.value && selectedPartner.value) {
      // update
      const newPartners = partners.value.map(partner =>
        partner.id === selectedPartner.value?.id ? { ...partner, ...data } : partner
      )
      const updateDto: UpdateConfigurationDTO = {
        value: { partners: newPartners } as PartnersSettingsDTO, // on enveloppe ici
      }
      try {
        await configurationService.update(ConfigurationKey.PARTNERS, updateDto)
        if (selectedPartner.value.logoKey !== data.logoKey)
          await S3BucketService.deleteFile('public_files', selectedPartner.value.logoKey) 
        partners.value = newPartners
      } catch (error) {
        console.error('Error updating partner:', error)
      }
    } else {
      // create
      const newPartners = [...partners.value, { ...data, id: uuidv4() } as PartnersDTO]
      const updateDto: UpdateConfigurationDTO = {
        value: { partners: newPartners } as PartnersSettingsDTO, // on enveloppe ici
      }
      try {
        await configurationService.update(ConfigurationKey.PARTNERS, updateDto)

        partners.value = newPartners
      } catch (error) {
        console.error('Error creating partner:', error)
      }
    }
    // Reset popup
    showForm.value = false
    selectedPartner.value = null
    editMode.value = false
  }

  function onDeletePartner(partner: PartnersDTO) {
    partnerToDelete.value = partner
    showConfirmDialog.value = true
  }

  const confirmDeletePartner = async () => {
    if (!partnerToDelete.value) return
    try {
      await savePartners()
      await S3BucketService.deleteFile('public_files', partnerToDelete.value.logoKey) 
      const index = partners.value.findIndex((p) => p.id === partnerToDelete.value!.id)
      if (index !== -1) {
        partners.value.splice(index, 1)
      }
    } catch (error) {
      console.error('Error deleting parter')
    }
    showConfirmDialog.value = false
    partnerToDelete.value = null
  }

  function onEditPartner(partner: PartnersDTO) {
    selectedPartner.value = partner
    editMode.value = true
    showForm.value = true
  }

  const addPartner = () => {
    selectedPartner.value = null
    editMode.value = false
    showForm.value = true
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
      @edit="onEditPartner"
    />
    
    <PartnerForm
      v-model="showForm"
      :editMode="editMode"
      :partner="selectedPartner"
      @save="handleSave"
    />

    <ConfirmDialog
      v-model="showConfirmDialog"
      :title="t('partnersSettings.confirmTitle')"
      :text="`${t('partnersSettings.confirmText')} : ${partnerToDelete?.name}`"
      :confirmLabel="t('common.delete')"
      :cancelLabel="t('common.cancel')"
      @confirm="confirmDeletePartner"
      @cancel="partnerToDelete = null"
    />
  </v-container>
</template>
