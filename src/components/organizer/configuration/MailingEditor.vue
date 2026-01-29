<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import AppSnackbar from '@/components/common/AppSnackbar.vue'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'
  import { MailingSettingsDTO } from '@/types/mail_templates'
  import { defaultConfigurations } from '@/utils/configuration/defaultConfiguration'
  import { useConfiguration } from '@/composables/useConfiguration'

  import type { VForm } from 'vuetify/components'

  const { t } = useI18n()

  const {
    configuration: mailingConfig,
    loading: mailingLoading,
    error: mailingError,
    updateConfiguration,
  } = useConfiguration(ConfigurationKey.MAILING)


  const configData = ref<MailingSettingsDTO>(
    defaultConfigurations[ConfigurationKey.MAILING] as MailingSettingsDTO
  )

  // Forms references
  const firstConnectionForm = ref<VForm | null>(null)
  const passwordResetForm = ref<VForm | null>(null)

  // Snackbar
  const snackbar = ref(false)
  const snackbarText = ref('')
  const snackbarTimeout = ref(2000)
  const isError = ref(false)

  // Validation rules
  const requiredRule = [(v: string) => !!v || t('common.fieldRequired')]

  // --- Fonctions ---

  const showSnackbar = (message: string, error: boolean = false) => {
    snackbarText.value = message
    isError.value = error
    snackbar.value = true
  }

  const handleSave = async () => {
    const connectionValidation = await firstConnectionForm.value?.validate()
    const resetValidation = await passwordResetForm.value?.validate()

    if (!connectionValidation?.valid || !resetValidation?.valid) {
      showSnackbar(t('mailingSettings.errors.fixErrors'), true)
      return
    }

    try {
      await updateConfiguration({ value: configData.value })

      showSnackbar(t('common.changesSaved'), false)
    } catch (e) {
      console.error('Error saving mailing configuration:', mailingError.value || e)
      showSnackbar(t('common.error'), true)
    }
  }

  watch(
    mailingConfig,
    (newConfig) => {
      if (newConfig && newConfig.value) {
        configData.value = newConfig.value as MailingSettingsDTO

        if (mailingError.value) {
          showSnackbar(t('mailingSettings.error.fetchFailed'), true)
        }
      }
    },
    { immediate: true }
  )
</script>

<template>
  <v-container class="py-10 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-2">{{ t('mailingSettings.title') }}</h1>
    <div class="flex justify-between items-center mb-6">
      <p class="text-lg text-gray-600">{{ t('mailingSettings.subtitle') }}</p>
      <v-btn color="primary" @click="handleSave" :disabled="mailingLoading">
        {{ t('common.saveChanges') }}
      </v-btn>
    </div>

    <v-alert v-if="mailingLoading" type="info" class="mb-4"> {{ t('common.loading') }}... </v-alert>

    <v-container v-else class="pa-0">
      <p class="mb-4 text-xl font-semibold text-gray-800 border-b pb-2 mt-8">
        {{ t('mailingSettings.firstConnection') }} <span class="text-red-500">*</span>
      </p>
      <v-form ref="firstConnectionForm" class="mb-8 space-y-4">
        <p class="text-lg font-medium">
          {{ t('mailingSettings.emailObject') }}
        </p>
        <v-text-field
          v-model="configData.firstConnectionTemplate.object"
          :placeholder="t('mailingSettings.emailObject')"
          :rules="requiredRule"
          required
        />

        <p class="text-lg font-medium">
          {{ t('mailingSettings.emailTitle') }}
        </p>
        <v-text-field
          v-model="configData.firstConnectionTemplate.title"
          :placeholder="t('mailingSettings.emailTitle')"
          :rules="requiredRule"
          required
        />

        <p class="text-lg font-medium">
          {{ t('mailingSettings.introParagraph') }}
        </p>
        <v-textarea
          v-model="configData.firstConnectionTemplate.introParagraph"
          :placeholder="t('mailingSettings.introParagraph')"
          :rules="requiredRule"
          required
        />

        <p class="text-lg font-medium">
          {{ t('mailingSettings.actionPrompt') }}
        </p>
        <v-textarea
          v-model="configData.firstConnectionTemplate.actionPrompt"
          :placeholder="t('mailingSettings.actionPrompt')"
          :rules="requiredRule"
          required
        />

        <p class="text-lg font-medium">
          {{ t('mailingSettings.buttonText') }}
        </p>
        <v-text-field
          v-model="configData.firstConnectionTemplate.buttonText"
          :placeholder="t('mailingSettings.buttonText')"
          :rules="requiredRule"
          required
        />

        <p class="text-lg font-medium">
          {{ t('mailingSettings.closingNote') }}
        </p>
        <v-textarea
          v-model="configData.firstConnectionTemplate.closingNote"
          :placeholder="t('mailingSettings.closingNote')"
          :rules="requiredRule"
          required
        />

        <p class="text-lg font-medium">
          {{ t('mailingSettings.signatureSalutation') }}
        </p>
        <v-text-field
          v-model="configData.firstConnectionTemplate.signatureSalutation"
          :placeholder="t('mailingSettings.signatureSalutation')"
          :rules="requiredRule"
          required
        />

        <p class="text-lg font-medium">
          {{ t('mailingSettings.signatureName') }}
        </p>
        <v-text-field
          v-model="configData.firstConnectionTemplate.signatureName"
          :placeholder="t('mailingSettings.signatureName')"
          :rules="requiredRule"
          required
        />
      </v-form>

      <p class="mb-4 text-xl font-semibold text-gray-800 border-b pb-2 mt-8">
        {{ t('mailingSettings.passwordReset') }} <span class="text-red-500">*</span>
      </p>
      <v-form ref="passwordResetForm" class="mb-8 space-y-4">
        <p class="text-lg font-medium">
          {{ t('mailingSettings.emailObject') }}
        </p>
        <v-text-field
          v-model="configData.passwordResetTemplate.object"
          :placeholder="t('mailingSettings.emailObject')"
          :rules="requiredRule"
          required
        />
        <p class="text-lg font-medium">
          {{ t('mailingSettings.emailTitle') }}
        </p>
        <v-text-field
          v-model="configData.passwordResetTemplate.title"
          :placeholder="t('mailingSettings.emailTitle')"
          :rules="requiredRule"
          required
        />
        <p class="text-lg font-medium">
          {{ t('mailingSettings.introParagraph') }}
        </p>
        <v-textarea
          v-model="configData.passwordResetTemplate.introParagraph"
          :placeholder="t('mailingSettings.introParagraph')"
          :rules="requiredRule"
          required
          rows="2"
        />
        <p class="text-lg font-medium">
          {{ t('mailingSettings.actionPrompt') }}
        </p>
        <v-textarea
          v-model="configData.passwordResetTemplate.actionPrompt"
          :placeholder="t('mailingSettings.actionPrompt')"
          :rules="requiredRule"
          required
          rows="2"
        />
        <p class="text-lg font-medium">
          {{ t('mailingSettings.buttonText') }}
        </p>
        <v-text-field
          v-model="configData.passwordResetTemplate.buttonText"
          :placeholder="t('mailingSettings.buttonText')"
          :rules="requiredRule"
          required
        />
        <p class="text-lg font-medium">
          {{ t('mailingSettings.closingNote') }}
        </p>
        <v-textarea
          v-model="configData.passwordResetTemplate.closingNote"
          :placeholder="t('mailingSettings.closingNote')"
          :rules="requiredRule"
          required
        />
        <p class="text-lg font-medium">
          {{ t('mailingSettings.signatureSalutation') }}
        </p>
        <v-text-field
          v-model="configData.passwordResetTemplate.signatureSalutation"
          :placeholder="t('mailingSettings.signatureSalutation')"
          :rules="requiredRule"
          required
        />
        <p class="text-lg font-medium">
          {{ t('mailingSettings.signatureName') }}
        </p>
        <v-text-field
          v-model="configData.passwordResetTemplate.signatureName"
          :placeholder="t('mailingSettings.signatureName')"
          :rules="requiredRule"
          required
        />
      </v-form>
    </v-container>

    <AppSnackbar
      v-model="snackbar"
      :message="snackbarText"
      :timeout="snackbarTimeout"
      :error="isError"
    />
  </v-container>
</template>

<style scoped>
  textarea {
    resize: vertical;
  }
</style>
