<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
  import { getRole, getTPrefix } from '@/utils/user'
  import { useAuthStore } from '@/stores/auth'
  import { computed, ref } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { logout } from '@/services/authService'

  const router = useRouter()
  const authStore = useAuthStore()
  const role = getRole()
  const route = useRoute()
  const isAdminPlatform = computed(() => route.path.startsWith('/organizer'))
  const tPrefix = getTPrefix(role, !isAdminPlatform.value)

  const userName = computed(() => authStore.user?.name || 'User')
  const profilPicture = ref('https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg')

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
    <!-- Première carte: profil -->
    <v-card class="pa-6 mb-6" outlined>
      <v-card-title class="text-h4 font-weight-bold mb-6 d-flex align-center">
        {{ t(`profile.mainTitle`) }}
        <v-spacer></v-spacer>
        <v-btn color="primary" small @click="handleEdit">
          {{ t(`common.edit`) }}
        </v-btn>
      </v-card-title>

      <v-row justify="space-between">
        <!-- Picture, name and role -->
        <v-col cols="12" md="4" class="d-flex align-center">
          <v-avatar size="150" class="mr-4 elevation-1">
            <v-img :src="profilPicture" />
          </v-avatar>
          <div>
            <div class="user-name">{{ userName }}</div>
            <div class="user-role">{{ t(`roles.${tPrefix}`) }}</div>
          </div>
        </v-col>

        <!-- Personal info -->
        <v-col cols="12" md="8" class="d-flex align-center">
          <v-row>
            <v-col cols="12" sm="6">
              <strong>{{ t(`profile.personalInfo.email`) }}:</strong>
              {{ authStore.user?.mail || 'test@example.com' }}
            </v-col>
            <v-col cols="12" sm="6">
              <strong>{{ t(`profile.personalInfo.phone`) }}:</strong>
              {{ authStore.user?.phone || '01 23 45 67 89' }}
            </v-col>
            <v-col cols="12" sm="6">
              <strong>{{ t(`profile.personalInfo.linkedin`) }}:</strong>
              <a :href="authStore.user?.linkedin || '#'" target="_blank">
                {{ authStore.user?.linkedin || ' JeanMartin' }}
              </a>
            </v-col>
            <v-col cols="12" sm="6">
              <strong>{{ t(`profile.personalInfo.github`) }}:</strong>
              {{ authStore.user?.otherInfo || '—' }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>

    <!-- Logout button -->
    <v-btn color="red" class="mt-4" @click="handleLogout">
      {{ t(`common.logout`) }}
    </v-btn>
  </v-container>
</template>

<style scoped>
  .user-name {
    font-size: 2rem;
    font-weight: bold;
  }

  .user-role {
    font-size: 1.4rem;
    color: gray;
  }
</style>
