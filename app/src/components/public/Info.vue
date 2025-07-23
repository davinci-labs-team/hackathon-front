<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const router = useRouter()
  const infos = [
    {
      icon: 'mdi-calendar',
      title: 'Mercredi 10 juin',
      subtitle: '09h00 - Jeudi 11 juin 20h00',
    },
    {
      icon: 'mdi-map-marker',
      title: "Inscrivez-vous pour voir l'adresse",
      subtitle: 'Paris, Île-de-France',
    },
  ]
</script>

<template>
  <div class="flex flex-col h-full">
    <h1 class="text-4xl font-bold mb-1">Qubit or Not Qubit</h1>
    <p class="text-xl italic text-gray-600 mb-8">The Quantum Hackathon</p>
    <p class="mb-6 text-gray-700 mb-8">
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Veritatis saepe nulla commodi totam
      necessitatibus expedita autem ipsum, deserunt repudiandae porro itaque, consectetur ipsa
      dolorum ex, nisi eveniet voluptas ut adipisci?
    </p>

    <div class="flex gap-6 items-center">
      <!-- Ajout de items-center ici -->
      <!-- Infos centrées verticalement -->
      <div class="flex-1 space-y-4">
        <div v-for="(info, index) in infos" :key="index" class="flex items-center gap-4">
          <v-icon size="36">{{ info.icon }}</v-icon>
          <div>
            <div class="font-semibold">{{ info.title }}</div>
            <div class="text-gray-600">{{ info.subtitle }}</div>
          </div>
        </div>
      </div>

      <v-card class="flex-1 p-4 self-start" outlined shaped>
        <v-card-title class="bg-primary text-white rounded-t px-4 py-2"> Inscription </v-card-title>

        <v-card-text class="px-4 py-4">
          Bienvenue ! Pour rejoindre l'événement, veuillez vous inscrire ci-dessous.
        </v-card-text>

        <v-card-actions class="px-4 pb-4 justify-center">
          <router-link to="/login">
            <v-btn color="primary" variant="flat" class="text-white px-6 py-2" rounded>
              Première connexion
            </v-btn>
          </router-link>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>
