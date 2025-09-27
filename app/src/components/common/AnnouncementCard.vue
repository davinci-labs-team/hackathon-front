<script setup lang="ts">
  import { AnnouncementDTO } from '@/types/announcement'
  import { useI18n } from 'vue-i18n'
  import { timeAgo } from '@/utils/dateUtils'

  const { t, locale } = useI18n()

  const props = defineProps<{
    announcement: AnnouncementDTO
  }>()

  const emit = defineEmits<{
    (e: 'click', announcement: AnnouncementDTO): void
  }>()

  const handleClick = () => {
    emit('click', props.announcement)
  }
</script>

<template>
  <v-card class="announcement-card mb-4 p-4 flex flex-col md:flex-row gap-4" @click="handleClick">
    <div class="flex-1">
      <div class="flex items-center gap-2 mb-2">
        <h3 class="text-lg font-bold">{{ announcement.title }}</h3>
        <v-icon v-if="announcement.isPrivate" color="black" size="18"> mdi-lock </v-icon>
      </div>
      <div class="flex items-center gap-2">
        <p class="text-sm text-gray-600">
          {{ t('announcements.writtenBy') }}
          <span class="font-semibold">{{ announcement.author }}</span>
          {{ timeAgo(announcement.createdAt, locale) }}
        </p>
        <div class="flex gap-2">
          <v-chip
            v-for="(tag, i) in announcement.tags"
            :key="i"
            color="orange lighten-3"
            class="text-xs"
          >
            {{ tag }}
          </v-chip>
        </div>
      </div>
      <p class="mt-3 text-gray-700 line-clamp-2">
        {{ announcement.content }}
      </p>
    </div>

    <div
      v-if="announcement.images && announcement.images?.length > 0"
      class="flex gap-2 overflow-x-auto items-center"
    >
      <v-img
        v-for="(img, idx) in announcement.images"
        :key="idx"
        :src="img"
        class="rounded-lg w-32 h-32 object-cover"
        cover
      />
    </div>
  </v-card>
</template>

<style scoped>
  .announcement-card:hover {
    box-shadow: 0 6px 18px rgb(0 0 0 / 0.15);
    cursor: pointer;
  }
</style>
