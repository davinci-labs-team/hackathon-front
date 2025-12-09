<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { teamService } from '@/services/teamService'
  import { userService } from '@/services/userService'
  import { getConfiguration } from '@/services/configurationService'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'
  import { TeamDTO } from '@/types/team'
  import { ThemesSettingsDTO } from '@/types/config'
  import { useAuthStore } from '@/stores/auth'
  import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

  const { t } = useI18n()
  const router = useRouter()
  const authStore = useAuthStore()

  const team = ref<TeamDTO | null>(null)
  const subjectName = ref<string>('')
  const loading = ref(true)
  const showLeaveDialog = ref(false)

  // Fetch data
  onMounted(async () => {
    try {
      loading.value = true
      // 1. Get current user to find teamId (or use authStore if available)
      // The authStore.user might not have the latest teamId if it changed recently, 
      // but usually it's a good start. Let's verify with API or assume authStore is correct?
      // Best is to fetch fresh user data or just try to get the team if we know the ID.
      // Wait, the authStore user object (SupabaseDecodedUser) usually has metadata.
      // But let's fetch the user profile to be sure or list teams?
      // Actually, userService.getById(authStore.user.id) gives full UserDTO which refers to teamId.
      
      if (!authStore.user?.id) return

      const user = await userService.getById(authStore.user.id)
      
      if (user.teamId) {
        // 2. Fetch Team Details
        team.value = await teamService.getById(user.teamId)

        // 3. Fetch Themes to resolve Subject Name
        const themesConfig = await getConfiguration(ConfigurationKey.THEMES)
        if (themesConfig && themesConfig.value) {
            const themesSettings = themesConfig.value as ThemesSettingsDTO
            // Find the theme
            const theme = themesSettings.themes.find(t => t.id === team.value?.themeId)
            if (theme) {
                const subject = theme.subjects.find(s => s.id === team.value?.subjectId)
                if (subject) {
                    subjectName.value = subject.name
                }
            }
        }
      }
    } catch (e) {
      console.error('Error loading team page:', e)
    } finally {
      loading.value = false
    }
  })

  const confirmLeaveTeam = () => {
    showLeaveDialog.value = true
  }

  const handleLeaveTeam = async () => {
    if (!team.value) return
    try {
        await teamService.leaveTeam() // New self-service endpoint
         // Add a small delay or refetch logic if needed, but router push essentially resets view
        router.push('/user/find-team')
    } catch (e) {
        console.error("Error leaving team", e)
    }
  }

  // Helpers for UI
  const getInitials = (firstname: string, lastname: string) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase()
  }
</script>

<template>
  <v-container fluid class="pa-8">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h3 font-weight-bold">{{ t('participant.team.myTeam') }}</h1>
      <v-btn
        v-if="team"
        color="red"
        class="text-none text-white font-weight-bold"
        elevation="2"
        @click="confirmLeaveTeam"
      >
        {{ t('participant.team.leaveTeam') }}
      </v-btn>
    </div>

    <div v-if="loading" class="d-flex justify-center mt-12">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <!-- No Team State -->
    <v-card v-else-if="!team" class="pa-8 text-center" variant="outlined">
      <v-icon size="64" color="grey" class="mb-4">mdi-account-group-outline</v-icon>
      <h2 class="text-h5 text-grey-darken-1">{{ t('participant.team.noTeam') }}</h2>
      <v-btn color="primary" class="mt-4" to="/user/dashboard">
        {{ t('participant.team.searchTeam') }}
      </v-btn>
    </v-card>

    <!-- Team Content -->
    <v-card v-else class="pa-6 border-opacity-100" style="border: 1px solid #e0e0e0;" flat>
      
      <!-- Team Name Header -->
      <div class="d-flex align-center mb-6">
        <v-sheet
          color="#009688"
          width="24"
          height="24"
          class="mr-3 rounded-sm"
        ></v-sheet>
        <h2 class="text-h5 font-weight-bold">{{ t('participant.team.teamName', { name: team.name }) }}</h2>
      </div>

      <!-- Subject -->
      <div class="mb-6">
        <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-text-box-outline" class="mr-2" />
            <span class="font-weight-bold mr-2">{{ t('participant.team.subject') }} :</span>
            <v-chip color="grey-darken-3" class="text-white px-4" label size="small">
                {{ subjectName || t('participant.team.unknownSubject') }}
            </v-chip>
        </div>
        
        <p class="text-body-1 ml-8 mt-2" style="line-height: 1.6;">
            {{ team.description || t('participant.team.noDescription') }}
        </p>
      </div>

      <!-- Members -->
      <div class="mb-8">
         <div class="d-flex align-center mb-4">
            <v-icon icon="mdi-account-group" class="mr-2" />
            <span class="font-weight-bold">{{ t('participant.team.members') }} :</span>
         </div>

         <v-row>
            <v-col v-for="member in team.members" :key="member.id" cols="12" md="6">
                <!-- User Item -->
                <div class="d-flex align-center">
                    <v-avatar size="56" color="white" class="mr-4 border">
                        <span class="text-h6 font-weight-medium">{{ getInitials(member.firstname, member.lastname) }}</span>
                    </v-avatar>
                    <div>
                        <div class="text-body-1 font-weight-medium">
                            {{ member.firstname }} {{ member.lastname }}
                        </div>
                        <div class="text-caption font-italic text-grey-darken-1">
                            {{ member.school }}
                        </div>
                    </div>
                </div>
            </v-col>
         </v-row>
      </div>

      <!-- Mentors -->
      <div v-if="team.mentors && team.mentors.length > 0">
         <div class="d-flex align-center mb-4">
            <v-icon icon="mdi-school" class="mr-2" />
            <span class="font-weight-bold">{{ t('participant.team.mentors') }} :</span>
         </div>

         <v-row>
            <v-col v-for="mentor in team.mentors" :key="mentor.id" cols="12" md="6">
                 <div class="d-flex align-center">
                    <v-avatar size="56" color="white" class="mr-4 border">
                        <span class="text-h6 font-weight-medium">{{ getInitials(mentor.firstname, mentor.lastname) }}</span>
                    </v-avatar>
                    <div>
                        <div class="text-body-1 font-weight-medium">
                            {{ mentor.firstname }} {{ mentor.lastname }}
                        </div>
                        <div class="text-caption font-italic text-grey-darken-1">
                            <!-- Role isn't strictly 'Profession' but we display what we have or a static placeholder if needed -->
                            {{ mentor.role === 'JURY' ? t('participant.team.jury') : t('participant.team.mentor') }}
                        </div>
                    </div>
                </div>
            </v-col>
         </v-row>
      </div>

    </v-card>

    <!-- Leave Team Dialog -->
    <ConfirmDialog
        v-model="showLeaveDialog"
        :title="t('participant.team.confirmLeaveTitle')"
        :text="t('participant.team.confirmLeaveText')"
        :confirm-label="t('participant.team.confirmLeaveButton')"
        confirm-color="red"
        @confirm="handleLeaveTeam"
    />
  </v-container>
</template>

<style scoped>
/* Assuming 'Cookies' font is imported globally or we might need to use a standard cursive font as fallback */
.v-avatar.border {
    border: 1px solid #000 !important;
}
</style>
