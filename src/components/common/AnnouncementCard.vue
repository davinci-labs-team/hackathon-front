<script setup lang="ts">
import { AnnouncementDTO } from '@/types/announcement'
import { useI18n } from 'vue-i18n'
import { timeAgo } from '@/utils/dateUtils'
import { ref, onMounted, watch } from 'vue'
import { generateSignedUrls } from '@/utils/s3utils'

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

// -----------------------------
// Signed URLs for images in S3
// -----------------------------
const signedUrls = ref<string[]>([])

const loadImages = async () => {
  if (props.announcement.files && props.announcement.files.length > 0) {
    signedUrls.value = await generateSignedUrls(props.announcement.files)
  }
  else {
    signedUrls.value = []
  }
}

onMounted(loadImages)

watch(
  () => props.announcement.files,
  () => {
    loadImages()
  },
  { immediate: true }
)
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
      v-if="signedUrls.length"
      class="flex gap-2 overflow-x-auto items-center"
    >
      <v-img
        v-for="(url, index) in signedUrls"
        :key="index"
        :src="url"
        class="w-24 h-24 rounded-lg object-cover"
        :alt="`Announcement Image ${index + 1}`"
        contain
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
