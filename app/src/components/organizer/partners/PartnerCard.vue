<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { PartnersDTO } from '@/types/hackathon'

  const { t } = useI18n()
  const props = defineProps<{
    partner: PartnersDTO
  }>()

  const emit = defineEmits<{
    (e: 'delete', partner: PartnersDTO): void
    (e: 'update', partner: PartnersDTO): void
  }>()

  const editMode = ref(false)
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

  const handleSave = () => {
    editMode.value = false
    emit('update', editablePartner.value)
  }
</script>

<template>
  <v-card
    class="partner-card flex-1 mb-4 p-4 flex flex-col md:flex-row gap-4 cursor-pointer"
    @click="editMode = true"
  >
    <div class="flex items-center gap-4 w-full">
      <!-- Logo -->
      <v-text-field
        v-if="editMode"
        v-model="editablePartner.logoId"
        class="w-32"
        dense
        @click.stop
      />
      <img
        v-else
        :src="editablePartner.logoId"
        alt="Partner Logo"
        class="h-16 w-16 object-contain"
      />

      <!-- Infos -->
      <div class="flex-1 flex flex-col md:flex-row gap-4 items-start md:items-center w-full">
        <v-text-field
          v-if="editMode"
          v-model="editablePartner.name"
          :placeholder="t('partnersSettings.namePlaceholder')"
          class="flex-1"
          dense
          @click.stop
        />
        <h3 v-else class="text-lg font-bold">{{ editablePartner.name }}</h3>

        <v-text-field
          v-if="editMode"
          v-model="editablePartner.websiteUrl"
          :placeholder="t('partnersSettings.websitePlaceholder')"
          class="flex-1"
          dense
          @click.stop
        />
        <p v-else class="mt-1 text-gray-700">{{ editablePartner.websiteUrl }}</p>

        <!-- Checkbox -->
        <v-checkbox
          v-if="editMode"
          v-model="editablePartner.isParticipatingSchool"
          :label="t('partnersSettings.participatingSchool')"
          class="ml-4"
          @click.stop
        />
        <p v-else class="ml-4 text-gray-700">
          {{ editablePartner.isParticipatingSchool ? t('partnersSettings.participatingSchool'): '' }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 ml-auto">
        <v-btn v-if="editMode" color="primary" size="small" @click.stop="handleSave">
            {{ t('common.save') }}
        </v-btn>

        <v-btn
          icon="mdi-delete"
          color="red"
          variant="text"
          size="small"
          @click.stop="handleDelete"
        />
      </div>
    </div>
  </v-card>
</template>

<style scoped>
  .partner-card:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
  }
</style>
