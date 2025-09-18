<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Users from '@/components/common/Users.vue'
  import { useUser } from '@/composables/useUser'
  import UserForm from '@/components/organizer/user_management/UserForm.vue'
  import { UserDTO } from '@/types/user'
  import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

  const { t } = useI18n()

  const { users, createUser, updateUser, deleteUser } = useUser()

  const roles = computed(() => [
    { title: t('organizer.userManagement.roleAll'), value: '' },
    { title: t('roles.organizer'), value: 'ORGANIZER' },
    { title: t('roles.jury'), value: 'JURY' },
    { title: t('roles.mentor'), value: 'MENTOR' },
    { title: t('roles.participant'), value: 'PARTICIPANT' },
  ])

  // TODO: récupérer dynamiquement les écoles
  const schools = computed(() => [
    { title: t('organizer.userManagement.schoolAll'), value: '' },
    { title: 'Polytech' },
    { title: 'INSA' },
  ])

  const selectedRole = ref('')
  const selectedSchool = ref('')
  const filterName = ref('')

  const showUserForm = ref(false)

  const userToDelete = ref<UserDTO | null>(null)
  const showConfirmDialog = ref(false)

  const editMode = ref(false)

  const filteredUsers = computed(() => {
    return users.value.filter((user) => {
      return (
        (selectedRole.value === '' || user.role === selectedRole.value) &&
        (selectedSchool.value === '' || user.school === selectedSchool.value) &&
        (filterName.value === '' ||
          (user.firstname + ' ' + user.lastname)
            .toLowerCase()
            .includes(filterName.value.toLowerCase()))
      )
    })
  })

  const onAddUser = () => {
    showUserForm.value = true
    editMode.value = false
  }

  const handleSave = (user: UserDTO) => {
    if (editMode.value) {
      updateUser(user.id, user)
    } else {
      createUser(user)
    }
    showUserForm.value = false
    selectedUser.value = null
  }

  const onEditUser = (user: UserDTO) => {
    selectedUser.value = user
    showUserForm.value = true
    editMode.value = true
  }

  const confirmDelete = (user: UserDTO) => {
    userToDelete.value = user
    showConfirmDialog.value = true
  }

  const onDeleteUser = (user: UserDTO) => {
    deleteUser(user.id)
    showConfirmDialog.value = false
    userToDelete.value = null
  }

  const selectedUser = ref<UserDTO | null>(null)
</script>

<template>
  <v-container>
    <v-row justify="center" class="mt-8">
      <div class="w-full md:w-8/12 lg:w-9/12 px-4">
        <div class="flex w-full justify-between items-center mb-6">
          <h1 class="text-3xl font-bold">{{ t('organizer.nav.users') }}</h1>
          <v-btn color="primary" class="h-full" @click="onAddUser">
            {{ t('organizer.userManagement.addButton') }}
          </v-btn>
        </div>
        <div class="mb-6 p-4 border rounded-lg shadow-sm">
          <div class="flex gap-8">
            <div class="flex-1">
              <label class="block mb-1 text-sm font-medium">{{
                t('organizer.userManagement.role')
              }}</label>
              <v-select
                v-model="selectedRole"
                :items="roles"
                variant="solo"
                hide-details
                density="comfortable"
                class="w-full"
              />
            </div>
            <div class="flex-1">
              <label class="block mb-1 text-sm font-medium">{{
                t('organizer.userManagement.school')
              }}</label>
              <v-select
                v-model="selectedSchool"
                :items="schools"
                variant="solo"
                hide-details
                density="comfortable"
                class="w-full"
              />
            </div>
            <div class="flex-1">
              <label class="block mb-1 text-sm font-medium">{{
                t('organizer.userManagement.name')
              }}</label>
              <v-text-field
                v-model="filterName"
                :placeholder="t('organizer.userManagement.namePlaceholder')"
                variant="solo"
                hide-details
                density="comfortable"
                class="w-full"
                clearable
                @click:clear="filterName = ''"
              />
            </div>
          </div>
        </div>

        <Users
          :users="filteredUsers"
          :items-per-page="30"
          @delete="confirmDelete"
          @edit="onEditUser"
        />

        <UserForm
          v-model="showUserForm"
          @save="handleSave"
          :edit-mode="editMode"
          :user="selectedUser"
        />
        <ConfirmDialog
          v-model="showConfirmDialog"
          :title="t('users.confirmTitle')"
          :text="
            t('users.confirmText', {
              firstname: userToDelete?.firstname,
              lastname: userToDelete?.lastname,
            })
          "
          :confirmLabel="t('common.delete')"
          :cancelLabel="t('common.cancel')"
          @confirm="onDeleteUser(userToDelete!)"
          @cancel="userToDelete = null"
        />
      </div>
    </v-row>
  </v-container>
</template>
