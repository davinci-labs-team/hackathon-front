<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { AnnouncementDTO } from '@/types/announcement'
  import { newTabImage } from '@/utils/imageUtils'
  import { timeAgo } from '@/utils/dateUtils'

  const { t, locale } = useI18n()
  const props = defineProps<{
    announcement: AnnouncementDTO | null
    show: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:show', value: boolean): void
  }>()

  const closePopup = () => {
    emit('update:show', false)
  }
</script>

<template>
  <v-dialog v-model="props.show" max-width="800px" scrollable>
    <v-card v-if="props.announcement">
      <v-card-text>
        <h3 class="text-2xl font-bold mb-2">{{ props.announcement.title }}</h3>
        <div class="flex items-center gap-2">
          <p class="text-sm text-gray-600">
            {{ t(`announcements.writtenBy`) }}
            <span class="font-semibold">{{ props.announcement.author }}</span>
            {{ timeAgo(props.announcement.createdAt, locale) }}
          </p>
          <div class="flex gap-2">
            <v-chip
              v-for="(tag, i) in props.announcement.tags"
              :key="i"
              color="orange lighten-3"
              class="text-xs"
            >
              {{ tag }}
            </v-chip>
          </div>
        </div>
      </v-card-text>

      <v-card-text>
        <p class="text-gray-800 whitespace-pre-line">
          {{ props.announcement.content }}
        </p>

        <div
          v-if="props.announcement.images?.length"
          class="flex gap-2 overflow-x-auto mt-4"
        >
          <v-img
            v-for="(img, idx) in props.announcement.images"
            :key="idx"
            :src="img"
            class="rounded-lg w-40 h-40 object-cover"
            cover
            @click="newTabImage(img)"
          />
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" @click="closePopup">
          {{ t('common.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
