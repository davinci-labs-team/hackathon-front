<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { AnnouncementService } from '@/services/announcementService'
  import type { AnnouncementDTO } from '@/types/announcement'
  import PreviewAnnouncementCard from '@/components/common/PreviewAnnouncementCard.vue'
  import AnnouncementPopup from '@/components/common/AnnouncementPopup.vue'

  const { t } = useI18n()
  const router = useRouter()

  const allAnnouncements = ref<AnnouncementDTO[]>([])
  const isLoading = ref(true)

  const latestAnnouncements = computed(() => {
    return allAnnouncements.value
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  })

  // Popup interne
  const showPopup = ref(false)
  const selectedAnnouncement = ref<AnnouncementDTO | null>(null)
  const openPopup = (announcement: AnnouncementDTO) => {
    selectedAnnouncement.value = announcement
    showPopup.value = true
  }

  onMounted(async () => {
    try {
      allAnnouncements.value = await AnnouncementService.getAll()
    } catch (error) {
      console.error('Error fetching announcements for dashboard preview:', error)
    } finally {
      isLoading.value = false
    }
  })

  const goToAnnouncements = () => {
    router.push('/user/announcements')
  }
</script>

<template>
  <div class="flex-grow">
    <h2 class="text-2xl font-semibold mb-4 flex justify-between items-center">
      {{ t('organizer.nav.announcements') }}
      <v-btn
        variant="text"
        color="primary"
        :ripple="false"
        size="small"
        @click="goToAnnouncements"
        v-if="latestAnnouncements.length > 0 && !isLoading"
      >
        {{ t('common.showMore') }}
        <v-icon end>mdi-arrow-right</v-icon>
      </v-btn>
    </h2>

    <v-card v-if="isLoading" elevation="2" class="pa-4 text-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p class="mt-2">{{ t('common.loading') }}</p>
    </v-card>

    <div v-else-if="latestAnnouncements.length > 0" class="overflow-x-auto pb-4">
      <div class="d-flex flex-row flex-nowrap gap-4 items-stretch">
        <div
          v-for="item in latestAnnouncements"
          :key="item.id"
          class="h-full"
          @click="openPopup(item)"
        >
          <PreviewAnnouncementCard :announcement="item" class="h-full" />
        </div>
      </div>
    </div>

    <div v-else class="text-center text-grey-darken-1 pa-4 bg-white shadow rounded">
      {{ t('announcements.noContent') }}
    </div>

    <AnnouncementPopup
      v-model:show="showPopup"
      :announcement="selectedAnnouncement"
      :key="selectedAnnouncement?.id"
      v-if="selectedAnnouncement"
    />
  </div>
</template>
