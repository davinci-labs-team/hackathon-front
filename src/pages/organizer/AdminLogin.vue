<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { UserRole } from '@/types/roles'
  import { loginWithSupabase } from '@/services/authService'
  import { usePhaseStore } from '@/stores/phase'

  const { t } = useI18n()
  const router = useRouter()
  const phaseStore = usePhaseStore()

  const email = ref('')
  const password = ref('')
  const error = ref(false)
  const accessDenied = ref(false)
  const errorMessage = ref('')
  const formRef = ref()

  const required = (v: string) => !!v || t('common.fieldRequired')
  const emailRule = (v: string) => /.+@.+\..+/.test(v) || t('common.invalidEmail')

  const handleLogin = async () => {
    if (!formRef.value?.isValid) return

    try {
      const user = await loginWithSupabase(email.value, password.value, true)

      error.value = false
      // Fetch phases and schedule next refresh
      await phaseStore.fetchPhases()
      phaseStore.scheduleNextRefresh()

      if (user.role === UserRole.ORGANIZER) {
        router.push('/organizer/hackathon')
      } else {
        router.push('/')
      }
    } catch (err: any) {
      if (err.message.includes('Access denied')) {
        accessDenied.value = true
        error.value = false
      } else {
        error.value = true
        accessDenied.value = false
        if (err.message === 'Invalid credentials' || err.message?.includes('Invalid login credentials')) {
          errorMessage.value = t('login.invalidCredentials')
        } else if (err.response?.status === 404) {
          errorMessage.value = t('login.userNotInvited')
        } else {
          errorMessage.value = t('common.error')
        }
      }
    }
  }
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <v-card class="w-full max-w-md p-10 space-y-8 shadow-md border border-gray-200" elevation="1">
      <h2 class="text-3xl font-semibold text-gray-900 text-center tracking-tight">
        {{ t('login.organizerTitle') }}
      </h2>

      <v-form ref="formRef" v-slot="{ isValid }" @submit.prevent="handleLogin">
        <v-text-field
          v-model="email"
          :placeholder="t('login.email')"
          :rules="[required, emailRule]"
          prepend-inner-icon="mdi-email"
          outlined
          dense
          variant="solo"
          class="mb-6"
          :style="{ borderRadius: '0' }"
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
          {{ errorMessage }}
        </v-alert>

        <v-alert
          v-if="accessDenied"
          type="warning"
          dense
          colored-border
          elevation="1"
          class="mb-6"
          :style="{ borderRadius: '0' }"
        >
          {{ t('login.accessDenied') }}
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
