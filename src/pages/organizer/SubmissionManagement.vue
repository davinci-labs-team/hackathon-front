<script setup lang="ts">
  import { userService } from '@/services/userService'
  import { SubmissionDTO } from '@/types/submission'
  import { SubmissionStatus } from '@/types/submission_status'
  import { computed, onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { UserRole } from '@/types/roles'
  import { UserReducedDTO } from '@/types/user'
  import SubmissionFilters from '@/components/organizer/submission_management/SubmissionFilters.vue'
  import { filterSubmissions } from '@/utils/filterUtils'
  import SubmissionsTable from '@/components/organizer/submission_management/SubmissionsTable.vue'
  import { mockedSubmissions } from '@/tests/data/submissions'
  import { ThemesDTO } from '@/types/config'
import { configurationService } from '@/services/configurationService'
import { ConfigurationKey } from '@/utils/configuration/configurationKey'

  const { t } = useI18n()

  const loadingSubmissions = ref<boolean>(false)

  // Data
  const mentors = ref<UserReducedDTO[]>([])
  const juries = ref<UserReducedDTO[]>([])
  const submissions = ref<SubmissionDTO[]>([])
  const themes = ref<ThemesDTO[]>([])

  // Filters
  const filterName = ref<string>('')
  const submissionStatus = ref<SubmissionStatus | ''>('')
  const selectedJury = ref<string>('')
  const selectedMentor = ref<string>('')

  // ----- FETCH USERS -----
  const fetchUsers = async () => {
    const response = await userService.getAllReduced()
    if (response) {
      mentors.value = response.filter((u) => u.role === UserRole.MENTOR)
      juries.value = response.filter((u) => u.role === UserRole.JURY)
    }
  }

  // ----- FETCH SUBMISSIONS -----
  const fetchSubmissions = async () => {
    loadingSubmissions.value = true
    // Simulate API call
    setTimeout(() => {
      // Here you would normally fetch data from an API
      // For demonstration, we use mocked data
      submissions.value = mockedSubmissions
      loadingSubmissions.value = false
    }, 500)
  }

  const fetchThemes = async () => {
    const response = await configurationService.findOne(ConfigurationKey.THEMES)
    if (response?.value) themes.value = response.value
  }

  // Filter submissions
  const filteredSubmissions = computed(() => {
    return filterSubmissions(
      submissions.value,
      filterName.value,
      submissionStatus.value,
      selectedJury.value,
      selectedMentor.value
    )
  })

  const mentorsList = computed(() =>
    mentors.value.map((m) => ({ title: m.firstname + ' ' + m.lastname, value: m.id }))
  )

  const juriesList = computed(() =>
    juries.value.map((j) => ({ title: j.firstname + ' ' + j.lastname, value: j.id }))
  )

  onMounted(async () => {
    fetchUsers()
    fetchSubmissions()
    fetchThemes()
  })
</script>

<template>
  <v-container>
    <v-row justify="center" class="mt-8">
      <div class="w-full md:w-8/12 lg:w-9/12 px-4">
        <div class="flex w-full justify-between items-center mb-6">
          <h1 class="text-3xl font-bold">{{ t('organizer.submissionManagement.title') }}</h1>
        </div>

        <SubmissionFilters
          v-model:filter-name="filterName"
          v-model:selected-submission-status="submissionStatus"
          v-model:selected-jury="selectedJury"
          v-model:selected-mentor="selectedMentor"
          :mentors-options="mentorsList"
          :juries-options="juriesList"
        />
      </div>
    </v-row>

    <v-row justify="center" class="mb-12">
      <div class="w-full md:w-8/12 lg:w-9/12 px-4">
        <SubmissionsTable
          v-if="!loadingSubmissions && filteredSubmissions.length > 0"
          :themes="themes"
          :submissions="filteredSubmissions"
          :items-per-page="10"
        />

        <div v-else-if="loadingSubmissions" class="text-center py-12">
          <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
        </div>

        <div v-else>
          {{ t('organizer.submissionManagement.noSubmissions') }}
        </div>
      </div>
    </v-row>
  </v-container>
</template>
