<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { getRole, getTPrefix } from '@/utils/user'
  import { useAuthStore } from '@/stores/auth'
  import { computed, ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { logout } from '@/services/authService'
  import { UserDTO } from '@/types/user'
  import { userService } from '@/services/userService'
  import AppSnackbar from '@/components/common/AppSnackbar.vue'
  import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

  const { t } = useI18n()

  // Snackbar
  const snackbar = ref(false)
  const text = ref('')
  const timeout = ref(1500)
  const error = ref(false)

  const showConfirmLogoutDialog = ref(false)
  const showConfirmDeleteAccountDialog = ref(false)

  const router = useRouter()
  const authStore = useAuthStore()

  const role = getRole()
  const route = useRoute()
  const isAdminPlatform = computed(() => route.path.startsWith('/organizer'))
  const tPrefix = getTPrefix(role, !isAdminPlatform.value)

  const profilPicture = ref('https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg')

  const editMode = ref(false)

  const userInfo = ref<UserDTO | null>(null)
  onMounted(async () => {
    if (authStore.user?.id) {
      try {
        const userResponse: UserDTO = await userService.getById(authStore.user.id)
        userInfo.value = userResponse
    
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
  })

  const handleSave = () => {
    // Save logic here
    editMode.value = false
    text.value = t('common.changesSaved')
    error.value = false
    snackbar.value = true
  }
  
  const handleEdit = () => {
    editMode.value = true
  }

  const cancelEdit = () => {
    editMode.value = false
  }

  /* LOGOUT LOGIC */

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

  const confirmLogout = () => {
    showConfirmLogoutDialog.value = true
  }

  /* DELETE ACCOUNT LOGIC */

  const handleDeleteAccount = async() => {
    try {
      if (authStore.user?.id) {
        await userService.remove(authStore.user.id)
        await logout()
      }
    } catch (err) {
      console.error('Delete account error:', err)
    }
  }

  const confirmDeleteAccount = () => {
    showConfirmDeleteAccountDialog.value = true
  }
</script>

<template>
  <v-container v-if="userInfo">
    <!-- Première carte: profil -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold mb-2">{{ t('profile.mainTitle') }}</h1>
      <v-btn v-if="!editMode" color="primary" @click="handleEdit">{{ t('profile.personalInfo.editButton') }}</v-btn>
      <div v-else>
        <v-btn color="grey" class="mr-2" @click="editMode = false">{{ t('common.cancel') }}</v-btn>
        <v-btn color="primary" @click="handleSave">{{ t('common.saveChanges') }}</v-btn>
      </div>
    </div>

    <v-card class="pa-6 mb-6" outlined>
      <v-row justify="space-between">
        <!-- Picture, name and role -->
        <v-col cols="10" md="4" class="d-flex align-center ml-4 gap-4">
          <v-avatar size="200" class="mr-4 elevation-1">
            <v-img :src="profilPicture" />
          </v-avatar>
          <div>
            <div class="user-name">{{ userInfo.firstname }} {{ userInfo.lastname }}</div>
            <div class="user-role">{{ t(`roles.${tPrefix}`) }}</div>
            <div class="user-school" v-if="userInfo.school">{{ userInfo.school }}</div>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <v-row>
      <v-col cols="12" md="8">
        <!-- Personal information card : bio and interests -->
        <v-card class="pa-6 mb-6" outlined>
          <v-card-title class="text-h5 font-weight-bold mb-6 d-flex align-center">
              {{ t(`profile.personalInfo.title`) }}
          </v-card-title>
          <v-card-text>
            <v-card-item>
            </v-card-item>
        </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <!-- Contact and link to other accounts card -->
        <v-card class="pa-6 mb-6" outlined>
          <v-card-title class="text-h5 font-weight-bold mb-6 d-flex align-center">
              {{ t(`profile.contact`) }}
          </v-card-title>
          <v-card-text>
            <v-card-item>
            </v-card-item>
        </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <AppSnackbar v-model="snackbar" :message="text" :timeout="timeout" :error="error" />

    <!-- Logout button centered -->
    <div class="flex justify-center gap-4">
      <v-btn color="red" class="mt-4" @click="confirmLogout">
        {{ t(`common.logout`) }}
      </v-btn>
      <v-btn color="red-darken-4" class="mt-4" @click="confirmDeleteAccount">
        {{ t(`profile.deleteAccount`) }}
      </v-btn>
    </div>

    <ConfirmDialog
      v-model="showConfirmLogoutDialog"
      :title="t('profile.logoutConfirmTitle')"
      :text="t('profile.logoutConfirmText')"
      :confirmText="t('profile.confirmButton')"
      :confirm-label="t('profile.confirmButton')"
      :cancelText="t('common.cancel')"
      @confirm="handleLogout"
    />

    <ConfirmDialog
      v-model="showConfirmDeleteAccountDialog"
      :title="t('profile.deleteAccount')"
      :text="t('profile.deleteAccountText')"
      :confirmText="t('profile.deleteAccountConfirm')"
      :confirm-label="t('profile.deleteAccountConfirm')"
      :cancelText="t('common.cancel')"
      @confirm="handleDeleteAccount"
    />

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

  .user-school {
    font-size: 1.4rem;;
    margin-top: 1rem;
  }
</style>
