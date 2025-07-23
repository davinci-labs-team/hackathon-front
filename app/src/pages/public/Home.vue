<script setup lang="ts">
import HackathonPoster from '@/assets/images/hackathon-poster.png'
import Info from '../../components/public/Info.vue'
import HackathonExample from '@/assets/images/hackathon-example.jpg'
</script>

<template>
  <v-container fluid class="py-6 px-4">
    <div class="flex w-full gap-6" style="height: 600px;">
      
      <!-- Colonne image -->
      <div class="w-1/4 flex items-center justify-center overflow-hidden" style="height: 100%;">
        <img
          :src="HackathonExample"
          alt="Hackathon Poster"
          class="max-h-full w-auto rounded"
        />
      </div>

      <div class="w-3/4 flex flex-col gap-6 rounded p-6" style="height: 100%;">
        <Info />
      </div>

    </div>
  </v-container>
</template>
