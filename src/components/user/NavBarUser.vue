<script setup lang="ts">
  import LanguageSelector from '@/components/common/LanguageSelector.vue'
  import { RouterLink, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { getRole, getTPrefix } from '@/utils/user'
  import { useHackathonLogo } from '@/composables/useHackathonLogo'
  import { ref, watch, onMounted} from 'vue'
  import { S3BucketService } from '@/services/s3BucketService'
  import { useAuthStore } from '@/stores/auth'

  const { t } = useI18n()
  const route = useRoute()
  const role = getRole()
  const tPrefix = getTPrefix(role, true)

  const menuItems = [
    { path: '/user/dashboard', label: `${tPrefix}.nav.dashboard` },
    { path: '/user/team', label: `${tPrefix}.nav.teams` },
    { path: '/user/project', label: `${tPrefix}.nav.projects` },
    { path: '/user/faq', label: `${tPrefix}.nav.faq` },
  ]

  const getLinkClasses = (path: string) => {
    const base = 'rounded px-2 py-1 transition-transform transition-colors duration-200'
    return [
      base,
      route.path === path ? 'font-bold bg-green-700 scale-102' : '',
      'hover:bg-green-800 hover:scale-105',
    ].join(' ')
  }

  const { logoPicture } = useHackathonLogo()
  const authStore = useAuthStore()

  const profilePicture = ref('https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg')

  const loadProfilePicture = async () => {
    if (authStore.user?.profilePicturePath) {
      try {
        const response = await S3BucketService.getFileUrl('users', authStore.user.profilePicturePath)
        // si ton service retourne { url: string }
        profilePicture.value = response.url
      } catch (err) {
        console.error('Error fetching profile picture:', err)
      }
    }
  }

  onMounted(() => {
    loadProfilePicture()
  })
</script>

<template>
  <header class="p-4 bg-green-600 text-white flex justify-between items-center">
    <!-- Logo -->
    <div class="flex items-center gap-4">
      <img :src="logoPicture" alt="Logo" class="h-12" />
    </div>

    <!-- Navigation -->
    <nav class="flex gap-6">
      <RouterLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        :class="getLinkClasses(item.path)"
      >
        {{ t(item.label) }}
      </RouterLink>
    </nav>

    <!-- Actions (Language + Profile) -->
    <div class="flex items-center gap-4">
      <LanguageSelector />
      <RouterLink to="/user/profile">
        <v-btn icon class="bg-transparent">
          <v-img
            :src="profilePicture"
            alt="Profile"
            class="rounded-full"
            width="32"
            height="32"
            cover
          />
        </v-btn>
      </RouterLink>
    </div>
  </header>
</template>
