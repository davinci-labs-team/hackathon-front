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
    canDelete?: boolean
  }>()

  const announcementToDelete = ref<Announcement | null>(null)
  const showConfirmDialog = ref(false)

  const confirmDelete = (announcement: Announcement) => {
    announcementToDelete.value = announcement
    showConfirmDialog.value = true
  }

  const deleteAnnouncement = () => {
    if (!announcementToDelete.value) return
    // TODO: logique de suppression réelle ici
    console.log('Deleting:', announcementToDelete.value.title)
    showConfirmDialog.value = false
    announcementToDelete.value = null
  }

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
    <div v-if="paginatedAnnouncements.length > 0">
      <div
        v-for="(item, index) in paginatedAnnouncements"
        :key="index"
        class="flex items-start gap-2 mb-4"
      >
        <div class="flex-grow" @click="openPopup(item)">
          <AnnouncementCard :announcement="item" />
        </div>

        <!-- Delete button -->
        <v-btn
          v-if="canDelete"
          icon="mdi-delete"
          color="red"
          variant="text"
          @click.stop="confirmDelete(item)"
        />
      </div>

      <!-- Popup -->
      <AnnouncementPopup v-model:show="showPopup" :announcement="selectedAnnouncement" />

      <!-- Pagination (no ellipsis for now) -->
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

  <v-dialog v-model="showConfirmDialog" max-width="500">
    <v-card>
      <v-card-title class="text-lg font-bold">
        {{ t('announcements.confirmTitle') }}
      </v-card-title>
      <v-card-text>
        {{ t('announcements.confirmText') }} <br />
        <span class="font-semibold">{{ announcementToDelete?.title }}</span>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text @click="showConfirmDialog = false">
          {{ t('common.cancel') }}
        </v-btn>
        <v-btn color="red" @click="deleteAnnouncement">
          {{ t('common.delete') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
