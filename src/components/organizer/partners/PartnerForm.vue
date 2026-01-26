<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { S3BucketService } from '@/services/s3BucketService'
  import { CreatePartnersDTO, PartnersDTO, UpdatePartnersDTO } from '@/types/config'

  const { t } = useI18n()

  // -----------------------------
  // Props & Emits
  // -----------------------------
  const props = defineProps<{
    modelValue: boolean
    editMode?: boolean
    partner?: PartnersDTO | null
  }>()

  const emit = defineEmits<{
    (e: 'save', payload: CreatePartnersDTO | UpdatePartnersDTO): void
    (e: 'update:modelValue', value: boolean): void
  }>()

  // -----------------------------
  // Dialog state
  // -----------------------------
  const localModelValue = ref(props.modelValue)
  watch(
    () => props.modelValue,
    (val) => (localModelValue.value = val)
  )
  watch(localModelValue, (val) => emit('update:modelValue', val))

  // -----------------------------
  // Form state
  // -----------------------------
  const name = ref('')
  const websiteUrl = ref('')
  const isParticipatingSchool = ref(false)

  // -----------------------------
  // Logo
  // -----------------------------
  const newLogoFile = ref<File>()
  const logoId = ref('')
  const logoKey = ref('')
  const previewUrl = ref('')
  const fileModel = ref<File | File[] | null>(null)

  watch(fileModel, (files) => {
    onFileInputChange(files)
  })

  // -----------------------------
  // Validation
  // -----------------------------
  const required = (v: string | null | undefined) => !!v || t('common.fieldRequired')
  const logoRequired = () => {
    return !!newLogoFile.value || !!logoId.value || t('common.fieldRequired')
  }
  const validateImage = (file: File) => {
    if (!file) return true

    const MAX_SIZE_MB = 3
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

    if (file.size > MAX_SIZE_BYTES) return t('partnersSettings.max3MB')
    if (!file.type.startsWith('image/')) return t('partnersSettings.onlyImage')

    return true
  }

  // -----------------------------
  // Image helpers
  // -----------------------------
  const getPreviewUrl = (file: File) => URL.createObjectURL(file)
  const removeLogoFile = () => {
    newLogoFile.value = undefined
    fileModel.value = null
  }

  const onFileInputChange = (files: File | File[] | null) => {
    if (!files) return
    const original = Array.isArray(files) ? files[0] : files
    try {
      const safeName = sanitizeFilename(original.name)
      const safeFile = new File([original], safeName, { type: original.type })
      newLogoFile.value = safeFile
    } catch (e) {
      newLogoFile.value = Array.isArray(files) ? files[0] : files
    }
  }

  const sanitizeFilename = (name: string) => {
    const match = name.match(/(\.[^.]*)$/)
    const ext = match ? match[1].toLowerCase() : ''
    const base = match ? name.slice(0, -ext.length) : name
    const normalized = base.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // retire accents
    const cleaned = normalized
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '')
      .replace(/_+/g, '_')
      .toLowerCase()
    return `${cleaned}${ext}`
  }

  watch(
    [newLogoFile, logoId],
    ([file]) => {
      if (file) {
        previewUrl.value = getPreviewUrl(file)
      } else {
        previewUrl.value = logoId.value
      }
    },
    { immediate: true }
  )

  // -----------------------------
  // Form actions
  // -----------------------------
  const resetForm = () => {
    name.value = ''
    websiteUrl.value = ''
    isParticipatingSchool.value = false
    newLogoFile.value = undefined
    logoId.value = ''
    logoKey.value = ''
    previewUrl.value = ''
    fileModel.value = null
  }

  const close = () => {
    localModelValue.value = false
    resetForm()
  }

  // -----------------------------
  // Create & Update logic
  // -----------------------------
  const uploadImage = async (): Promise<{ logoKey: string; logoId: string } | undefined> => {
    if (!newLogoFile.value) return { logoKey: logoKey.value, logoId: logoId.value }

    try {
      const uploadedPath = await S3BucketService.uploadFile(newLogoFile.value, 'public_files')
      const publicUrl = await S3BucketService.getFileUrlPublic('public_files', uploadedPath.path)

      return { logoKey: uploadedPath.path, logoId: publicUrl.url }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert(t('partnersSettings.imageUploadError'))
      return undefined
    }
  }

  // -----------------------------
  // Handle form submit
  // -----------------------------
  const onSubmit = async () => {
    if (!name.value || !websiteUrl.value || (!logoId.value && !newLogoFile.value)) return

    const payload = {
      name: name.value,
      websiteUrl: websiteUrl.value,
      isParticipatingSchool: isParticipatingSchool.value,
      ...(await uploadImage()),
    }

    emit('save', payload)
    close()
  }

  // -----------------------------
  // Initialize form when dialog opens
  // -----------------------------
  watch(
    localModelValue,
    async (open) => {
      if (!open) return
      if (props.editMode && props.partner) {
        name.value = props.partner.name
        websiteUrl.value = props.partner.websiteUrl
        isParticipatingSchool.value = props.partner.isParticipatingSchool
        logoId.value = props.partner.logoId
        logoKey.value = props.partner.logoKey
        previewUrl.value = props.partner.logoId
        fileModel.value = null
      } else {
        resetForm()
      }
    },
    { immediate: true }
  )
</script>

<template>
  <v-dialog v-model="localModelValue" max-width="800">
    <v-card>
      <v-card-title class="text-lg font-bold px-6 pt-6">
        {{ props.editMode ? t('partnersSettings.editTitle') : t('partnersSettings.addTitle') }}
        <v-btn icon class="absolute top-2 right-2" @click="close" aria-label="Close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="onSubmit">
          <!-- Nom -->
          <label class="block mb-1 text-m"
            >{{ t('partnersSettings.nameTitle') }} <span class="text-red-500">*</span></label
          >
          <v-text-field
            v-model="name"
            :placeholder="t('partnersSettings.namePlaceholder')"
            :rules="[required]"
            required
            variant="solo"
            class="mb-4"
          />

          <!-- Website -->
          <label class="block mb-1 text-m"
            >{{ t('partnersSettings.websiteTitle') }} <span class="text-red-500">*</span></label
          >
          <v-text-field
            v-model="websiteUrl"
            :placeholder="t('partnersSettings.websitePlaceholder')"
            :rules="[required]"
            required
            variant="solo"
            class="mb-4"
          />

          <!-- Participation -->
          <v-checkbox
            v-model="isParticipatingSchool"
            :label="t('partnersSettings.participatingSchool')"
            class="mt-5"
            @click.stop
          />

          <!-- Logo -->
          <label class="block mb-1 text-m"
            >{{ t('partnersSettings.logo') }} <span class="text-red-500">*</span></label
          >
          <v-file-input
            v-model="fileModel"
            accept=".png, .jpg, .jpeg, .svg"
            :rules="[validateImage, logoRequired]"
            :label="t('partnersSettings.logo')"
            prepend-icon="mdi-image"
            variant="solo"
            class="mb-4"
            @update:modelValue="onFileInputChange"
          />

          <!-- Preview -->
          <div class="flex flex-wrap gap-4 mb-4">
            <div v-if="!!previewUrl" class="relative w-32 h-32 border rounded-lg overflow-hidden">
              <img :src="previewUrl" class="object-contain w-full h-full" />
              <v-btn
                v-if="!!newLogoFile"
                icon
                small
                class="absolute top-0 right-0 bg-white/60"
                @click="removeLogoFile()"
              >
                <v-icon small color="red">mdi-close</v-icon>
              </v-btn>
            </div>
          </div>

          <v-card-actions class="justify-center">
            <v-btn color="primary" type="submit" variant="elevated" class="px-8 mb-3">
              {{ props.editMode ? t('common.edit') : t('common.create') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
