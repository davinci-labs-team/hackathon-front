<script setup lang="ts">
    import { useI18n } from 'vue-i18n'
    const { t } = useI18n()
</script>


<template>
    <v-container class="py-10 max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold mb-2">{{ t('communicationSettings.title') }}</h1>
        <p class="mb-10 text-lg text-gray-600">{{ t('communicationSettings.subtitle') }}</p>
    </v-container>
</template>