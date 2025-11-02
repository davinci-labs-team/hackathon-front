<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Announcements from '@/components/common/Announcements.vue'
import AnnouncementForm from '@/components/organizer/announcements/AnnouncementForm.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import type { AnnouncementDTO, CreateAnnouncementDTO, UpdateAnnouncementDTO } from '@/types/announcement'
import { AnnouncementService } from '@/services/announcementService'

const { t } = useI18n()

const searchQuery = ref('')
const showForm = ref(false) // une seule popup pour create/update
const selectedAnnouncement = ref<AnnouncementDTO | null>(null)
const editMode = ref(false)
const announcementToDelete = ref<AnnouncementDTO | null>(null)
const showConfirmDialog = ref(false)
const allAnnouncements = ref<AnnouncementDTO[]>([])

const filteredAnnouncements = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return allAnnouncements.value
  return allAnnouncements.value.filter(
    a =>
      a.title.toLowerCase().includes(query) ||
      a.content.toLowerCase().includes(query) ||
      a.author.toLowerCase().includes(query) ||
      a.tags?.some(tag => tag.toLowerCase().includes(query))
  )
})

onMounted(async () => {
  try {
    allAnnouncements.value = await AnnouncementService.getAll()
  } catch (error) {
    console.error('Error fetching announcements:', error)
  }
})

const handleSave = async (data: CreateAnnouncementDTO | UpdateAnnouncementDTO) => {
  if (editMode.value && selectedAnnouncement.value) {
    // update
    try {
      const updated = await AnnouncementService.update(selectedAnnouncement.value.id, data as UpdateAnnouncementDTO)
      const index = allAnnouncements.value.findIndex(a => a.id === selectedAnnouncement.value?.id)
      if (index !== -1) allAnnouncements.value.splice(index, 1, updated)
    } catch (error) {
      console.error('Error updating announcement:', error)
    }
  } else {
    // create
    try {
      const newAnnouncement = await AnnouncementService.create(data as CreateAnnouncementDTO)
      allAnnouncements.value.unshift(newAnnouncement)
    } catch (error) {
      console.error('Error creating announcement:', error)
    }
  }

  // Reset popup
  showForm.value = false
  selectedAnnouncement.value = null
  editMode.value = false
}


// Edit
const onEditAnnouncement = (announcement: AnnouncementDTO) => {
  selectedAnnouncement.value = announcement
  editMode.value = true
  showForm.value = true
}

// Delete
const onDeleteAnnouncement = (announcement: AnnouncementDTO) => {
  announcementToDelete.value = announcement
  showConfirmDialog.value = true
}

const confirmDeleteAnnouncement = async () => {
  if (!announcementToDelete.value) return
  try {
    await AnnouncementService.delete(announcementToDelete.value.id)
    const index = allAnnouncements.value.findIndex(a => a.id === announcementToDelete.value!.id)
    if (index !== -1) allAnnouncements.value.splice(index, 1)
  } catch (error) {
    console.error('Error deleting announcement:', error)
  }
  showConfirmDialog.value = false
  announcementToDelete.value = null
}

// Add
const onAddAnnouncement = () => {
  selectedAnnouncement.value = null
  editMode.value = false
  showForm.value = true
}
</script>

<template>
  <v-container>
    <v-row justify="center" class="mt-8">
      <div class="w-full md:w-8/12 lg:w-9/12 px-4">
        <h1 class="text-3xl font-bold mb-6">{{ t('organizer.nav.announcements') }}</h1>

        <!-- Search + Add -->
        <div class="flex mb-4 gap-4 items-center">
          <v-text-field
            v-model="searchQuery"
            :placeholder="t('organizer.announcements.searchPlaceholder')"
            variant="solo"
            hide-details
            density="comfortable"
            clearable
            class="flex-grow"
            @click:clear="searchQuery = ''"
          />
          <v-btn color="primary" @click="onAddAnnouncement">
            {{ t('organizer.announcements.addButton') }}
          </v-btn>
        </div>

        <!-- Announcements list -->
        <Announcements
          :announcements="filteredAnnouncements"
          :items-per-page="5"
          :can-delete="true"
          @edit="onEditAnnouncement"
          @delete="onDeleteAnnouncement"
        />

        <AnnouncementForm
        v-model="showForm"
        :editMode="editMode"
        :announcement="selectedAnnouncement"
        @save="handleSave"
        />

        <ConfirmDialog
          v-model="showConfirmDialog"
          :title="t('announcements.confirmTitle')"
          :text="`${t('announcements.confirmText')} : ${announcementToDelete?.title}`"
          :confirmLabel="t('common.delete')"
          :cancelLabel="t('common.cancel')"
          @confirm="confirmDeleteAnnouncement"
          @cancel="announcementToDelete = null"
        />
      </div>
    </v-row>
  </v-container>
</template>
