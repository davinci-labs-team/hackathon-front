<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { AnnouncementDTO } from '@/types/announcement'
  import { timeAgo } from '@/utils/dateUtils'
  import { ref, onMounted, watch } from 'vue'
  import { generateSignedUrls } from '@/utils/s3utils'
  import { openImaggeInNewTab } from '@/utils/s3utils'

  const { t, locale } = useI18n()
  const props = defineProps<{
    announcement: AnnouncementDTO
    show: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:show', value: boolean): void
  }>()

  const closePopup = () => {
    emit('update:show', false)
  }

  const signedUrls = ref<string[]>([])

  const loadImages = async () => {
  if (props.announcement.files && props.announcement.files.length > 0) {
    signedUrls.value = await generateSignedUrls('annonces', props.announcement.files , !props.announcement.isPrivate)
  }
}

onMounted(loadImages)
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
          v-if="signedUrls.length > 0"
          class="flex gap-2 overflow-x-auto mt-4"
        >
        <v-img
        v-for="(url, idx) in signedUrls"
          :key="idx"
          :src="url"
          class="rounded-lg w-28 h-28 object-contain"
          @click="openImaggeInNewTab(url)"
          style="cursor: pointer"
          contain
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
