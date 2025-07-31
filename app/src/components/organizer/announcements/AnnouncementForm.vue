<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import type { Announcement } from '@/types/announcement'

  const { t } = useI18n()

  const props = defineProps({
    modelValue: Boolean,
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

  const required = (v: string | null | undefined) => !!v || t('common.fieldRequired')

  const close = () => {
    localModelValue.value = false
    title.value = ''
    description.value = ''
    tags.value = ''
    isPrivate.value = false
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
      publishedDate: new Date().toISOString(),
      author: 'Current User',
    }

    emit('save', newAnnouncement)
    close()
  }
</script>

<template>
  <v-dialog v-model="localModelValue" max-width="800">
    <v-card>
      <v-card-title class="text-lg font-bold">
        {{ t('announcements.addTitle') }}
        <v-btn icon class="absolute top-2 right-2" @click="close" aria-label="Close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef" @submit.prevent="save">
          <v-text-field
            v-model="title"
            :label="t('announcements.title')"
            :rules="[required]"
            required
            class="mb-4"
          />
          <v-textarea
            v-model="description"
            :label="t('announcements.content')"
            :rules="[required]"
            required
            class="mb-4"
          />
          <v-text-field
            v-model="tags"
            :label="t('announcements.tags')"
            :hint="t('announcements.tagsHint')"
          />
          <v-switch
            v-model="isPrivate"
            :label="t('announcements.private')"
            :hint="t('announcements.privateHint')"
          />

          <v-card-actions class="justify-center">
            <v-btn color="primary" type="submit" variant="elevated" class="px-8 mb-3">
              {{ t('common.create') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
