<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import HackathonPoster from '@/assets/images/hackathon-poster.png'

// TODO: 
// - Fetch hackathon data from API
</script>


<template>
<v-container fluid class="h-screen px-2 py-4">
      <div class="grid grid-cols-5 grid-rows-2 gap-4 h-full">
      <div class="bg-blue-200 rounded flex items-center justify-center col-start-1 row-start-1">
        <img :src="HackathonPoster" alt="Hackathon Poster" class="w-full h-full object-cover rounded" />
      </div>

      <div class="bg-blue-400 rounded flex items-center justify-center col-start-1 row-start-2">
        Listing des partenaires
      </div>

      <div class="bg-green-200 rounded flex items-center justify-center col-start-2 col-span-4 row-start-1">
        Block d'informations
      </div>

      <div class="bg-green-400 rounded flex items-center justify-center col-start-2 col-span-4 row-start-2">
        Listing des annonces
      </div>
    </div>
  </v-container>
</template>