<script setup lang="ts">
  import { ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { loginWithSupabase } from '@/services/authService'
  import { usePhaseStore } from '@/stores/phase'
import { UserRole } from '@/types/roles'

  const { t } = useI18n()
  const router = useRouter()
  const route = useRoute()
  const phaseStore = usePhaseStore()

  // Fields of the login form
  const email = ref(route.query.email?.toString() || '')
  const password = ref('')
  const error = ref(false)
  const errorMessage = ref('')
  const formRef = ref()

  // Règles de validation Vuetify
  const required = (v: string) => !!v || t('common.fieldRequired')
  const emailRule = (v: string) => /.+@.+\..+/.test(v) || t('common.invalidEmail')
  
  const handleLogin = async () => {
    if (!formRef.value?.isValid) return

    try {
      const user = await loginWithSupabase(email.value, password.value)
      console.log('Logged in user:', user)

      // Fetch phases and schedule next refresh
      await phaseStore.fetchPhases()
      phaseStore.scheduleNextRefresh()
      
      error.value = false
      if (user?.role === UserRole.JURY || user?.role === UserRole.MENTOR) {
        router.push('/expert/dashboard')
      } else {
        router.push('/user/dashboard')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      error.value = true
      
      if (err.message === 'Invalid credentials' || err.message?.includes('Invalid login credentials')) {
        errorMessage.value = t('login.invalidCredentials')
      } else if (err.response?.status === 404) {
        errorMessage.value = t('login.userNotInvited')
      } else {
        errorMessage.value = t('common.error')
      }
    }
  }
</script>

<template>
  <v-container class="py-16 flex justify-center">
    <v-card class="p-6 space-y-6" style="width: 500px">
      <h2 class="text-2xl font-semibold text-center">{{ t('login.title') }}</h2>

      <v-form ref="formRef" @submit.prevent="handleLogin">
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
          {{ errorMessage }}
        </v-alert>

        <v-btn type="submit" block color="primary" class="text-white">
          {{ t('login.btn_login') }}
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>
