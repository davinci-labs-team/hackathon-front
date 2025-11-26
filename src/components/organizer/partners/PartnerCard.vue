<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { PartnersDTO } from '@/types/config'

  const { t } = useI18n()
  const props = defineProps<{
    partner: PartnersDTO
  }>()

  const emit = defineEmits<{
    (e: 'delete', partner: PartnersDTO): void
    (e: 'edit', partner: PartnersDTO): void
  }>()

  const editablePartner = ref<PartnersDTO>({ ...props.partner })

  watch(
    () => props.partner,
    (newPartner) => {
      editablePartner.value = { ...newPartner }
    }
  )

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation()
    emit('delete', props.partner)
  }

  const handleEdit = (e: MouseEvent) => {
    e.stopPropagation()
    emit('edit', props.partner)
  }

  // Wrapper ref pour click outside
  const wrapperRef = ref<HTMLElement | null>(null)
</script>

<template>
  <div ref="wrapperRef">
    <v-card
      class="partner-card p-4 flex flex-col md:flex-row gap-4 md:items-center"
    >
      <!-- Logo -->
      <div class="flex-shrink-0">
        <img
          :src="editablePartner.logoId"
          :alt="t('partnersSettings.logo', { name: editablePartner.name })"
          class="h-20 w-20 object-contain"
        />
      </div>

      <!-- Infos -->
      <div class="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full">
        <!-- Nom -->
        <h3 class="font-bold text-lg flex-1">{{ editablePartner.name }}</h3>

        <!-- Website -->
        <p class="text-gray-700 flex-1">{{ editablePartner.websiteUrl }}</p>

        <!-- Participation -->
        <p class="text-gray-700">
          {{
            editablePartner.isParticipatingSchool ? t('partnersSettings.participatingSchool') : ''
          }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex gap-1">
        <!-- Edit button -->
        <v-btn
          icon="mdi-pencil"
          color="primary"
          variant="text"
          size="small"
          :title="t('common.edit')"
          @click.stop="handleEdit"
        />
        <!-- Delete button -->
        <v-btn
          icon="mdi-delete"
          color="red"
          variant="text"
          size="small"
          @click.stop="handleDelete"
        />
      </div>
    </v-card>
    
  </div>
</template>

<style scoped>
  .partner-card {
    transition: box-shadow 0.2s;
  }
  .partner-card:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
  }

  img {
    border-radius: 4px;
  }
</style>
