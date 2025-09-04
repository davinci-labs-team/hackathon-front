<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
  import { getRole, getTPrefix } from '@/utils/user'
  import { useAuthStore } from '@/stores/auth'
  import { computed } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { logout } from '@/services/authService'

  const router = useRouter()
  const authStore = useAuthStore()
  const role = getRole()
  const route = useRoute()
  const tPrefix = getTPrefix(role, true)

  const isAdminPlatform = computed(() => route.path.startsWith('/organizer'))

  const userName = computed(() => {
    return authStore.user?.name || 'User'
  })

  const handleLogout = async () => {
  try {
    await logout()
    if (isAdminPlatform.value) {
      router.push('/admin-login')
    } else {
      router.push('/login')
    }
  } catch (err) {
    console.error('Logout error:', err)
  }
}
  
</script>

<template>
  <v-container>
    <v-row justify="center" class="mt-8">
      <v-col cols="12" md="8" lg="6">
        <h1 class="text-3xl font-bold">{{ t(`common.profile`) }}</h1>
        <p class="mt-4 text-lg">{{ userName }}</p>
      </v-col>
      <!-- Logout button -->
       <v-col cols="12" md="8" lg="6" class="text-right">
        <v-btn color="primary" @click="handleLogout">
          {{ t(`common.logout`) }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
