<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { AnnouncementDTO, CreateAnnouncementDTO, UpdateAnnouncementDTO } from '@/types/announcement'
import { S3BucketService } from '@/services/s3BucketService'
import { generateSignedUrls } from '@/utils/s3utils'

const { t } = useI18n()

// -----------------------------
// Props & Emits
// -----------------------------
const props = defineProps<{
  modelValue: boolean
  editMode?: boolean
  announcement?: AnnouncementDTO | null
}>()

const emit = defineEmits<{
  (e: 'save', payload: CreateAnnouncementDTO | UpdateAnnouncementDTO): void
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
const title = ref('')
const description = ref('')
const tags = ref('')
const isPrivate = ref(false)

// -----------------------------
// Images
// -----------------------------
const newImages = ref<File[]>([])
const existingImages = ref<string[]>([])

// -----------------------------
// Tags
// -----------------------------
const parseTags = (tagsString: string): string[] => {
  return tagsString
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

// -----------------------------
// Validation
// -----------------------------
const required = (v: string | null | undefined) => !!v || t('common.fieldRequired')
const validateImages = (files: File[] | null) => {
  if (!files) return true

  const MAX_IMAGES = 3
  const MAX_SIZE_MB = 5
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

  if (files.length + existingImages.value.length > MAX_IMAGES) {
    return t('announcements.max3Images')
  }

  for (const f of files) {
    if (f.size > MAX_SIZE_BYTES) return t('announcements.max5MB')
    if (!f.type.startsWith('image/')) return t('announcements.onlyImages')
  }

  return true
}


// -----------------------------
// Image helpers
// -----------------------------
const getPreviewUrl = (file: File) => URL.createObjectURL(file)
const removeNewImage = (i: number) => newImages.value.splice(i, 1)

const removeExistingImage = (i: number) => {
  existingImages.value.splice(i, 1)
  signedUrls.value.splice(i, 1)
}

const onFileInputChange = (files: File | File[] | null) => {
  if (!files) return
  const newFiles = Array.isArray(files) ? files : [files]
  const combined = [...newImages.value, ...newFiles]
  if (combined.length + existingImages.value.length > 3) {
    alert(t('announcements.max3Images'))
    return
  }
  newImages.value = combined
}

// -----------------------------
// Form actions
// -----------------------------
const resetForm = () => {
  title.value = ''
  description.value = ''
  tags.value = ''
  isPrivate.value = false
  newImages.value = []
  existingImages.value = []
}

const close = () => {
  localModelValue.value = false
  resetForm()
}

// -----------------------------
// Create & Update logic
// -----------------------------
const uploadImages = async (): Promise<string[]> => {
  if (newImages.value.length === 0) return []

  try {
    const uploadedPaths = await Promise.all(
      newImages.value.map((file) => S3BucketService.uploadFile(file))
    )

    return uploadedPaths.map((res) => res.path)
  } catch (error) {
    console.error('Error uploading images:', error)
    alert(t('announcements.imageUploadError'))
    return []
  }
}

// -----------------------------
// Handle form submit
// -----------------------------
const onSubmit = async () => {
  if (!title.value || !description.value) return

  const tagsArray = parseTags(tags.value)
  const payload = {
    title: title.value,
    content: description.value,
    tags: tagsArray,
    isPrivate: isPrivate.value,
    files: [...existingImages.value, ...(await uploadImages())],
  }

  emit('save', payload)
  close()
}


// -----------------------------
// Initialize form when dialog opens
// -----------------------------
watch(
  localModelValue,
  (open) => {
    if (!open) return
    if (props.editMode && props.announcement) {
      title.value = props.announcement.title
      description.value = props.announcement.content
      tags.value = props.announcement.tags ? props.announcement.tags.join(', ') : ''
      isPrivate.value = props.announcement.isPrivate
      newImages.value = []
      existingImages.value = props.announcement.files || []
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

const signedUrls = ref<string[]>([])

const loadImages = async () => {
  if (props.announcement && props.announcement.files && props.announcement.files.length > 0) {
    signedUrls.value = await generateSignedUrls(props.announcement.files)
  }
}

onMounted(loadImages)

</script>

<template>
  <v-dialog v-model="localModelValue" max-width="800">
    <v-card>
      <v-card-title class="text-lg font-bold px-6 pt-6">
        {{ props.editMode ? t('announcements.editTitle') : t('announcements.addTitle') }}
        <v-btn icon class="absolute top-2 right-2" @click="close" aria-label="Close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="onSubmit">
          <v-text-field
            v-model="title"
            :placeholder="t('announcements.title')"
            :rules="[required]"
            required
            variant="solo"
            class="mb-4"
          />
          <v-textarea
            v-model="description"
            :placeholder="t('announcements.content')"
            :rules="[required]"
            required
            variant="solo"
            class="mb-4"
          />
          <v-text-field
            v-model="tags"
            :placeholder="t('announcements.tags')"
            :hint="t('announcements.tagsHint')"
            variant="solo"
            class="mb-4"
          />

          <v-file-input
            accept=".png, .jpg, .jpeg"
            multiple
            :counter-string="
              newImages.length + existingImages.length + ' / 3 ' + t('announcements.images')
            "
            :rules="[validateImages]"
            :label="t('announcements.images')"
            prepend-icon="mdi-image"
            variant="solo"
            class="mb-4"
            @update:modelValue="onFileInputChange"
          />

          <!-- Preview -->
          <div class="flex flex-wrap gap-4 mb-4">
            <div
              v-for="(file, index) in newImages"
              :key="file.name"
              class="relative w-32 h-32 border rounded-lg overflow-hidden"
            >
              <img :src="getPreviewUrl(file)" class="object-cover w-full h-full" />
              <v-btn
                icon
                small
                class="absolute top-0 right-0 bg-white/60"
                @click="removeNewImage(index)"
              >
                <v-icon small color="red">mdi-close</v-icon>
              </v-btn>
            </div>

            <div
              v-for="(url, index) in signedUrls"
              :key="url"
              class="relative w-32 h-32 border rounded-lg overflow-hidden"
            >
              <img :src="url" class="object-cover w-full h-full" />
              <v-btn
                icon
                small
                class="absolute top-0 right-0 bg-white/60"
                @click="removeExistingImage(index)"
              >
                <v-icon small color="red">mdi-close</v-icon>
              </v-btn>
            </div>
          </div>

          <v-switch
            v-model="isPrivate"
            :label="isPrivate ? t('announcements.private') : t('announcements.public')"
            :hint="isPrivate ? t('announcements.privateHint') : t('announcements.publicHint')"
            color="blue"
          />

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
