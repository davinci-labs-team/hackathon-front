<template>
    <div class="max-w-md mx-auto text-center space-y-6">
      <h2 class="text-2xl font-semibold">Connexion</h2>
      <div class="space-y-4">
        <router-link to="/organizer/dashboard">
          <button class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            Espace Organisateur
          </button>
        </router-link>
        <router-link to="/user/dashboard">
          <button class="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
            Espace Utilisateur
          </button>
        </router-link>
      </div>
    </div>
  </template>
  