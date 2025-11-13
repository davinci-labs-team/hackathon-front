<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { AnnouncementDTO } from '@/types/announcement'
import AnnouncementPopup from '@/components/common/AnnouncementPopup.vue'
import AnnouncementCard from '@/components/common/AnnouncementCard.vue'
import { AnnouncementService } from '@/services/announcementService'

const { t } = useI18n()

// Props
const props = defineProps<{
  itemsPerPage?: number
  canDelete?: boolean
}>()

// Events pour le parent
const emit = defineEmits(['edit', 'delete'])

// Pagination
const allAnnouncements = ref<AnnouncementDTO[]>([])

onMounted(async () => {
  try {
    allAnnouncements.value = await AnnouncementService.getAllPublic()
  } catch (error) {
    console.error('Error fetching announcements:', error)
  }
})

const itemsPerPage = props.itemsPerPage || 5
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(allAnnouncements.value.length / itemsPerPage))
const paginatedAnnouncements = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return allAnnouncements.value.slice(start, start + itemsPerPage)
})
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

// Popup interne
const showPopup = ref(false)
const selectedAnnouncement = ref<AnnouncementDTO | null>(null)
const openPopup = (announcement: AnnouncementDTO) => {
  selectedAnnouncement.value = announcement
  showPopup.value = true
}

// Actions déléguées au parent
const onEdit = (announcement: AnnouncementDTO) => emit('edit', announcement)
const onDelete = (announcement: AnnouncementDTO) => emit('delete', announcement)
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
          <AnnouncementCard :announcement="item" />
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
            @click.stop="onDelete(item)"
          />
          <!-- Edit button -->
          <v-btn
            v-if="canDelete"
            icon="mdi-pencil"
            color="primary"
            variant="text"
            size="small"
            :title="t('common.edit')"
            @click.stop="onEdit(item)"
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
