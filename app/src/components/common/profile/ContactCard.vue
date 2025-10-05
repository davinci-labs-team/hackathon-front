<script setup lang="ts">
import { ref, watch } from 'vue'
import type { UserDTO } from '@/types/user'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useI18n } from 'vue-i18n';
import { loginDiscord } from '@/services/oauthService';
import { useAuthStore } from '@/stores/auth';

const { t } = useI18n()

const props = defineProps<{ user: UserDTO; editMode: boolean, adminPlatform: boolean }>()
const emit = defineEmits<{ (e: 'update:user', value: UserDTO): void }>()

const localUser = ref<UserDTO>({ ...props.user })

const loginWithDiscord = async () => {
  await loginDiscord(props.adminPlatform, localUser.value.id!)
}

// Réinitialiser localUser si parent change
watch(() => props.user, val => localUser.value = { ...val }, { deep: true })

// Expose méthode save
const saveChanges = () => emit('update:user', { ...localUser.value })
const resetLocalUser = () => {
  localUser.value = { ...props.user }
}
defineExpose({ saveChanges, resetLocalUser })
</script>

<template>
  <v-card class="pa-6 mb-6 full-height-card" outlined>
    <v-card-title class="text-h5 font-weight-bold mb-6 d-flex align-center">
      {{ t('profile.contacts') }}
    </v-card-title>
    <v-card-text class="flex-grow-1">
      <v-row dense>
        <!-- Email -->
        <v-col cols="12" class="d-flex align-center mb-2" v-if="localUser.email">
          <v-icon size="x-large" class="mr-4 mb-4">mdi-email</v-icon>
          <div v-if="!props.editMode">{{ localUser.email }}</div>
          <v-text-field v-else v-model="localUser.email" placeholder="Email" variant="solo"/>
        </v-col>

        <!-- GitHub -->
        <v-col cols="12" class="d-flex align-center mb-2" v-if="localUser.github">
          <v-icon size="x-large" class="mr-4 mb-4">mdi-github</v-icon>
          <div v-if="!props.editMode">{{ localUser.github }}</div>
          <v-text-field v-else v-model="localUser.github" placeholder="GitHub" variant="solo"/>
        </v-col>

        <!-- Discord -->
        <v-col cols="12" class="d-flex align-center mb-2">
          <v-btn base-color="purple"
            :disabled="!!localUser.discord"
            @click="loginWithDiscord">
            <v-icon size="large" class="mr-4">
            <FontAwesomeIcon icon="fa-brands fa-discord" />
          </v-icon>
            {{ localUser.discord ? localUser.discord : t('profile.connectDiscord') }}
          </v-btn>
        </v-col>

        <!-- LinkedIn -->
        <v-col cols="12" class="d-flex align-center mb-2" v-if="localUser.linkedin">
          <v-icon size="x-large" class="mr-4 mb-4">mdi-linkedin</v-icon>
          <div v-if="!props.editMode">{{ localUser.linkedin }}</div>
          <v-text-field v-else v-model="localUser.linkedin" placeholder="LinkedIn" variant="solo"/>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.full-height-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.v-card-text.flex-grow-1 {
  flex-grow: 1;
}
</style>
