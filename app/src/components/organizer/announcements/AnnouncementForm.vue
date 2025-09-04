<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Announcement } from '@/types/announcement'
import { supabase } from '@/services/supabase'

const { t } = useI18n()

// -----------------------------
// Props & Emits
// -----------------------------
const props = defineProps({
  modelValue: Boolean,
  editMode: { type: Boolean, default: false },
  announcement: { type: Object as () => Announcement | null, default: null },
})
const emit = defineEmits(['update:modelValue', 'save'])

// -----------------------------
// Dialog state
// -----------------------------
const localModelValue = ref(props.modelValue)
watch(() => props.modelValue, val => (localModelValue.value = val))
watch(localModelValue, val => emit('update:modelValue', val))

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
const newImages = ref<File[]>([])       // fichiers locaux ajoutés
const existingImages = ref<string[]>([]) // URLs existantes

// -----------------------------
// Validation
// -----------------------------
const required = (v: string | null | undefined) => !!v || t('common.fieldRequired')

const validateImages = (files: File[] | null) => {
  if (!files) return true
  if ((files.length + existingImages.value.length) > 3) return t('announcements.max3Images')
  for (const f of files) {
    if (f.size > 3 * 1024 * 1024) return t('announcements.max3MB')
    if (!f.type.startsWith('image/')) return t('announcements.onlyImages')
  }
  return true
}

// -----------------------------
// Image helpers
// -----------------------------
const getPreviewUrl = (file: File) => URL.createObjectURL(file)
const removeNewImage = (i: number) => newImages.value.splice(i, 1)
const removeExistingImage = (i: number) => existingImages.value.splice(i, 1)

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
// Upload images to Supabase
// -----------------------------
const uploadImages = async (files: File[]): Promise<string[]> => {
  const urls: string[] = []
  for (const file of files) {
    const filePath = `announcements/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('your-bucket').upload(filePath, file)
    if (!error) {
      const { data: publicUrlData } = supabase.storage.from('your-bucket').getPublicUrl(filePath)
      if (publicUrlData?.publicUrl) urls.push(publicUrlData.publicUrl)
    }
  }
  return urls
}

// -----------------------------
// Save announcement
// -----------------------------
const save = async () => {
  if (!title.value || !description.value) return

  const uploadedUrls = await uploadImages(newImages.value)
  const allUrls = [...existingImages.value, ...uploadedUrls]

  const newAnnouncement: Announcement = {
    id: props.announcement?.id,
    title: title.value,
    description: description.value,
    tags: tags.value.split(',').map(t => t.trim()).filter(t => t),
    isPrivate: isPrivate.value,
    publishedDate: props.announcement?.publishedDate || new Date().toISOString(),
    lastModified: new Date().toISOString(),
    author: 'Current User',
    images: allUrls,
  }

  emit('save', newAnnouncement)
  close()
}

// -----------------------------
// Initialize form when dialog opens
// -----------------------------
watch(
  () => localModelValue.value,
  open => {
    if (open && props.editMode && props.announcement) {
      title.value = props.announcement.title
      description.value = props.announcement.description
      tags.value = props.announcement.tags.join(', ')
      isPrivate.value = props.announcement.isPrivate
      newImages.value = []
      existingImages.value = props.announcement.images || []
    }
  },
  { immediate: true }
)
</script>

<template>
  <v-dialog v-model="localModelValue" max-width="800">
    <v-card>
      <v-card-title class="text-lg font-bold">
        {{ editMode ? t('announcements.editTitle') : t('announcements.addTitle') }}
        <v-btn icon class="absolute top-2 right-2" @click="close" aria-label="Close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef" @submit.prevent="save">
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
            :counter-string="newImages.length + existingImages.length + ' / 3 ' + t('announcements.images')"
            :rules="[validateImages]"
            :label="t('announcements.images')"
            prepend-icon="mdi-image"
            variant="solo"
            class="mb-4"
            @update:modelValue="onFileInputChange"
          />

          <!-- Preview -->
          <div class="flex flex-wrap gap-4 mb-4">
            <!-- New local images -->
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

            <!-- Existing images -->
            <div
              v-for="(url, index) in existingImages"
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
              {{ editMode ? t('common.edit') : t('common.create') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
