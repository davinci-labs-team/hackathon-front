<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref(false)
const formRef = ref()

// Règles de validation Vuetify
const required = (v: string) => !!v || t('validation.required')
const emailRule = (v: string) =>
  /.+@.+\..+/.test(v) || t('validation.invalidEmail')

const login = () => {
  if (!formRef.value?.validate()) return

  // Simulation d'authentification simple
  if (email.value === 'user@example.com' && password.value === 'user') {
    error.value = false
    router.push('/user/dashboard')
  } else {
    error.value = true
  }
}
</script>

<template>
  <v-container class="py-16 flex justify-center">
    <v-card class="p-6 space-y-6" style="width: 500px;">
      <h2 class="text-2xl font-semibold text-center">{{ t('login.title') }}</h2>

      <v-form ref="formRef" @submit.prevent="login">
        <v-text-field
          v-model="email"
          :label="t('login.email')"
          :rules="[required, emailRule]"
          prepend-inner-icon="mdi-email"
          outlined
          dense
          required
          class="mb-4"
        />

        <v-text-field
          v-model="password"
          :label="t('login.password')"
          :rules="[required]"
          type="password"
          prepend-inner-icon="mdi-lock"
          outlined
          dense
          required
          class="mb-4"
        />

        <v-alert v-if="error" type="error" dense class="mb-4">
          {{ t('login.invalidCredentials') }}
        </v-alert>

        <v-btn
          type="submit"
          block
          color="primary"
          class="text-white"
        >
          {{ t('login.user') }}
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

