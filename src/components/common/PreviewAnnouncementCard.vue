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
  <v-card class="preview-announcement-card custom-size pa-4" @click="handleClick" elevation="1">
    <div class="header-container mb-2">
      <h3 class="title-text">{{ announcement.title }}</h3>
      <v-icon v-if="hasFiles" size="16" color="grey-darken-1" class="ml-2">mdi-paperclip</v-icon>
    </div>

    <p class="body-text">{{ announcement.content }}</p>

    <v-spacer></v-spacer>

    <div class="d-flex justify-space-between align-center mt-2">
      <span class="text-caption text-grey-darken-1">{{
        timeAgo(announcement.createdAt, locale)
      }}</span>
      <div class="d-flex gap-1">
        <v-chip
          v-for="(tag, i) in announcement.tags?.slice(0, 2)"
          :key="i"
          size="x-small"
          color="orange-lighten-4"
          variant="flat"
          class="text-orange-darken-4 font-weight-bold"
        >
          {{ tag }}
        </v-chip>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
  .custom-size {
    width: 300px;
    aspect-ratio: 1.2 / 1;
    display: flex;
    flex-direction: column;
    transition:
      transform 0.2s,
      box-shadow 0.2s;
  }

  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  /* Ellipsis Titre : 2 lignes */
  .title-text {
    font-size: 1.1rem;
    font-weight: 700;
    line-height: 1.3;
    color: #1a1a1a;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
  }

  .body-text {
    font-size: 0.9rem;
    line-height: 1.5;
    color: #4a4a4a;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
  }

  .preview-announcement-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
    transform: translateY(-2px);
    cursor: pointer;
  }
</style>
