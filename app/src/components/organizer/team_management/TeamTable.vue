<script setup lang="ts">
  import { ThemesDTO } from '@/types/config'
  import { TeamDTO } from '@/types/team'
  import { TeamStatus } from '@/types/team_status'
  import { ref, computed, watch } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const props = defineProps<{
    teams: TeamDTO[]
    themes: ThemesDTO[]
    itemsPerPage?: number
  }>()
  const emit = defineEmits(['edit', 'delete'])

  const itemsPerPage = props.itemsPerPage || 5
  const currentPage = ref(1)

  const totalPages = computed(() => Math.ceil(props.teams.length / itemsPerPage))

  const paginatedTeams = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return props.teams.slice(start, start + itemsPerPage)
  })

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }
</script>

<template>
  <div class="bg-white border rounded-lg overflow-x-auto">
    <table class="min-w-full text-sm">
      <thead>
        <tr class="border-b">
          <th class="px-4 py-2 text-left font-semibold">
            {{ t('organizer.teamManagement.name') }}
          </th>
          <th class="px-4 py-2 text-left font-semibold">
            {{ t('organizer.teamManagement.members') }}
          </th>
          <th class="px-4 py-2 text-left font-semibold">
            {{ t('organizer.teamManagement.themeAndSubject') }}
          </th>
          <th class="px-4 py-2 text-center font-semibold">
            {{ t('organizer.teamManagement.constraints.label') }}
          </th>
          <th class="px-4 py-2 text-center font-semibold">
            {{ t('organizer.teamManagement.status.label') }}
          </th>
          <th class="px-4 py-2 text-center font-semibold">
            {{ t('organizer.teamManagement.actions.label') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="team in paginatedTeams" :key="team.id" class="border-b">
          <td class="px-4 py-2">{{ team.name }}</td>
          <td class="px-4 py-2">
            <div v-for="member in team.members" :key="member.id">
              {{ member.firstname }} {{ member.lastname }}
            </div>
            <div v-for="mentor in team.mentors" :key="mentor.id">
              {{ mentor.firstname }} {{ mentor.lastname }} ({{ t('roles.mentor') }})
            </div>
            <div v-for="jury in team.juries" :key="jury.id">
              {{ jury.firstname }} {{ jury.lastname }} ({{ t('roles.jury') }})
            </div>
          </td>
          <td class="px-4 py-2">
            {{ themes.find((theme) => theme.id === team.themeId)?.name || '' }}
            -
            <br />
            {{
              themes
                .find((theme) => theme.id === team.themeId)
                ?.subjects.find((subject) => subject.id === team.subjectId)?.name || ''
            }}
          </td>
          <td class="px-4 py-2 text-center">
            {{ team.juries.length === 0 ? t('none') : team.juries.length }}
          </td>
          <td class="px-4 py-2 text-center">
            {{ t(`organizer.teamManagement.status.${team.status}`) }}
          </td>
          <td class="px-4 py-2 text-center">
            <div class="flex justify-center items-center gap-3">
              <!-- Lock / Unlock -->
              <v-btn
                icon
                size="small"
                :color="team.status === TeamStatus.LOCKED ? 'red' : 'primary'"
                @click="emit('toggle-lock', team)"
                :title="
                  team.status === TeamStatus.LOCKED
                    ? t('organizer.teamManagement.actions.unlock')
                    : t('organizer.teamManagement.actions.lock')
                "
              >
                <v-icon>
                  {{ team.status === TeamStatus.LOCKED ? 'mdi-lock' : 'mdi-lock-open-outline' }}
                </v-icon>
              </v-btn>

              <!-- Edit -->
              <v-btn
                icon
                size="small"
                color="info"
                @click="emit('edit', team)"
                :title="t('common.edit')"
                :disabled="team.status === TeamStatus.LOCKED"
              >
                <v-icon>mdi-pencil-outline</v-icon>
              </v-btn>

              <!-- Ignore Constraints -->
              <v-btn
                icon
                size="small"
                color="orange"
                @click="emit('toggle-constraints', team)"
                :title="t('organizer.teamManagement.actions.ignoreConstraints')"
                :disabled="team.status === TeamStatus.LOCKED"
              >
                <v-icon>mdi-shield-off-outline</v-icon>
              </v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-6">
    <v-btn
      icon="mdi-chevron-left"
      :disabled="currentPage === 1"
      @click="goToPage(currentPage - 1)"
    ></v-btn>
    <v-btn
      v-for="n in totalPages"
      :key="n"
      :variant="n === currentPage ? 'flat' : 'text'"
      color="primary"
      @click="goToPage(n)"
    >
      {{ n }}
    </v-btn>
    <v-btn
      icon="mdi-chevron-right"
      :disabled="currentPage === totalPages"
      @click="goToPage(currentPage + 1)"
    ></v-btn>
  </div>
</template>
