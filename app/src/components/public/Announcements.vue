<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Announcement } from '@/types/announcement'
  import AnnouncementPopup from '@/components/common/AnnouncementPopup.vue'
  import AnnouncementCard from '@/components/common/AnnouncementCard.vue'

  const { t } = useI18n()

  const props = defineProps<{
    announcements: Announcement[]
    itemsPerPage?: number
  }>()

  const itemsPerPage = props.itemsPerPage || 5
  const currentPage = ref(1)

  const totalPages = computed(() => Math.ceil(props.announcements.length / itemsPerPage))

  const paginatedAnnouncements = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return props.announcements.slice(start, start + itemsPerPage)
  })

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const showPopup = ref(false)
  const selectedAnnouncement = ref<Announcement | null>(null)

  const openPopup = (announcement: Announcement) => {
    selectedAnnouncement.value = announcement
    showPopup.value = true
  }
</script>

<style scoped>
  .announcement-card:hover {
    box-shadow: 0 6px 18px rgb(0 0 0 / 0.15);
    cursor: pointer;
  }
</style>

<template>
  <div>
    <h2 class="text-3xl font-semibold mt-2 mb-10">
      {{ t('announcements.title') }}
    </h2>
    <div v-if="paginatedAnnouncements.length > 0">
      <AnnouncementCard
        v-for="(item, index) in paginatedAnnouncements"
        :key="index"
        :announcement="item"
        @click="openPopup(item)"
      />

      <!-- Popup -->
      <AnnouncementPopup v-model:show="showPopup" :announcement="selectedAnnouncement" />

      <!-- Pagination -->
      <div class="flex justify-center items-center gap-2 mt-6">
        <v-btn
          icon="mdi-chevron-left"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        ></v-btn>
        <v-btn
          v-for="n in totalPages"
          :key="n"
          :variant="n === currentPage ? 'flat' : 'text'"
          color="primary"
          @click="goToPage(n)"
        >
          {{ n }}
        </v-btn>
        <v-btn
          icon="mdi-chevron-right"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        ></v-btn>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 py-8">
      {{ t('announcements.noContent') }}
    </div>
  </div>
</template>
