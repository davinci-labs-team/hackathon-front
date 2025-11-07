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

  const { t } = useI18n()

  const loadingSubmissions = ref<boolean>(false)

  // Data
  const mentors = ref<UserReducedDTO[]>([])
  const juries = ref<UserReducedDTO[]>([])
  const submissions = ref<SubmissionDTO[]>([])

  // Filters
  const filterName = ref<string>('')
  const submissionStatus = ref<SubmissionStatus | ''>('')
  const selectedJury = ref<string>('')
  const selectedMentor = ref<string>('')

  // Fetch
  const fetchUsers = async () => {
    const response = await userService.getAllReduced()
    if (response) {
      mentors.value = response.filter((u) => u.role === UserRole.MENTOR)
      juries.value = response.filter((u) => u.role === UserRole.JURY)
    }
  }

  // Filter submissions
  const filteredSubmissions = computed(() => {
    filterSubmissions(
      submissions.value,
      submissionStatus.value,
      selectedJury.value,
      selectedMentor.value,
      filterName.value
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
  </v-container>
</template>
