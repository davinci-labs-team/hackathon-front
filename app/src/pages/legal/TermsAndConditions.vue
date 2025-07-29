<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
</script>

<template>
  <v-container class="py-12 max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">
      {{ t('terms.title') || 'Terms and Conditions' }}
    </h1>
    <p class="mb-4">
      {{
        t('terms.intro') ||
        'Welcome to our application. By using our services, you agree to the following terms and conditions.'
      }}
    </p>
    <h2 class="text-xl font-semibold mt-6 mb-2">
      {{ t('terms.section1') || '1. Acceptance of Terms' }}
    </h2>
    <p>
      {{
        t('terms.section1_text') ||
        'By accessing our application, you agree to comply with these terms.'
      }}
    </p>

    <h2 class="text-xl font-semibold mt-6 mb-2">
      {{ t('terms.section2') || '2. Use of Service' }}
    </h2>
    <p>
      {{
        t('terms.section2_text') ||
        'You may not use the service for illegal purposes or in a way that causes harm.'
      }}
    </p>

    <h2 class="text-xl font-semibold mt-6 mb-2">
      {{ t('terms.section3') || '3. Modifications' }}
    </h2>
    <p>
      {{ t('terms.section3_text') || 'We reserve the right to modify these terms at any time.' }}
    </p>
  </v-container>
</template>
