<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useTeamStore } from '@/stores/teamStore'
  import { useUser } from '@/composables/useUser'
  import { UserRole } from '@/types/roles'
  import { TeamDTO, UserPreviewDTO } from '@/types/team'

  const { t } = useI18n()

  defineProps<{
    phaseName: string
  }>()

  const teamStore = useTeamStore()
  const teams = computed(() => teamStore.teams)
  const { users } = useUser()

  const numberOfTeams = computed<number>(() => {
    return teams.value.length
  })

  const totalUsersByRole = (role: UserRole) =>
    computed<number>(() => {
      return users.value.filter((user) => user.role === role).length
    })

  const assignedUsersByRole = (role: UserRole) =>
    computed<number>(() => {
      let count = 0
      if (role === UserRole.PARTICIPANT) {
        count = users.value.filter((user) => user.role === role && user.teamId !== null).length
      } else {
        const assignedIds = new Set<string>()

        teams.value.forEach((team: TeamDTO) => {
          let membersList: UserPreviewDTO[] = []
          if (role === UserRole.JURY) {
            membersList = team.juries
          } else if (role === UserRole.MENTOR) {
            membersList = team.mentors
          }

          membersList.forEach((member) => {
            assignedIds.add(member.id)
          })
        })
        count = assignedIds.size
      }
      return count
    })

  const percentageInTeams = (role: UserRole) =>
    computed<number>(() => {
      const total = totalUsersByRole(role).value
      const assigned = assignedUsersByRole(role).value

      if (total === 0) {
        return 0
      }
      // Arrondi à l'entier
      return Math.round((assigned / total) * 100)
    })

  // Participants
  const participantTotal = totalUsersByRole(UserRole.PARTICIPANT)
  const participantAssigned = assignedUsersByRole(UserRole.PARTICIPANT)
  const participantPercentage = percentageInTeams(UserRole.PARTICIPANT)

  // Jurys
  const juryTotal = totalUsersByRole(UserRole.JURY)
  const juryAssigned = assignedUsersByRole(UserRole.JURY)
  const juryPercentage = percentageInTeams(UserRole.JURY)

  // Mentors
  const mentorTotal = totalUsersByRole(UserRole.MENTOR)
  const mentorAssigned = assignedUsersByRole(UserRole.MENTOR)
  const mentorPercentage = percentageInTeams(UserRole.MENTOR)

  onMounted(() => {
    teamStore.fetchTeams()
  })
</script>

<template>
  <v-card variant="flat">
    <v-card-title class="text-title-2 pb-0">
      {{ phaseName }}
    </v-card-title>

    <v-card-text>
      <v-row dense class="mb-4">
        <v-col cols="12">
          <v-card variant="flat" class="pa-4 rounded-lg">
            <div class="d-flex align-baseline text-h4 font-weight-bold mb-4">
              <span class="mr-2 text-blue-darken-2">{{ numberOfTeams }}</span>
            </div>
            <div class="text-subtitle-1 text-medium-emphasis">
              {{ t('hackathonManagement.stats.team.teamsCreated') }}
            </div>
          </v-card>
        </v-col>
      </v-row>
      
      <v-row dense>
        
        <v-col cols="12" md="4" sm="6">
          <v-card variant="flat" class="pa-4 rounded-lg">
            <div class="text-subtitle-1 font-weight-bold mb-2">
              {{ t('hackathonManagement.stats.team.participants') }}
            </div>
            <div class="d-flex align-baseline text-h4 font-weight-bold mb-4">
              <span class="mr-2 text-green-darken-2">{{ participantPercentage }}%</span>
              <span class="text-subtitle-1 font-weight-regular text-medium-emphasis">
                ({{ participantAssigned }} / {{ participantTotal }})
              </span>
            </div>

            <v-progress-linear
              :model-value="participantPercentage"
              height="8"
              rounded
              color="green-darken-2"
            ></v-progress-linear>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" sm="6">
          <v-card variant="flat" class="pa-4 rounded-lg">
            <div class="text-subtitle-1 font-weight-bold mb-2">
              {{ t('hackathonManagement.stats.team.juries') }}
            </div>
            <div class="d-flex align-baseline text-h4 font-weight-bold mb-4">
              <span class="mr-2 text-deep-purple-darken-2">{{ juryPercentage }}%</span>
              <span class="text-subtitle-1 font-weight-regular text-medium-emphasis">
                ({{ juryAssigned }} / {{ juryTotal }})
              </span>
            </div>

            <v-progress-linear
              :model-value="juryPercentage"
              height="8"
              rounded
              color="deep-purple-darken-2"
            ></v-progress-linear>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" sm="6">
          <v-card variant="flat" class="pa-4 rounded-lg">
            <div class="text-subtitle-1 font-weight-bold mb-2">
              {{ t('hackathonManagement.stats.team.mentors') }}
            </div>
            <div class="d-flex align-baseline text-h4 font-weight-bold mb-4">
              <span class="mr-2 text-orange-darken-2">{{ mentorPercentage }}%</span>
              <span class="text-subtitle-1 font-weight-regular text-medium-emphasis">
                ({{ mentorAssigned }} / {{ mentorTotal }})
              </span>
            </div>

            <v-progress-linear
              :model-value="mentorPercentage"
              height="8"
              rounded
              color="orange-darken-2"
            ></v-progress-linear>
          </v-card>
        </v-col>
      </v-row>

      <div
        v-if="numberOfTeams === 0 && participantTotal === 0"
        class="text-center mt-6 text-medium-emphasis"
      >
        {{ t('hackathonManagement.stats.noDataAvailable') }}
      </div>
    </v-card-text>
  </v-card>
</template>