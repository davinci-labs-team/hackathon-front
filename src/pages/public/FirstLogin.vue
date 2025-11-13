<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import {  } from '@/services/authService'
import { useRoute } from 'vue-router'
import { userService } from '@/services/userService'

  const { t } = useI18n()
  const route = useRoute()

  // Fields of the login form
  const email = ref(route.query.email?.toString() || '')
  const error = ref(false)
  const success = ref(false)
  const formRef = ref()
  const isLoading = ref(false)

  // Règles de validation Vuetify
  const required = (v: string) => !!v || t('common.fieldRequired')
  const emailRule = (v: string) => /.+@.+\..+/.test(v) || t('common.invalidEmail')

  const handleFirstLogin = async () => {
    if (!formRef.value?.isValid) return

    try {
      isLoading.value = true
      // Attempt send first login email logic
      await userService.requestPasswordReset(email.value)
      isLoading.value = false
      error.value = false
      success.value = true
    } catch (err) {
      console.error('Send First Login Email error:', err)
      error.value = true
    }
  }
</script>

<template>
  <v-container class="py-16 flex justify-center">
    <v-card class="p-6 space-y-6" style="width: 500px">
      <h2 class="text-2xl font-semibold text-center">{{ t('login.firstLoginTitle') }}</h2>

      <v-form ref="formRef" @submit.prevent="handleFirstLogin">
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

        <v-alert v-if="error" type="error" dense class="mb-4">
          {{ t('login.invalidCredentials') }}
        </v-alert>
        <v-alert v-if="success" type="success" dense class="mb-4">
          {{ t('login.firstLoginEmailSent') }}
        </v-alert>


        <v-btn type="submit" block color="primary" :loading="isLoading" class="text-white" :disabled="success">
          {{ t('login.btnSendFirstLogin') }}
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>
