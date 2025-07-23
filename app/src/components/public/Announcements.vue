<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Announcement {
  title: string
  author: string
  date: string
  tags: string[]
  description: string
  images?: string[]
}

const props = defineProps<{
  announcements: Announcement[]
  itemsPerPage?: number
}>()

const itemsPerPage = props.itemsPerPage || 5
const currentPage = ref(1)

const totalPages = computed(() =>
  Math.ceil(props.announcements.length / itemsPerPage)
)

const paginatedAnnouncements = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return props.announcements.slice(start, start + itemsPerPage)
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
</script>

<template>
  <div>
    <h2 class="text-3xl font-semibold mt-2 mb-10">
      {{ t('announcements.title') }}
    </h2>
    <div
      v-for="(item, index) in paginatedAnnouncements"
      :key="index"
      class="mb-4 p-4 rounded-lg shadow bg-white flex flex-col md:flex-row gap-4"
    >
      <div class="flex-1">
        <h3 class="text-lg font-bold">{{ item.title }}</h3>
        <div class="flex items-center gap-2">
          <p class="text-sm text-gray-600">
          {{ t(`announcements.writtenBy`) }} <span class="font-semibold">{{ item.author }}</span> {{ t(`announcements.on`) }} {{ item.date }}
        </p>
        <div class="flex gap-2">
          <v-chip
            v-for="(tag, i) in item.tags"
            :key="i"
            color="orange lighten-3"
            class="text-xs"
          >
            {{ tag }}
          </v-chip>
        </div>
        </div>
        <p class="mt-3 text-gray-700 line-clamp-2">
          {{ item.description }}
        </p>
      </div>

      <div v-if="item.images && item.images.length > 0" class="flex gap-2 overflow-x-auto items-center">
        <v-img
          v-for="(img, idx) in item.images"
          :key="idx"
          :src="img"
          class="rounded-lg w-32 h-32 object-cover"
          cover
      />
</div>

    </div>

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
</template>
