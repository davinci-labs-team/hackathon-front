<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useAuthStore } from '@/stores/auth'
  import { UserRole } from '@/types/roles'

  const { t } = useI18n()
  const router = useRouter()
  const authStore = useAuthStore()

  // Fields of the login form
  const email = ref('')
  const password = ref('')
  const error = ref(false)
  const formRef = ref()

  // Règles de validation Vuetify
  const required = (v: string) => !!v || t('common.fieldRequired')
  const emailRule = (v: string) => /.+@.+\..+/.test(v) || t('common.invalidEmail')

  // Fonction de login
  const login = () => {
    if (!formRef.value?.validate()) return

    // Simulation d'authentification
    if (email.value === 'user@example.com' && password.value === 'user') {
      error.value = false

      // Créons un faux utilisateur (mock) respectant SupabaseDecodedUser
      const mockUser: SupabaseDecodedUser = {
        sub: 'cc31ac03-58ef-4821-a445-61f289882e36',
        email: email.value,
        phone: '',
        role: UserRole.ORGANIZER,
        session_id: crypto.randomUUID(),
        is_anonymous: false,
      }

      // Stockage de l'utilisateur dans le store (et localStorage via store)
      authStore.login(mockUser)

      // Redirection vers le dashboard
      router.push('/user/dashboard')
    } else {
      error.value = true
    }
  }
</script>

<template>
  <v-container class="py-16 flex justify-center">
    <v-card class="p-6 space-y-6" style="width: 500px">
      <h2 class="text-2xl font-semibold text-center">{{ t('login.title') }}</h2>

      <v-form ref="formRef" @submit.prevent="login">
        <v-text-field
          v-model="email"
          :placeholder="t('login.email')"
          :rules="[required, emailRule]"
          prepend-inner-icon="mdi-email"
          outlined
          dense
          variant="solo"
          required
          class="mb-4"
        />

        <v-text-field
          v-model="password"
          :placeholder="t('login.password')"
          :rules="[required]"
          type="password"
          prepend-inner-icon="mdi-lock"
          outlined
          dense
          variant="solo"
          required
          class="mb-4"
        />

        <v-alert v-if="error" type="error" dense class="mb-4">
          {{ t('login.invalidCredentials') }}
        </v-alert>

        <v-btn type="submit" block color="primary" class="text-white">
          {{ t('login.btn_login') }}
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>
