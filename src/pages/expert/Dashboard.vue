<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
  import { getRole, getTPrefix } from '@/utils/user'

  const role = getRole()
  const tPrefix = getTPrefix(role, true)
</script>

<template>
  <v-container>
    <v-row justify="center" class="mt-8">
      <v-col cols="12" md="8" lg="6">
        <h1 class="text-3xl font-bold">{{ t(`jury.dashboard`) }}</h1>
      </v-col>
    </v-row>
  </v-container>
</template>
