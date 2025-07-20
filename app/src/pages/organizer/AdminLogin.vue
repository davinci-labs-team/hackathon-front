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
  if (!formRef.value?.isValid) return

  // Simule une authentification
  if (email.value === 'admin@example.com' && password.value === 'adminpass') {
    error.value = false
    router.push('/organizer/dashboard')
  } else {
    error.value = true
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <v-card class="w-full max-w-md p-6 space-y-4 shadow-lg">
      <h2 class="text-2xl text-center font-semibold">
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
          class="mb-4"
        />

        <v-alert v-if="error" type="error" dense class="mb-4">
          {{ t('login.invalidCredentials') }}
        </v-alert>

        <v-btn
          type="submit"
          :disabled="!isValid"
          color="green"
          block
          class="text-white"
        >
          {{ t('login.organizer') }}
        </v-btn>
      </v-form>
    </v-card>
  </div>
</template>
