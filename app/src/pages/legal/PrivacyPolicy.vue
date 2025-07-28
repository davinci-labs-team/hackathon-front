<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <v-container class="py-12 max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">
      {{ t('privacy.title') || 'Privacy Policy' }}
    </h1>
    <p class="mb-4">
      {{ t('privacy.intro') || 'We value your privacy and are committed to protecting your personal information.' }}
    </p>

    <h2 class="text-xl font-semibold mt-6 mb-2">
      {{ t('privacy.section1') || '1. Information We Collect' }}
    </h2>
    <p>
      {{ t('privacy.section1_text') || 'We collect information necessary for the proper functioning of our services.' }}
    </p>

    <h2 class="text-xl font-semibold mt-6 mb-2">
      {{ t('privacy.section2') || '2. How We Use Information' }}
    </h2>
    <p>
      {{ t('privacy.section2_text') || 'Your data is used to improve our services and ensure a better user experience.' }}
    </p>

    <h2 class="text-xl font-semibold mt-6 mb-2">
      {{ t('privacy.section3') || '3. Data Security' }}
    </h2>
    <p>
      {{ t('privacy.section3_text') || 'We implement strict security measures to protect your personal data.' }}
    </p>
  </v-container>
</template>
