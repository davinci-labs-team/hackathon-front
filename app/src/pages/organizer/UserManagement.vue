<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
</script>

<template>
  <v-container>
    <v-row justify="center" class="mt-8">
      <v-col cols="12" md="8" lg="6">
        <h1 class="text-3xl font-bold">{{ t('organizer.nav.users') }}</h1>
      </v-col>
    </v-row>
  </v-container>
</template>
