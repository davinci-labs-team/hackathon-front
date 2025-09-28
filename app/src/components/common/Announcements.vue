<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { AnnouncementDTO, UpdateAnnouncementDTO } from '@/types/announcement'
  import AnnouncementPopup from '@/components/common/AnnouncementPopup.vue'
  import AnnouncementCard from '@/components/common/AnnouncementCard.vue'
  import AnnouncementForm from '@/components/organizer/announcements/AnnouncementForm.vue'
  import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
  import { AnnouncementService } from '@/services/announcementService'

  const { t } = useI18n()

  const props = defineProps<{
    announcements: AnnouncementDTO[]
    itemsPerPage?: number
    canDelete?: boolean // or edit (is the user the author of the announcement)
  }>()

  const announcementToDelete = ref<AnnouncementDTO | null>(null)
  const showConfirmDialog = ref(false)
  const showEditForm = ref(false)

  const confirmDelete = (announcement: AnnouncementDTO) => {
    announcementToDelete.value = announcement
    showConfirmDialog.value = true
  }

  const deleteAnnouncement = async () => {
    if (!announcementToDelete.value) return

    try {
      await AnnouncementService.delete(announcementToDelete.value.id)
      const index = props.announcements.findIndex((a) => a.id === announcementToDelete.value?.id)
      if (index !== -1) {
        props.announcements.splice(index, 1)
      }
      showConfirmDialog.value = false
      announcementToDelete.value = null
    } catch (error) {
      console.error('Error deleting announcement:', error)
    }
  }

  const editAnnouncement = (announcement: AnnouncementDTO) => {
    selectedAnnouncement.value = announcement
    showEditForm.value = true
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
  const selectedAnnouncement = ref<AnnouncementDTO | null>(null)

  const openPopup = (announcement: AnnouncementDTO) => {
    selectedAnnouncement.value = announcement
    showPopup.value = true
  }

  const handleUpdate = async (id: string, update: UpdateAnnouncementDTO) => {
    try {
      const updatedAnnouncement = await AnnouncementService.update(id, update)
      const index = props.announcements.findIndex((a) => a.id === id)
      if (index !== -1) {
        props.announcements.splice(index, 1, updatedAnnouncement)
      }
      showEditForm.value = false
      selectedAnnouncement.value = null
    } catch (error) {
      console.error('Error updating announcement:', error)  
    }
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
        v-for="item in paginatedAnnouncements"
        :key="item.id"
        class="flex items-start gap-2 mb-4"
      >
        <div class="flex-grow" @click="openPopup(item)">
          <AnnouncementCard 
            :announcement="item" 
          />
        </div>

        <div class="flex flex-col gap-1">
          <!-- Delete button -->
          <v-btn
            v-if="canDelete"
            icon="mdi-delete"
            color="red"
            variant="text"
            size="small"
            :title="t('common.delete')"
            @click.stop="confirmDelete(item)"
          />
          <!-- Edit button -->
          <v-btn
            v-if="canDelete"
            icon="mdi-pencil"
            color="primary"
            variant="text"
            size="small"
            :title="t('common.edit')"
            @click.stop="editAnnouncement(item)"
          />
        </div>
      </div>

      <!-- Popup -->
      <AnnouncementPopup 
        v-model:show="showPopup" 
        :announcement="selectedAnnouncement" 
        :key="selectedAnnouncement?.id"
        v-if="selectedAnnouncement"
      />

      <!-- Edit Form -->
      <AnnouncementForm
        v-model="showEditForm"
        :editMode="true"
        :announcement="selectedAnnouncement"
        :key="selectedAnnouncement?.id"
        @update="handleUpdate"
      />

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

  <ConfirmDialog
    v-model="showConfirmDialog"
    :title="t('announcements.confirmTitle')"
    :text="`${t('announcements.confirmText')} : ${announcementToDelete?.title}`"
    :confirmLabel="t('common.delete')"
    :cancelLabel="t('common.cancel')"
    @confirm="deleteAnnouncement"
    @cancel="announcementToDelete = null"
  />
</template>
