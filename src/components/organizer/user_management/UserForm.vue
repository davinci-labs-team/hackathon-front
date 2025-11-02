<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import type { UserDTO } from '@/types/user'

  const { t } = useI18n()

  // -----------------------------
  // Props & Emits
  // -----------------------------
  const props = defineProps<{
    modelValue: boolean
    editMode?: boolean
    user?: UserDTO | null
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'save', user: UserDTO): void
  }>()

  // -----------------------------
  // Dialog state
  // -----------------------------
  const localModelValue = ref(props.modelValue)
  watch(
    () => props.modelValue,
    (val) => (localModelValue.value = val)
  )
  watch(localModelValue, (val) => emit('update:modelValue', val))

  // -----------------------------
  // Form state
  // -----------------------------
  const firstname = ref('')
  const lastname = ref('')
  const email = ref('')
  const role = ref('')
  const school = ref('')

  // TODO: récupérer dynamiquement les écoles
  const schools = [{ title: 'Polytech' }, { title: 'INSA' }]

  // -----------------------------
  // Validation
  // -----------------------------
  const required = (v: string | null | undefined) => !!v || t('common.fieldRequired')
  const emailRule = (v: string) => /.+@.+\..+/.test(v) || t('common.invalidEmail')

  // -----------------------------
  // Form actions
  // -----------------------------
  const resetForm = () => {
    firstname.value = ''
    lastname.value = ''
    email.value = ''
    role.value = 'PARTICIPANT'
    school.value = ''
  }

  const close = () => {
    localModelValue.value = false
    resetForm()
  }

  // -----------------------------
  // Save user (via backend => TODO)
  // -----------------------------
  const save = async () => {
    if (
      !firstname.value ||
      !lastname.value ||
      !email.value ||
      !role.value ||
      (role.value === 'PARTICIPANT' && !school.value)
    )
      return

    // Création de FormData pour envoyer au backend
    const userData = {
      id: props.user?.id,
      firstname: firstname.value,
      lastname: lastname.value,
      email: email.value,
      role: role.value,
      school: school.value,
    } as UserDTO

    emit('save', userData)
    close()
  }

  // -----------------------------
  // Initialize form when dialog opens
  // -----------------------------
  watch(
    localModelValue,
    (open) => {
      if (!open) return
      if (props.editMode && props.user) {
        firstname.value = props.user.firstname
        lastname.value = props.user.lastname
        email.value = props.user.email
        role.value = props.user.role
        school.value = props.user.school ?? ''
      } else {
        resetForm()
      }
    },
    { immediate: true }
  )
</script>

<template>
  <v-dialog v-model="localModelValue" max-width="800">
    <v-card>
      <v-card-title class="text-lg font-bold px-6 pt-6">
        {{ props.editMode ? t('users.editUser') : t('users.addUser') }}
        <v-btn icon class="absolute top-2 right-2" @click="close" aria-label="Close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="save">
          <label class="block mb-1 text-m">{{ t('organizer.userManagement.name') }}</label>
          <div class="flex gap-8">
            <v-text-field
              v-model="firstname"
              :placeholder="t('users.firstname')"
              :rules="[required]"
              required
              variant="solo"
              class="mb-4"
            />

            <v-text-field
              v-model="lastname"
              :placeholder="t('users.lastname')"
              :rules="[required]"
              required
              variant="solo"
              class="mb-4"
            />
          </div>

          <label class="block mb-1 text-m">{{ t('organizer.userManagement.email') }}</label>
          <v-text-field
            v-model="email"
            :rules="[required, emailRule]"
            required
            variant="solo"
            class="mb-4"
          />

          <label class="block mb-1 text-m">{{ t('organizer.userManagement.role') }}</label>
          <v-radio-group v-model="role" :rules="[required]" row class="mb-4">
            <div class="grid grid-cols-2 gap-x-1">
              <div><v-radio :label="t('roles.participant')" value="PARTICIPANT" /></div>
              <div><v-radio :label="t('roles.mentor')" value="MENTOR" /></div>
              <div><v-radio :label="t('roles.jury')" value="JURY" /></div>
              <div><v-radio :label="t('roles.organizer')" value="ORGANIZER" /></div>
            </div>
          </v-radio-group>

          <!-- TODO: Get the right naming for this field -->
          <label class="block mb-1 text-m">{{ t('users.school') }}</label>
          <template v-if="role === 'PARTICIPANT'">
            <v-select
              v-model="school"
              :items="schools"
              :rules="[required]"
              required
              variant="solo"
              density="comfortable"
              class="w-full mb-8"
            />
          </template>
          <template v-else>
            <v-text-field
              v-model="school"
              :placeholder="t('users.school')"
              variant="solo"
              class="mb-4"
            />
          </template>

          <v-card-actions class="justify-center">
            <v-btn color="primary" type="submit" variant="elevated" class="px-8 mb-3">
              {{ props.editMode ? t('common.edit') : t('common.create') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
