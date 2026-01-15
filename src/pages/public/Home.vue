<script setup lang="ts">
  import HackathonExample from '@/assets/images/hackathon-example.jpg'
  import Partners from '@/components/public/Partners.vue'
  import Announcements from '@/components/common/Announcements.vue'
  import Info from '@/components/public/Info.vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
</script>

<template>
  <v-container fluid class="py-8 px-6">
    <div class="flex w-full gap-2 mb-6 min-h-[300px]">
      <div class="w-1/4 flex items-start justify-center overflow-hidden" style="height: 100%">
        <img
          :src="HackathonExample"
          alt="Hackathon Poster"
          class="h-auto max-h-[500px] w-auto object-contain object-top rounded"
        />
      </div>

      <div class="w-3/4 flex flex-col gap-6 rounded p-6 h-auto" style="height: 100%">
        <Info />
      </div>
    </div>

    <div class="flex w-full gap-6 mb-6 min-h-[400px]">
      <div class="w-1/4" style="height: 100%">
        <Partners />
      </div>

      <div class="w-3/4 flex flex-col gap-6 rounded p-6 bg-white shadow" style="height: 100%">
        <h2 class="text-3xl font-semibold mt-2 mb-3">
          {{ t('announcements.lastAnnouncements') }}
        </h2>
        <Announcements :items-per-page="5" :is-public="true"/>
      </div>
    </div>
  </v-container>
</template>
