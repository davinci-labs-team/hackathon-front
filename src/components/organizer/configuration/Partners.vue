<script setup lang="ts">
  import { ref, watch } from 'vue'
  import {
    CreatePartnersDTO,
    PartnersDTO,
    PartnersSettingsDTO,
    UpdateConfigurationDTO,
    UpdatePartnersDTO,
  } from '@/types/config'
  import { useI18n } from 'vue-i18n'
  import PartnerCard from '../partners/PartnerCard.vue'
  import { v4 as uuidv4 } from 'uuid'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'
  import PartnerForm from '../partners/PartnerForm.vue'
  import { S3BucketService } from '@/services/s3BucketService'
  import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
  import { useConfiguration } from '@/composables/useConfiguration'

  const { t } = useI18n()

  const {
    configuration: partnersConfig,
    error: partnersError,
    updateConfiguration: updatePartnersConfig,
  } = useConfiguration(ConfigurationKey.PARTNERS)

  const partners = ref<PartnersDTO[]>([])

  const showForm = ref(false)
  const selectedPartner = ref<PartnersDTO | null>(null)
  const editMode = ref(false)
  const partnerToDelete = ref<PartnersDTO | null>(null)
  const showConfirmDialog = ref(false)

  const isSaving = ref(false)

  watch(
    partnersConfig,
    (newConfig) => {
      if (newConfig?.value && Array.isArray(newConfig.value.partners)) {
        partners.value = newConfig.value.partners as PartnersDTO[]
      } else {
        partners.value = []
      }

      if (partnersError.value) {
        console.error('Error fetching partners from hook:', partnersError.value)
      }
    },
    { immediate: true }
  )

  const savePartnersList = async (updatedPartners: PartnersDTO[]) => {
    isSaving.value = true
    try {
      const updateDto: UpdateConfigurationDTO = {
        value: { partners: updatedPartners } as PartnersSettingsDTO,
      }
      await updatePartnersConfig(updateDto)

      partners.value = updatedPartners
    } catch (error) {
      console.error('Error updating partners:', error)
      throw error
    } finally {
      isSaving.value = false
    }
  }

  const handleSave = async (data: CreatePartnersDTO | UpdatePartnersDTO) => {
    if (isSaving.value) return

    if (editMode.value && selectedPartner.value) {
      const newPartners = partners.value.map((partner) =>
        partner.id === selectedPartner.value?.id ? { ...partner, ...data } : partner
      )

      try {
        await savePartnersList(newPartners)

        if (selectedPartner.value.logoKey !== data.logoKey) {
          await S3BucketService.deleteFile('public_files', selectedPartner.value.logoKey)
        }
      } catch (error) {
        console.error('Error updating partner:', error)
      }
    } else {
      const newPartners = [...partners.value, { ...data, id: uuidv4() } as PartnersDTO]

      try {
        await savePartnersList(newPartners)
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
    if (!partnerToDelete.value || isSaving.value) return

    const partnerId = partnerToDelete.value.id
    const logoKey = partnerToDelete.value.logoKey

    const partnersAfterDeletion = partners.value.filter((p) => p.id !== partnerId)

    try {
      await savePartnersList(partnersAfterDeletion)
      await S3BucketService.deleteFile('public_files', logoKey)
    } catch (error) {
      console.error('Error deleting partner:', error)
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
