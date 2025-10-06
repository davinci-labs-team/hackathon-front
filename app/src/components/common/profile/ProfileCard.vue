<script setup lang="ts">
import { defineProps, ref, watch } from 'vue'
import type { UserDTO } from '@/types/user'
import { useI18n } from 'vue-i18n';
import { S3BucketService } from '@/services/s3BucketService'
import { UserRole } from '@/types/roles';

const { t } = useI18n()

const props = defineProps<{
  user: UserDTO
  profilePicture: string
  editMode: boolean
}>()
const emit = defineEmits<{ (e: 'update:user', value: UserDTO): void }>()

const localUser = ref<UserDTO>({ ...props.user })
const preview = ref(props.profilePicture)
const fileInput = ref<HTMLInputElement>()
const fileInputRef = ref<File | null>(null)

// Réinitialiser localUser si parent change
watch(() => props, (val) => {
  localUser.value = { ...val.user }
  preview.value = val.profilePicture
}, { deep: true })

// Expose méthode save
const saveChanges = async () => {
  let path = localUser.value.profilePicturePath
  if (fileInputRef.value) {
    path = (await S3BucketService.uploadFile(fileInputRef.value)).path
  }
  emit('update:user', { 
      id: localUser.value.id, 
      firstname: localUser.value.firstname, 
      lastname: localUser.value.lastname, 
      email: localUser.value.email, 
      role: localUser.value.role, 
      school: localUser.value.school,
      profilePicturePath: path })
}

const resetLocalUser = () => {
  console.log('Resetting local user')
  localUser.value = { ...props.user }
}
defineExpose({ saveChanges, resetLocalUser })

const onFileChange = async (e: Event) => {
  console.log('File input changed')

  const target = e.target as HTMLInputElement
  let file = target.files?.[0]
  if (!file) return

  // Prévisualisation locale
  preview.value = URL.createObjectURL(file)
  fileInputRef.value = file
}

const role = props.user.role ? props.user.role.toLowerCase() : 'participant'
</script>

<template>
  <v-card class="pa-6 mb-6" outlined>
    <v-row justify="space-between">
      <v-col cols="10" md="4" class="d-flex align-center ml-4 gap-4">
        <div class="avatar-container">
          <v-avatar size="200" class="mr-4 elevation-1">
            <v-img :src="preview" />
          </v-avatar>

          <v-icon
            v-if="props.editMode"
            class="edit-icon"
            color="primary"
            @click="fileInput?.click()"
          >
            mdi-upload
          </v-icon>

          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            class="d-none"
            @change="onFileChange"
          />
        </div>

        <div>
          <div class="user-name">{{ user.firstname }} {{ user.lastname }}</div>
          <div class="user-role">
            {{ t(`roles.${role}`) }}
          </div>
          <v-textarea 
            v-model="localUser.school" 
            placeholder="School" 
            rows="1" 
            v-if="props.editMode && localUser.role !== UserRole.PARTICIPANT" 
            auto-grow
            variant="solo"/>
          <div v-else>{{ localUser.school || 'No info yet' }}</div>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
.avatar-container {
  position: relative;
  display: inline-block;
}

.edit-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
  background-color: white;
  border-radius: 50%;
  padding: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.edit-icon:hover {
  transform: scale(1.1);
}

.user-name { font-size: 2rem; font-weight: bold; }
.user-role { font-size: 1.4rem; color: gray; }
.user-school { font-size: 1.4rem; margin-top: 1rem; }
</style>
