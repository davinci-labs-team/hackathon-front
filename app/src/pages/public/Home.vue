<script setup lang="ts">
  import HackathonPoster from '@/assets/images/hackathon-poster.png'
  import Info from '../../components/public/Info.vue'
  import HackathonExample from '@/assets/images/hackathon-example.jpg'
</script>

<template>
  <v-container fluid class="py-8 px-8">
    <div class="flex w-full gap-6" style="height: 600px">
      <div class="w-1/4 flex items-start justify-start overflow-hidden" style="height: 100%">
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
  </v-container>
</template>
