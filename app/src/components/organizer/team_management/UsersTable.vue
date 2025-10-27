<script lang="ts" setup>
  import { UserReducedDTO } from '@/types/user'
  import { ThemesDTO } from '@/types/config'
  import { useI18n } from 'vue-i18n'
  import { ref, computed } from 'vue'

  const { t } = useI18n()

  const props = defineProps<{
    users: UserReducedDTO[]
    themes: ThemesDTO[]
    itemsPerPage?: number
  }>()

  const emit = defineEmits(['assign-team', 'withdraw-team'])

  const itemsPerPage = props.itemsPerPage || 10
  const currentPage = ref(1)

  const totalPages = computed(() => Math.ceil(props.users.length / itemsPerPage))

  const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return props.users.slice(start, start + itemsPerPage)
  })

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const getThemeAndSubject = (subjectId: string) => {
    const theme = props.themes.find((theme) =>
      theme.subjects.some((subject) => subject.id === subjectId)
    )
    if (!theme) return '-'
    const subject = theme.subjects.find((subject) => subject.id === subjectId)
    return subject ? `${theme.name} - \n${subject.name}` : theme.name
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
            {{ t('organizer.teamManagement.role') }}
          </th>
          <th class="px-4 py-2 text-center font-semibold">
            {{ t('organizer.teamManagement.school') }}
          </th>
          <th class="px-4 py-2 text-center font-semibold">
            {{ t('organizer.teamManagement.team') }}
          </th>
          <th class="px-4 py-2 text-center font-semibold">
            <span>{{ t('organizer.teamManagement.themeAndSubject') }}</span>
          </th>
          <th class="px-4 py-2 text-center font-semibold">
            {{ t('organizer.teamManagement.actions.label') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in paginatedUsers" :key="user.id" class="border-b">
          <td class="px-4 py-2">{{ user.firstname }} {{ user.lastname }}</td>
          <td class="px-4 py-2">{{ t(`roles.${user.role.toLowerCase()}`) }}</td>
          <td class="px-4 py-2 text-center">{{ user.school ?? '-' }}</td>
          <td class="px-4 py-2 text-center">
            <span v-if="user.teamId">{{ user.team?.name }}</span>
            <v-icon
              v-else
              color="warning"
              icon="mdi-alert"
              variant="text"
              size="large"
              :title="t('organizer.teamManagement.noTeamAssigned')"
            ></v-icon>
          </td>
          <td class="px-4 py-2 text-center">
            {{ user.favoriteSubjectId ? getThemeAndSubject(user.favoriteSubjectId) : '-' }}
          </td>
          <td class="px-4 py-2 text-center">
            <div class="flex flex-col justify-center items-center gap-2">
              <v-btn v-if="!user.teamId" color="primary" small @click="$emit('assign-team', user)">
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
