<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Users from '@/components/common/Users.vue'
  import { useUser } from '@/composables/useUser'
  import UserForm from '@/components/organizer/user_management/UserForm.vue'
  import { UserDTO } from '@/types/user'
  import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
  import CsvImportDialog from '@/components/organizer/user_management/CsvImportDialog.vue'
  import { configurationService } from '@/services/configurationService'
  import { ConfigurationKey } from '@/utils/configuration/configurationKey'
  import { PartnersDTO } from '@/types/config'
  import { userService } from '@/services/userService'
  import AppSnackbar from '@/components/common/AppSnackbar.vue'

  const { t } = useI18n()

  const { users, createUser, updateUser, deleteUser } = useUser()

  const roles = computed(() => [
    { title: t('organizer.userManagement.roleAll'), value: '' },
    { title: t('roles.organizer'), value: 'ORGANIZER' },
    { title: t('roles.jury'), value: 'JURY' },
    { title: t('roles.mentor'), value: 'MENTOR' },
    { title: t('roles.participant'), value: 'PARTICIPANT' },
  ])

  const schools = ref<{ title: string; value: string }[]>([
    { title: t('organizer.userManagement.schoolAll'), value: '' },
  ])

  const fetchSchools = async () => {
    const response = await configurationService.findOne(ConfigurationKey.PARTNERS)
    if (response?.value?.partners && Array.isArray(response.value.partners)) {
      const partners: PartnersDTO[] = response.value.partners
      schools.value.push(
        ...partners.map((partner) => ({
          title: partner.name,
          value: partner.name,
        }))
      )
    }
  }

  const selectedRole = ref('')
  const selectedSchool = ref('')
  const filterName = ref('')

  // Snackbar
  const snackbar = ref(false)
  const text = ref('')
  const timeout = ref(1500)
  const error = ref(false)

  const showSnackbar = (message: string, isError = false) => {
    text.value = message
    error.value = isError
    snackbar.value = true
  }

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
      updateUser(user.id, user).then(() => {
        showUserForm.value = false
        selectedUser.value = null
        showSnackbar(t('organizer.userManagement.userUpdated'), false)
      }).catch((error) => {
        console.error('Error updating user:', error)
        showSnackbar(t('organizer.userManagement.userUpdateFailed'), true)
      })
    } else {
      createUser(user).then(() => {
        showUserForm.value = false
        selectedUser.value = null
        showSnackbar(t('organizer.userManagement.userCreated'), false)
      }).catch((error) => {
        console.error('Error creating user:', error)
        showSnackbar(t('organizer.userManagement.userCreateFailed'), true)
      })
    }
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

  const selectedUserIds = ref<string[]>([])

  const onInviteUser = async (user: UserDTO) => {
    try {
      await userService.inviteUser(user.id)
      showSnackbar(t('organizer.userManagement.userInvited'), false)
      const updatedUser = { ...user, invitationSent: true }
      updateUser(user.id, updatedUser)
    } catch (error) {
      console.error('Error inviting user:', error)
      showSnackbar(t('organizer.userManagement.userInviteFailed'), true)
    }
  }

  const onSelectionChange = (ids: string[]) => {
    selectedUserIds.value = ids
  }

  const inviteSelected = () => {
    const usersToInvite = users.value.filter((u) => selectedUserIds.value.includes(u.id))
    usersToInvite.forEach((u) => onInviteUser(u))
  }

  const deleteSelected = () => {
    const usersToDelete = users.value.filter((u) => selectedUserIds.value.includes(u.id))
    usersToDelete.forEach((u) => onDeleteUser(u))
    selectedUserIds.value = []
    showSnackbar(t('organizer.userManagement.usersDeleted', { count: usersToDelete.length }), false)
  }

  onMounted(() => {
    fetchSchools()
  })

  const schoolsList = computed(() =>
    schools.value.map((school) => school.value).filter((value) => value !== '')
  )
</script>

<template>
  <v-container>
    <v-row justify="center" class="mt-8">
      <div class="w-full md:w-8/12 lg:w-9/12 px-4">
        <div class="flex w-full justify-between items-center mb-6">
          <h1 class="text-3xl font-bold">{{ t('organizer.nav.users') }}</h1>
          <div class="flex">
            <CsvImportDialog :addUser="createUser" @toast="showSnackbar"/>
            <v-btn color="primary" class="h-full" @click="onAddUser">
              {{ t('organizer.userManagement.addButton') }}
            </v-btn>
          </div>
        </div>
        <div class="mb-6 p-4 border rounded-lg shadow-sm">
          <div class="flex gap-8">
            <div class="flex-1">
              <label class="block mb-2 text-sm font-medium">
                {{ t('organizer.userManagement.role') }}
              </label>
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
              <label class="block mb-2 text-sm font-medium">
                {{ t('organizer.userManagement.school') }}
              </label>
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
              <label class="block mb-2 text-sm font-medium">
                {{ t('organizer.userManagement.name') }}
              </label>
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

        <div class="flex gap-2 mb-4">
          <div class="flex gap-2">
            <v-btn color="secondary" @click="inviteSelected">
              {{ t('organizer.userManagement.inviteSelected', { count: selectedUserIds.length }) }}
            </v-btn>
            <v-btn color="error" @click="deleteSelected">
              {{ t('organizer.userManagement.deleteSelected', { count: selectedUserIds.length }) }}
            </v-btn>
          </div>
        </div>

        <Users
          :users="filteredUsers"
          :items-per-page="30"
          @delete="confirmDelete"
          @edit="onEditUser"
          @invite="onInviteUser"
          @selection-change="onSelectionChange"
        />

        <AppSnackbar v-model="snackbar" :message="text" :timeout="timeout" :error="error" />

        <UserForm
          v-model="showUserForm"
          @save="handleSave"
          :edit-mode="editMode"
          :user="selectedUser"
          :schools="schoolsList"
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
