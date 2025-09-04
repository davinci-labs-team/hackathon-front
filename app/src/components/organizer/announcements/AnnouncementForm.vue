<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Announcement } from '@/types/announcement'

const { t } = useI18n()

const props = defineProps({
  modelValue: Boolean,
  editMode: {
    type: Boolean,
    default: false,
  },
  announcement: {
    type: Object as () => Announcement | null,
    default: null,
  },
})
const emit = defineEmits(['update:modelValue', 'save'])

const localModelValue = ref(props.modelValue)
watch(
  () => props.modelValue,
  (val) => (localModelValue.value = val)
)
watch(localModelValue, (val) => emit('update:modelValue', val))

const formRef = ref()
const title = ref('')
const description = ref('')
const tags = ref('')
const isPrivate = ref(false)
const images = ref<File[]>([]) // nouvelles images

const required = (v: string | null | undefined) => !!v || t('common.fieldRequired')

const validateImages = (files: File[] | null) => {
  if (!files) return true
  if (files.length > 3) return t('announcements.max3Images')
  for (const f of files) {
    if (f.size > 3 * 1024 * 1024) return t('announcements.max3MB')
    if (!f.type.startsWith('image/')) return t('announcements.onlyImages')
  }
  return true
}

const close = () => {
  localModelValue.value = false
  title.value = ''
  description.value = ''
  tags.value = ''
  isPrivate.value = false
  images.value = []
}

const save = () => {
  if (!title.value || !description.value) {
    formRef.value?.validate()
    return
  }

  const newAnnouncement: Announcement = {
    title: title.value,
    description: description.value,
    tags: tags.value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0),
    isPrivate: isPrivate.value,
    publishedDate: props.announcement?.publishedDate || new Date().toISOString(),
    lastModified: new Date().toISOString(),
    author: 'Current User',
    // tu peux inclure directement les fichiers ou les transformer en base64/URL
    images: images.value, 
  }

  emit('save', newAnnouncement)
  close()
}

const getPreviewUrl = (file: File) => {
  return URL.createObjectURL(file)
}

const removeImage = (index: number) => {
  images.value.splice(index, 1)
}

watch(
  () => localModelValue.value,
  (open) => {
    if (open && props.editMode && props.announcement) {
      title.value = props.announcement.title
      description.value = props.announcement.description
      tags.value = props.announcement.tags.join(', ')
      isPrivate.value = props.announcement.isPrivate
      images.value = [] // si tu veux charger les anciennes images, gère-les ici
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
            v-model="images"
            accept="image/*"
            multiple
            counter
            :rules="[validateImages]"
            prepend-icon="mdi-image"
            :label="t('announcements.images')"
            hide-details="auto" 
            variant="solo"
            class="mb-4"
          />

          <!-- Preview des images sélectionnées -->
          <div v-if="images.length" class="flex flex-wrap gap-4 mb-4">
            <div
              v-for="(file, index) in images"
              :key="index"
              class="relative w-40 h-40 border rounded-lg overflow-hidden"
            >
              <img
                :src="getPreviewUrl(file)"
                class="object-cover w-full h-full"
                alt="preview"
              />
              <v-btn
                icon
                small
                class="absolute top-0 right-0 bg-white/60"
                @click="removeImage(index)"
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
