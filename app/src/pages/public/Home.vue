<script setup lang="ts">
  import HackathonPoster from '@/assets/images/hackathon-poster.png'
  import Info from '../../components/public/Info.vue'
  import HackathonExample from '@/assets/images/hackathon-example.jpg'
  import Partners from '../../components/public/Partners.vue'
  import Announcements from '../../components/public/Announcements.vue'
  import { announcements } from '@/tests/data/announcements'
</script>

<template>
  <v-container fluid class="py-8 px-6">
    <div class="flex w-full gap-2 mb-6" style="height: 500px">
      <div class="w-1/4 flex items-start justify-center overflow-hidden" style="height: 100%">
        <img
          :src="HackathonExample"
          alt="Hackathon Poster"
          class="h-full w-auto object-contain object-top rounded"
        />
      </div>

      <div class="w-3/4 flex flex-col gap-6 rounded p-6" style="height: 100%">
        <Info />
      </div>
    </div>

    <div class="flex w-full gap-6 mb-6 min-h-[400px]">
      <div class="w-1/4" style="height: 100%">
        <Partners />
      </div>

      <div class="w-3/4 flex flex-col gap-6 rounded p-6 bg-white shadow" style="height: 100%">
        <Announcements :announcements="announcements" :items-per-page="5" />
      </div>
    </div>
  </v-container>
</template>
