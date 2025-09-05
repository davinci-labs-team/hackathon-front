<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import AppSnackbar from '@/components/common/AppSnackbar.vue'
  const { t } = useI18n()

  // TODO: Fetch infos from backend

  const sloganMaxLength = 60
  const hackathonNameMaxLength = 60
  const hackathonDescriptionMaxLength = 500

  const slogan = ref('Build the future with us!')
  const hackathonName = ref('Qubit or not Qubit')
  const hackathonDescription = ref('')

  // Snackbar to inform user of successful save
  const snackbar = ref(false)
  const text = ref(t('common.changesSaved'))
  const timeout = ref(1500)

  // TODO: Save changes to backend if needed
  const handleSave = () => {
    // Implement save logic here
    // Compare with original values to detect changes
    // if (changesDetected) {
    //   // Save to backend
    // }
    // Snackbar to inform user of successful save
    snackbar.value = true
    console.log('Saving changes...')
  }
</script>

<template>
  <v-container class="py-10 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-2">{{ t('textsSettings.title') }}</h1>
    <div class="flex-direction-row mb-5 flex items-center justify-between">
      <p class="mb-0 text-lg text-gray-600">{{ t('textsSettings.subtitle') }}</p>
      <v-btn color="primary" @click="handleSave">{{ t('common.saveChanges') }}</v-btn>
    </div>
    <!-- Content for managing texts will go here -->
    <v-container>
      <p class="mb-2 text-lg text-600">{{ t('textsSettings.hackathonName') }}</p>
      <v-text-field
        v-model="hackathonName"
        :counter="hackathonNameMaxLength"
        :rules="[
          (v: string) =>
            (v && v.length <= hackathonNameMaxLength) ||
            t('textsSettings.errors.maxLength', { max: hackathonNameMaxLength }),
        ]"
        variant="outlined"
        dense
        class="mb-2"
      />

      <p class="mb-2 text-lg text-600">{{ t('textsSettings.slogan') }}</p>
      <v-text-field
        v-model="slogan"
        :counter="sloganMaxLength"
        :rules="[
          (v: string) =>
            (v && v.length <= sloganMaxLength) ||
            t('textsSettings.errors.maxLength', { max: sloganMaxLength }),
        ]"
        variant="outlined"
        dense
        class="mb-2"
      />

      <p class="mb-2 text-lg text-600">{{ t('textsSettings.hackathonDescription') }}</p>
      <v-textarea
        v-model="hackathonDescription"
        :counter="hackathonDescriptionMaxLength"
        :rules="[
          (v: string) =>
            (v && v.length <= hackathonDescriptionMaxLength) ||
            t('textsSettings.errors.maxLength', { max: hackathonDescriptionMaxLength }),
        ]"
        variant="outlined"
        auto-grow
        rows="3"
        class="mb-2"
      />

      <AppSnackbar v-model="snackbar" :message="text" :timeout="timeout"/>

    </v-container>

    <h1 class="text-3xl font-bold mb-2">{{ t('faqSettings.title') }}</h1>
    <div class="flex-direction-row mb-5 flex items-center justify-between">
      <p class="mb-0 text-lg text-gray-600">{{ t('faqSettings.subtitle') }}</p>
      <v-btn color="primary">{{ t('faqSettings.addQuestion') }}</v-btn>
    </div>
    <!-- Content for managing FAQ will go here -->
     <v-container>
        <!-- List of QA cards-->
     </v-container>
  </v-container>
</template>
