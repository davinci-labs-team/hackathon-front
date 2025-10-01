<script setup lang="ts">
import { ref, watch } from 'vue'
import type { UserDTO } from '@/types/user'
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

const props = defineProps<{ user: UserDTO; editMode: boolean }>()
const emit = defineEmits<{ (e: 'update:user', value: UserDTO): void }>()

const localUser = ref<UserDTO>({ ...props.user })

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
    <v-card-title class="text-2xl font-weight-bold mb-6">
      {{ t('profile.personalInfo.title') }}
    </v-card-title>
    <v-card-text>
      <h2 class="text-xl font-bold mb-2">{{ t('profile.personalInfo.bio') }}</h2>
      <v-textarea 
        v-model="localUser.bio" 
        placeholder="Bio" 
        rows="4" 
        v-if="props.editMode" 
        auto-grow
        variant="solo"/>
      <div v-else>{{ localUser.bio || 'No info yet' }}</div>

      <!-- Interests -->
      <h2 class="text-xl font-bold mt-6 mb-2">{{ t('profile.personalInfo.interests') }}</h2>
      <div class="mt-4">
        <v-chip
          v-for="(interest, i) in localUser.interests"
          :key="i"
          color="teal lighten-3"
          class="mr-2 mb-2"
        >
          {{ interest }}
        </v-chip>
        <div v-if="!localUser.interests || localUser.interests.length === 0">Add interest</div>
      </div>
    </v-card-text>
  </v-card>
</template>
