<script setup lang="ts">
import { ref, watch } from 'vue'
import type { UserDTO } from '@/types/user'
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

const props = defineProps<{ user: UserDTO; editMode: boolean }>()
const emit = defineEmits<{ (e: 'update:user', value: UserDTO): void }>()

const localUser = ref<UserDTO>({ ...props.user })
const newInterest = ref('')

// Re initialize localUser when props.user changes
watch(() => props.user, val => localUser.value = { ...val }, { deep: true })

// Expose méthode save
const saveChanges = () => {
  emit('update:user', {
    id: localUser.value.id,
    firstname: localUser.value.firstname,
    lastname: localUser.value.lastname,
    email: localUser.value.email,
    role: localUser.value.role,
    bio: localUser.value.bio,
    interests: localUser.value.interests
  })
}

const resetLocalUser = () => {
  localUser.value = { ...props.user }
}

const removeInterest = (index: number) => {
  localUser.value.interests?.splice(index, 1)
}

const addInterest = () => {
  if (newInterest.value.trim()) {
    if (!localUser.value.interests) {
      localUser.value.interests = []
    }
    localUser.value.interests.push(newInterest.value.trim())
    newInterest.value = ''
  }
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
          :key="interest"
          color="teal lighten-3"
          class="mr-2 mb-2"
          :closable="props.editMode"
          @click:close="removeInterest(i)"
        >
          {{ interest }}
          <template v-slot:close v-if="props.editMode">
            <v-icon color="red" size="small">mdi-close</v-icon>
          </template>
        </v-chip>

        <div v-if="!localUser.interests || localUser.interests.length === 0">Add interest</div>

        <!-- Champ de saisie avec bouton + pour ajouter un intérêt -->
        <div v-if="props.editMode" class="d-flex align-center mt-2" style="max-width: 350px;">
          <v-text-field
            v-model="newInterest"
            placeholder="Nouvel intérêt"
            density="compact"
            variant="outlined"
            @keyup.enter="addInterest"
            hide-details
          />
          <v-btn
            icon
            color="teal"
            size="small"
            class="ml-2"
            @click="addInterest"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>