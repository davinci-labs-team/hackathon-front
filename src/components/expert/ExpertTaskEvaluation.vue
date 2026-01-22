<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed, ref, onMounted, watch } from 'vue'
  import { TaskKey } from '@/types/hackathon_phase'
  import { useAuthStore } from '@/stores/auth'
  import { useTeamStore } from '@/stores/teamStore'
  import { storeToRefs } from 'pinia'
  import { submissionService } from '@/services/submissionService'
  import { SubmissionDTO } from '@/types/submission'

  const { t, tm } = useI18n()

  // Stores
  const authStore = useAuthStore()
  const { user } = storeToRefs(authStore)
  const teamStore = useTeamStore()
  const { teams, loading: loadingTeams } = storeToRefs(teamStore)

  const submissions = ref<SubmissionDTO[]>([])
  const isLoadingSubmissions = ref(false)

  const taskData = computed(() => {
    return tm(`dashboard.expert.${TaskKey.EVALUATE_PROJECTS}`) as
      | { title: string; description: string; [key: string]: any }
      | undefined
  })

  const juryTeams = computed(() => {
    if (!user.value?.id || !teams.value) return []
    return teams.value.filter((team) => team.juries?.some((jury) => jury.id === user.value?.id))
  })

  const fetchJurySubmissions = async () => {
    if (juryTeams.value.length === 0) return

    isLoadingSubmissions.value = true
    try {
      const promises = juryTeams.value.map((team) => submissionService.getbyTeamId(team.id))
      const results = await Promise.all(promises)

      submissions.value = results.filter((s): s is SubmissionDTO => !!s)
    } catch (error) {
      console.error('Erreur lors de la récupération des soumissions:', error)
    } finally {
      isLoadingSubmissions.value = false
    }
  }

  const isCompleted = computed(() => {
    if (juryTeams.value.length === 0) return false
    if (submissions.value.length < juryTeams.value.length) return false

    return submissions.value.every((sub) => {
      return sub.evaluations?.some((evaluation) => evaluation.juryId === user.value?.id)
    })
  })

  watch(
    juryTeams,
    async (newTeams) => {
      if (newTeams.length > 0 && submissions.value.length === 0) {
        await fetchJurySubmissions()
      }
    },
    { immediate: true }
  )

  onMounted(async () => {
    await teamStore.fetchTeams()
  })
</script>

<template>
  <div>
    <div class="mb-4 flex justify-between items-center">
      <h3 class="text-h6 d-flex align-center">
        <v-icon :color="isCompleted ? 'success' : 'warning'" class="mr-2">
          {{ isCompleted ? 'mdi-check-circle' : 'mdi-alert-circle' }}
        </v-icon>
        {{ taskData?.title || t('dashboard.expert.evaluate_projects.title') }}
      </h3>

      <v-chip label :color="isCompleted ? 'success' : 'warning'" class="mb-4">
        <v-icon size="small" class="mr-1">
          {{ isCompleted ? 'mdi-check' : 'mdi-clock-outline' }}
        </v-icon>
        {{ isCompleted ? t('common.completed') : t('common.pending') }}
      </v-chip>
    </div>

    <v-progress-linear
      v-if="loadingTeams || isLoadingSubmissions"
      indeterminate
      color="primary"
      class="mb-4"
    ></v-progress-linear>

    <div v-else-if="juryTeams.length > 0">
      <div class="mb-4 flex justify-between items-center">
        <p>
          {{ taskData?.description || t('dashboard.expert.evaluate_projects.description') }}
        </p>
        {{ submissions.filter((s) => s.evaluations?.some((e) => e.juryId === user?.id)).length }}
        / {{ juryTeams.length }} {{ t('dashboard.expert.evaluate_projects.count') }}
      </div>
    </div>
  </div>
</template>
