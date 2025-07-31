<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useAuthStore } from '@/stores/auth'
  import { UserRole } from '@/types/roles'

  const { t } = useI18n()
  const router = useRouter()
  const authStore = useAuthStore()

  const email = ref('')
  const password = ref('')
  const error = ref(false)
  const formRef = ref()

  const required = (v: string) => !!v || t('common.fieldRequired')
  const emailRule = (v: string) => /.+@.+\..+/.test(v) || t('common.invalidEmail')

  const login = () => {
    if (!formRef.value?.isValid) return

    // Exemple simple : ici tu peux remplacer par appel API réel
    if (email.value === 'admin@example.com' && password.value === 'admin') {
      error.value = false

      // Création d’un objet user simulé avec rôle admin
      const user = {
        sub: 'admin-uuid-1234',
        email: email.value,
        phone: '',
        role: UserRole.ORGANIZER,
        session_id: 'session-uuid-1234',
        is_anonymous: false,
      }

      // On sauvegarde dans le store
      authStore.login(user)

      router.push('/organizer/announcements')
    } else {
      error.value = true
    }
  }
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <v-card class="w-full max-w-md p-10 space-y-8 shadow-md border border-gray-200" elevation="1">
      <h2 class="text-3xl font-semibold text-gray-900 text-center tracking-tight">
        {{ t('login.organizerTitle') }}
      </h2>

      <v-form ref="formRef" v-slot="{ isValid }" @submit.prevent="login">
        <v-text-field
          v-model="email"
          :label="t('login.email')"
          :rules="[required, emailRule]"
          prepend-inner-icon="mdi-email"
          outlined
          dense
          class="mb-6"
          :style="{ borderRadius: '0' }"
        />

        <v-text-field
          v-model="password"
          :label="t('login.password')"
          :rules="[required]"
          type="password"
          prepend-inner-icon="mdi-lock"
          outlined
          dense
          class="mb-6"
          :style="{ borderRadius: '0' }"
        />

        <v-alert
          v-if="error"
          type="error"
          dense
          colored-border
          elevation="1"
          class="mb-6"
          :style="{ borderRadius: '0' }"
        >
          {{ t('login.invalidCredentials') }}
        </v-alert>

        <v-btn
          type="submit"
          :disabled="!isValid"
          color="green"
          block
          text
          class="font-semibold text-gray-900 hover:bg-green-100 hover:text-green-700 transition"
          :style="{ borderRadius: '0' }"
        >
          {{ t('login.btn_login') }}
        </v-btn>
      </v-form>
    </v-card>
  </div>
</template>
