<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const email = ref('')
const password = ref('')
const router = useRouter()

const login = () => {
  // TODO: Remplacer par une vraie logique d'authentification
  if (email.value === 'user@example.com' && password.value === 'userpass') {
    router.push('/user/dashboard')
  } else {
    alert('Identifiants invalides')
  }
}
</script>

<template>
  <div class="max-w-md mx-auto space-y-6 text-center">
    <h2 class="text-2xl">{{ t('login.title') }}</h2>
    <input v-model="email" type="email" placeholder="Email" class="w-full border p-2 rounded" />
    <input v-model="password" type="password" placeholder="Mot de passe" class="w-full border p-2 rounded" />
    <button @click="login" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
      {{ t('login.user') }}
    </button>
  </div>
</template>
