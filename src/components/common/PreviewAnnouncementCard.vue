<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { timeAgo } from '@/utils/dateUtils'
  import { AnnouncementDTO } from '@/types/announcement'

  const { t, locale } = useI18n()

  const props = defineProps<{
    announcement: AnnouncementDTO
    cardWidth?: number
  }>()

  const emit = defineEmits<{
    (e: 'click', announcement: AnnouncementDTO): void
  }>()

  const handleClick = () => {
    emit('click', props.announcement)
  }

  const fileCount = computed(() => {
    return props.announcement.files?.length || 0
  })

  const hasFiles = computed(() => {
    return fileCount.value > 0
  })
</script>

<template>
  <v-card
    class="preview-announcement-card flex flex-col h-full"
    min-width="300"
    @click="handleClick"
  >
    <div class="flex-grow-1 pa-3 flex flex-col justify-start" style="min-height: 150px">
      <div class="d-flex justify-space-between items-center mb-2">
        <v-card-title class="text-base font-bold line-clamp-2 leading-tight pr-2 pa-0">
          {{ announcement.title }}
        </v-card-title>

        <div v-if="hasFiles" class="d-flex align-center gap-1">
          <span class="text-caption text-grey-darken-1">{{ fileCount }}</span>
          <v-icon color="grey-darken-1" size="small">mdi-image-multiple</v-icon>
        </div>
      </div>

      <v-card-text class="text-sm text-gray-700 pa-0 line-clamp-3 mb-3">
        {{ announcement.content }}
      </v-card-text>

      <div class="flex-grow"></div>
    </div>

    <v-card-actions class="pa-3 pt-0 justify-space-between items-end mt-auto">
      <p class="text-xs text-gray-500">
        {{ timeAgo(announcement.createdAt, locale) }}
      </p>

      <div class="d-flex flex-column align-end">
        <div class="flex flex-wrap justify-end">
          <v-chip
            v-for="(tag, i) in announcement.tags?.slice(0, 2)"
            :key="i"
            color="orange lighten-3"
            class="text-xs ml-1 mt-1"
            size="x-small"
          >
            {{ tag }}
          </v-chip>
        </div>
      </div>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
  .preview-announcement-card:hover {
    box-shadow: 0 6px 18px rgb(0 0 0 / 0.15);
    cursor: pointer;
  }
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
