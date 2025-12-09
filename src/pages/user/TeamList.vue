<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { teamService } from '@/services/teamService'
import { userService } from '@/services/userService'
import { getConfiguration } from '@/services/configurationService'
import { ConfigurationKey } from '@/utils/configuration/configurationKey'
import { TeamDTO } from '@/types/team'
import { ThemesSettingsDTO } from '@/types/config'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const teams = ref<TeamDTO[]>([])
const themes = ref<ThemesSettingsDTO | null>(null)
const loading = ref(true)
const searchQuery = ref('')
const selectedTheme = ref<string | null>(null) // Filter by theme 'name' roughly mapped to 'tags'

// The design shows "Tags" filters. Since tags aren't properly in TeamDTO, 
// we'll simulate them using Themes names or just static mock tags if themes don't fit well.
// But using Themes is better for data integrity. 
const availableFilters = computed(() => {
  if (!themes.value) return []
  return themes.value.themes.map(th => th.name)
})

onMounted(async () => {
  await loadData()
})

const loadData = async () => {
    loading.value = true
    try {
        // Fetch themes for filters
        const config = await getConfiguration(ConfigurationKey.THEMES)
        if (config && config.value) {
            themes.value = config.value as ThemesSettingsDTO
        }

        // Fetch teams
        teams.value = await teamService.getAll()
    } catch(e) {
        console.error("Failed to load teams", e)
    } finally {
        loading.value = false
    }
}

// Derived computed for filtered teams
const filteredTeams = computed(() => {
    let result = teams.value

    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(team => 
            team.name.toLowerCase().includes(query) || 
            (team.description && team.description.toLowerCase().includes(query))
        )
    }

    // Filter by 'Theme' (acting as tag)
    // TeamDTO has themeId. We need to match selectedTheme (name) with themeId.
    if (selectedTheme.value && themes.value) {
        const themeObj = themes.value.themes.find(t => t.name === selectedTheme.value)
        if (themeObj) {
            result = result.filter(team => team.themeId === themeObj.id)
        }
    }

    return result
})

const getThemeName = (themeId: string) => {
    if (!themes.value) return ''
    const th = themes.value.themes.find(t => t.id === themeId)
    return th ? th.name : ''
}

const getSubjectName = (themeId: string, subjectId: string) => {
    if (!themes.value) return ''
    const th = themes.value.themes.find(t => t.id === themeId)
    if (!th) return ''
    const sub = th.subjects.find(s => s.id === subjectId)
    return sub ? sub.name : ''
}

const joinTeam = async (teamId: string) => {
    if (!authStore.user?.id) return
    try {
        await teamService.joinTeam(teamId) // New endpoint usage
        // Redirect to My Team page
        router.push('/user/team')
    } catch(e) {
        console.error("Failed to join team", e)
        // Ideally show a snackbar here
    }
}
</script>

<template>
  <v-container fluid class="pa-8">
    <h1 class="text-h4 font-weight-bold mb-6">{{ t('participant.team.title') }}</h1>

    <!-- Search and Actions -->
    <v-row class="mb-4" align="center">
        <v-col cols="12" md="8">
             <v-text-field
                v-model="searchQuery"
                prepend-inner-icon="mdi-magnify"
                :placeholder="t('participant.team.searchPlaceholder')"
                variant="outlined"
                density="comfortable"
                hide-details
                rounded="lg"
             ></v-text-field>
        </v-col>
        <v-col cols="12" md="4" class="text-right">
             <v-btn color="primary" height="48" class="text-none font-weight-bold" flat>
                {{ t('participant.team.createTeam') }}
             </v-btn>
        </v-col>
    </v-row>

    <!-- Filters -->
    <div class="mb-8 d-flex align-center flex-wrap gap-2">
        <span class="text-grey-darken-1 mr-2 text-body-2">{{ t('participant.team.activeFilters') }}:</span>
        <v-chip
            v-if="selectedTheme"
            close
            color="blue-lighten-4"
            class="text-blue-darken-4 font-weight-bold"
            @click:close="selectedTheme = null"
        >
            {{ selectedTheme }}
        </v-chip>
    </div>

    <div class="mb-8 d-flex flex-wrap gap-2">
         <v-btn
            variant="outlined"
            :color="selectedTheme === null ? 'primary' : 'grey'"
            class="text-none"
            @click="selectedTheme = null"
         >
            {{ t('participant.team.all') }}
         </v-btn>
         <v-btn
            v-for="filter in availableFilters"
            :key="filter"
            variant="outlined"
            :color="selectedTheme === filter ? 'primary' : 'grey'"
            class="text-none"
            @click="selectedTheme = filter"
         >
            {{ filter }}
         </v-btn>
    </div>

    <div class="text-body-1 mb-4">{{ t('participant.team.searchResults', { count: filteredTeams.length }) }}</div>

    <!-- Team List -->
    <v-row>
        <v-col v-for="team in filteredTeams" :key="team.id" cols="12">
            <v-card class="d-flex flex-column pa-6 border-opacity-100" style="border: 1px solid #e0e0e0;" flat>
                <div class="d-flex justify-space-between align-start">
                    <!-- Left: Info -->
                    <div>
                         <div class="d-flex align-center mb-3">
                            <v-sheet
                            color="#009688"
                            width="20"
                            height="20"
                            class="mr-3 rounded-sm"
                            ></v-sheet>
                            <h3 class="text-h6 font-weight-bold">{{ t('participant.team.teamName', { name: team.name }) }}</h3>
                        </div>

                        <!-- Chips -->
                        <div class="d-flex flex-wrap gap-2 mb-4 align-center">
                            <v-icon icon="mdi-tools" color="grey-darken-1" size="small" class="mr-1"></v-icon>
                            
                            <!-- Theme Chip -->
                            <v-chip color="red-lighten-4" class="text-red-darken-4 font-weight-medium" label size="small">
                                {{ getThemeName(team.themeId) }}
                            </v-chip>
                            
                             <!-- Subject Chip (acting as second tag) -->
                             <v-chip color="blue-lighten-4" class="text-blue-darken-4 font-weight-medium" label size="small">
                                {{ getSubjectName(team.themeId, team.subjectId) }}
                            </v-chip>
                        </div>
                         <div class="d-flex flex-wrap gap-2 mb-4 align-center">
                              <!-- Just showing Subject Name again as 'Project' placeholder like in design -->
                            <v-icon icon="mdi-file-document-outline" color="grey-darken-1" size="small" class="mr-1"></v-icon>
                             <v-chip color="grey-darken-2" class="text-white font-weight-medium" label size="small">
                                {{ getSubjectName(team.themeId, team.subjectId) }}
                            </v-chip>
                        </div>

                        <!-- Members -->
                         <div class="d-flex align-center mt-2">
                             <v-icon icon="mdi-account-group" color="black" class="mr-3"></v-icon>
                             <span class="text-body-2">
                                {{ team.members.map(m => `${m.firstname} ${m.lastname}`).join(', ') }}
                             </span>
                         </div>
                    </div>

                    <!-- Right: Action -->
                    <div class="text-center">
                        <v-btn
                            color="primary"
                            class="text-none font-weight-bold px-6 mb-2"
                            flat
                            @click="joinTeam(team.id)"
                        >
                            {{ t('participant.team.join') }}
                        </v-btn>
                        <!-- Mock spaces remaining logic -->
                        <div class="text-caption text-green font-weight-medium">
                            {{ (Math.max(0, 6 - team.members.length)) > 1 ? t('participant.team.placesRemaining', { count: Math.max(0, 6 - team.members.length) }) : t('participant.team.placesRemainingSingular', { count: Math.max(0, 6 - team.members.length) }) }}
                        </div>
                    </div>
                </div>
            </v-card>
        </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.gap-2 {
    gap: 8px;
}
</style>
