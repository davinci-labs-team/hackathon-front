<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const email = ref('')
const password = ref('')
const router = useRouter()

const login = () => {
  // Authentification simple, à remplacer par vrai backend
  if (email.value === 'admin@example.com' && password.value === 'adminpass') {
    router.push('/organizer/dashboard')
  } else {
    alert('Accès refusé')
  }
}
</script>

<template>
  <div class="max-w-md mx-auto space-y-6 text-center">
    <h2 class="text-2xl">{{ t('login.organizerTitle') }}</h2>
    <input v-model="email" type="email" placeholder="Email admin" class="w-full border p-2 rounded" />
    <input v-model="password" type="password" placeholder="Mot de passe" class="w-full border p-2 rounded" />
    <button @click="login" class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
      {{ t('login.organizer') }}
    </button>
  </div>
</template>
