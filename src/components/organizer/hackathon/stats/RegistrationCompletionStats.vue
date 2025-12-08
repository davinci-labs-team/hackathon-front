<script setup lang="ts">
  import { useUser } from '@/composables/useUser'
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { UserRole } from '@/types/roles'

  const { t } = useI18n()

  defineProps<{
    phaseName: string
  }>()

  const { users } = useUser()

  console.log(users)

  const completedCount = computed(() => {
    return users.value.filter(
      (user) =>
        user.role === UserRole.PARTICIPANT &&
        user.discord !== null &&
        user.github !== null &&
        user.interests !== null &&
        user.bio !== null
    ).length
  })

  const totalCount = computed(
    () => users.value.filter((user) => user.role === UserRole.PARTICIPANT).length
  )

  const completionPercentage = computed(() => {
    if (totalCount.value === 0) {
      return 0
    }
    return Math.round((completedCount.value / totalCount.value) * 100)
  })
</script>

<template>
  <v-card variant="flat">
    <v-card-title class="text-title-2 pb-0">
      {{ phaseName }}
    </v-card-title>

    <v-card-text>
      <div class="d-flex align-baseline text-h3 font-weight-bold mb-4">
        <span class="mr-2">{{ completedCount }}</span>

        <span class="text-subtitle-1 font-weight-regular text-medium-emphasis">
          / {{ totalCount }}
        </span>
      </div>

      <v-progress-linear
        :model-value="completionPercentage"
        height="10"
        rounded
        color="blue-darken-2"
        class="mb-2"
      ></v-progress-linear>

      <div class="text-caption text-medium-emphasis">
        {{ completionPercentage }}% {{ t('hackathonManagement.stats.completed.profileCompletion') }}
      </div>
    </v-card-text>
  </v-card>
</template>
