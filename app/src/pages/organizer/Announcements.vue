<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Announcements from '@/components/common/Announcements.vue'
  import { announcements as allAnnouncements } from '@/tests/data/announcements'
  import AnnouncementForm from '@/components/organizer/announcements/AnnouncementForm.vue'
  import type { AnnouncementDTO } from '@/types/announcement'

  const { t } = useI18n()

  const searchQuery = ref('')
  const showAddPopup = ref(false)

  // Computed property to filter announcements based on search query
  const filteredAnnouncements = computed(() => {
    if (!searchQuery.value.trim()) return allAnnouncements
    return allAnnouncements.filter(
      (a) =>
        a.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        a.author.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        a.tags.some((tag) => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  })

  const onAddAnnouncement = () => {
    // TODO: gérer l'ajout d'une annonce (popup, navigation, etc.)
    showAddPopup.value = true
  }

  const handleSave = (newAnnouncement: AnnouncementDTO) => {
    // Ici tu gères l'ajout réel (push dans une liste, appel API, etc)
    console.log('Nouvelle annonce sauvegardée:', newAnnouncement)
    showAddPopup.value = false
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

        <AnnouncementForm v-model="showAddPopup" @save="handleSave" />
      </div>
    </v-row>
  </v-container>
</template>
