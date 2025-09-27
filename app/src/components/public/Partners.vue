<script setup lang="ts">
  import basicImg from '@/assets/images/basic.jpg'
  import { configurationService } from '@/services/configurationService'
  import { PartnersDTO } from '@/types/config'
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'


  const { t } = useI18n()

  const partners = ref<PartnersDTO[]>([])

  onMounted(async () => {
    try {
      const response = await configurationService.findOne(ConfigurationKey.PARTNERS)
      partners.value = response.value as PartnersDTO[]
    } catch (error) {
      console.error('Error fetching partners:', error)
    }
  })


</script>

<template>
  <div
    class="w-full bg-white border border-gray-300 rounded p-6 flex flex-col items-center gap-6"
    style="height: 100%"
  >
    <h3 class="text-2xl font-medium">{{ t('partners.title') }}</h3>
    <div class="flex flex-wrap justify-center gap-8">
      <img
        v-for="(partner, index) in partners"
        :key="partner.id || index"
        :src="partner.logoId || basicImg"
        :alt="partner.name"
        class="rounded h-32 w-auto object-contain"
      />
    </div>
  </div>
</template>
