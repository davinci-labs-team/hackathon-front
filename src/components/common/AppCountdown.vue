<script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed } from 'vue'

  const props = defineProps<{
    deadline: string | null | undefined
  }>()

  const now = ref(new Date().getTime())
  let timer: any = null

  // Calcul des unités de temps
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
  <div v-if="timeLeft && timeLeft.total > 0" class="d-flex gap-4 text-center">
    <div
      v-for="(val, unit) in {
        Jours: timeLeft.days,
        Heures: timeLeft.hours,
        Min: timeLeft.minutes,
        Sec: timeLeft.seconds,
      }"
      :key="unit"
    >
      <div class="text-h4 font-weight-bold">{{ val }}</div>
      <div class="text-caption text-uppercase">{{ unit }}</div>
    </div>
  </div>
  <v-chip v-else-if="timeLeft && timeLeft.total <= 0" color="error" variant="flat">
    Temps écoulé !
  </v-chip>
</template>

<style scoped>
  .gap-4 {
    display: flex;
    gap: 16px;
  }
</style>
