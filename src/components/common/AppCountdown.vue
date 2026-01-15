<script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed } from 'vue'
  import { useI18n } from 'vue-i18n' // Import de i18n

  const { t } = useI18n()

  const props = defineProps<{
    deadline: string | null | undefined
  }>()

  const now = ref(new Date().getTime())
  let timer: any = null

  const timeLeft = computed(() => {
    if (!props.deadline) return null

    const stop = new Date(props.deadline).getTime()
    const diff = stop - now.value

    if (diff <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }

    return {
      total: diff,
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    }
  })

  // Création d'un tableau pour itérer proprement avec les traductions
  const timeUnits = computed(() => [
    { label: t('countdown.days'), value: timeLeft.value?.days },
    { label: t('countdown.hours'), value: timeLeft.value?.hours },
    { label: t('countdown.minutes'), value: timeLeft.value?.minutes },
    { label: t('countdown.seconds'), value: timeLeft.value?.seconds },
  ])

  onMounted(() => {
    timer = setInterval(() => {
      now.value = new Date().getTime()
    }, 1000)
  })

  onUnmounted(() => {
    clearInterval(timer)
  })
</script>

<template>
  <div v-if="timeLeft && timeLeft.total > 0" class="d-flex gap-4 text-center justify-center">
    <div v-for="unit in timeUnits" :key="unit.label">
      <div class="text-h4 font-weight-bold">{{ unit.value }}</div>
      <div class="text-caption text-uppercase text-grey-darken-1">{{ unit.label }}</div>
    </div>
  </div>
  <v-chip v-else-if="timeLeft && timeLeft.total <= 0" color="error" variant="tonal">
    {{ t('countdown.expired') }}
  </v-chip>
</template>

<style scoped>
  .gap-4 {
    display: flex;
    gap: 20px;
  }
</style>
