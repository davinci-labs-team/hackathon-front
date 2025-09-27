<script setup lang="ts">
  import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { PartnersDTO } from '@/types/config'

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

  const logoFile = ref<File | null>(null)

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation()
    emit('delete', props.partner)
  }

  const handleSave = async () => {
    editMode.value = false

    if (logoFile.value) {
      const uploadedId = await uploadLogo(logoFile.value)
      editablePartner.value.logoId = uploadedId
    }

    emit('update', editablePartner.value)
  }

  async function uploadLogo(file: File): Promise<string> {
    return URL.createObjectURL(file)
  }

  const handleCardClick = () => {
    if (!editMode.value) {
      editMode.value = true
    }
  }

  // Wrapper ref pour click outside
  const wrapperRef = ref<HTMLElement | null>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (editMode.value && wrapperRef.value && !wrapperRef.value.contains(event.target as Node)) {
      editMode.value = false
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })
</script>

<template>
  <div ref="wrapperRef">
    <v-card
      class="partner-card p-4 flex flex-col md:flex-row gap-4 md:items-center"
      :class="{ 'cursor-pointer': !editMode }"
      @click="!editMode && handleCardClick()"
    >
      <!-- Logo -->
      <div class="flex-shrink-0">
        <v-file-input
          v-if="editMode"
          v-model="logoFile"
          :placeholder="t('partnersSettings.logo')"
          accept="image/*"
          variant="outlined"
          dense
          class="mt-5"
          @click.stop
          @keydown.stop
        />
        <img
          v-else
          :src="editablePartner.logoId"
          :alt="t('partnersSettings.logo', { name: editablePartner.name })"
          class="h-20 w-20 object-contain"
        />
      </div>

      <!-- Infos -->
      <div class="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full">
        <!-- Nom -->
        <v-text-field
          v-if="editMode"
          v-model="editablePartner.name"
          :placeholder="t('partnersSettings.namePlaceholder')"
          variant="outlined"
          dense
          class="flex-1 mt-5"
          @click.stop
          @keydown.stop
        />
        <h3 v-else class="font-bold text-lg flex-1">{{ editablePartner.name }}</h3>

        <!-- Website -->
        <v-text-field
          v-if="editMode"
          v-model="editablePartner.websiteUrl"
          :placeholder="t('partnersSettings.websitePlaceholder')"
          variant="outlined"
          dense
          class="flex-1 mt-5"
          @click.stop
          @keydown.stop
        />
        <p v-else class="text-gray-700 flex-1">{{ editablePartner.websiteUrl }}</p>

        <!-- Participation -->
        <v-checkbox
          v-if="editMode"
          v-model="editablePartner.isParticipatingSchool"
          :label="t('partnersSettings.participatingSchool')"
          class="mt-5"
          @click.stop
        />
        <p v-else class="text-gray-700">
          {{
            editablePartner.isParticipatingSchool ? t('partnersSettings.participatingSchool') : ''
          }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 items-center">
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
