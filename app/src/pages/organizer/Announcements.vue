<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Announcements from '@/components/common/Announcements.vue'
  import { announcements as allAnnouncementsRaw } from '@/tests/data/announcements'
  import AnnouncementForm from '@/components/organizer/announcements/AnnouncementForm.vue'
  import type { AnnouncementDTO, CreateAnnouncementDTO } from '@/types/announcement'

  const { t } = useI18n()

  const searchQuery = ref('')
  const showAddPopup = ref(false)

  const allAnnouncements = ref<AnnouncementDTO[]>(allAnnouncementsRaw)

  // Computed property to filter announcements based on search query
  const filteredAnnouncements = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()
    if (!query) return allAnnouncements.value

    return allAnnouncements.value.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.content.toLowerCase().includes(query) ||
        a.author.toLowerCase().includes(query) ||
        a.tags?.some((tag) => tag.toLowerCase().includes(query))
    )
  })

  const onAddAnnouncement = () => {
    // TODO: gérer l'ajout d'une annonce (popup, navigation, etc.)
    showAddPopup.value = true
  }

  const handleCreate = (newAnnouncement: CreateAnnouncementDTO) => {
    // 1. Appel API pour créer l'annonce
    // 2. Mettre à jour la liste locale
    console.log('Nouvelle annonce créée :', newAnnouncement)

  }
</script>

<template>
  <v-container>
    <v-row justify="center" class="mt-8">
      <div class="w-full md:w-8/12 lg:w-9/12 px-4">
        <h1 class="text-3xl font-bold mb-6">{{ t('organizer.nav.announcements') }}</h1>

        <!-- Search Bar and Add button -->
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
          <v-btn color="primary" class="h-full" @click="onAddAnnouncement">
            {{ t('organizer.announcements.addButton') }}
          </v-btn>
        </div>

        <!-- Filtered List -->
        <Announcements
          :announcements="filteredAnnouncements"
          :items-per-page="5"
          :can-delete="true"
        />

        <AnnouncementForm v-model="showAddPopup" @create="handleCreate"/>
      </div>
    </v-row>
  </v-container>
</template>
