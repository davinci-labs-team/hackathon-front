<script setup lang="ts">
  import { ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { userService } from '@/services/userService'

  const { t } = useI18n()
  const router = useRouter()
  const route = useRoute()

  // Fields of the login form
  const email = ref(route.query.email?.toString() || '')
  const password = ref('')
  const confirmPassword = ref('')
  const error = ref(false)
  const errorMessage = ref('')
  const formRef = ref()
  const isLoading = ref(false)
  

  // Vuetify validation rules
  const required = (v: string) => !!v || t('common.fieldRequired')
  const emailRule = (v: string) => /.+@.+\..+/.test(v) || t('common.invalidEmail')
  const passwordsMatch = (v: string) => v === password.value || t('common.passwordsDoNotMatch')
  const passwordComplexity = (v: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(v) || t('common.passwordComplexity')
  }

  const handlePasswordReset = async () => {
    if (!formRef.value?.isValid || password.value !== confirmPassword.value) return
  
    isLoading.value = true

    try {
      await userService.resetPassword(email.value, route.query.token?.toString() || '', password.value)
      
      error.value = false
      router.push(`/login?email=${email.value}`)
    } catch (err) {
      console.error('Password reset error:', err)
      error.value = true
      errorMessage.value = t('login.resetFailed')
    } finally {
      isLoading.value = false
    }
  }
</script>

<template>
  <v-container class="py-16 flex justify-center">
    <v-card class="p-6 space-y-6" style="width: 500px">
      <h2 class="text-2xl font-semibold text-center">{{ t('login.resetTitle') }}</h2>

      <v-form ref="formRef" @submit.prevent="handlePasswordReset">
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
          :rules="[required, passwordComplexity]"
          type="password"
          prepend-inner-icon="mdi-lock"
          outlined
          dense
          variant="solo"
          required
          class="mb-4"
        />

        <v-text-field
          v-model="confirmPassword"
          :placeholder="t('login.confirmPassword')"
          :rules="[required, passwordsMatch]"
          type="password"
          prepend-inner-icon="mdi-lock"
          outlined
          dense
          variant="solo"
          required
          class="mb-4"
        />

        <v-alert v-if="error" type="error" dense class="mb-4">
          {{ errorMessage }}
        </v-alert>

        <v-btn type="submit" block color="primary" :loading="isLoading" class="text-white">
          {{ t('login.confirmPassword') }}
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>