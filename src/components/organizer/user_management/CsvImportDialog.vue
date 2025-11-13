<script setup lang="ts">
  import { nextTick, ref } from 'vue'
  import { csvParse } from 'd3-dsv'
  import { UserDTO } from '@/types/user'
  import { UserRole } from '@/types/roles'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const emailRule = (v: string) => /.+@.+\..+/.test(v)

  interface Row {
    id: string
    firstname: string
    lastname: string
    email: string
    role: UserRole
    school: string
  }

  const pagination = ref({ page: 1, itemsPerPage: 10 })

  const props = defineProps<{addUser: (user: UserDTO) => void}>()
  const emit = defineEmits<{
    (e: 'close'): void,
    (e: 'toast', message: string, error: boolean): void
  }>()

  const csvPreview = ref<Row[]>([])
  const showDialog = ref(false)
  const csvInput = ref<HTMLInputElement | null>(null)
  const validationErrors = ref<{ index: number; message: string }[]>([])
  const isDragOver = ref(false)
  const csvLoaded = ref(false)

  // CSV file handling
  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const parsed = csvParse<keyof Row>(text) as Omit<Row, 'id'>[]
      csvPreview.value = parsed.map(item => ({ ...item, id: crypto.randomUUID() }))

      checkValidity()
      csvLoaded.value = true
    }
    reader.readAsText(file)
  }

  const onCsvImport = (event: Event) => {
    const files = (event.target as HTMLInputElement).files
    if (files && files[0]) handleFile(files[0])
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    isDragOver.value = false
    if (event.dataTransfer?.files.length) {
      handleFile(event.dataTransfer.files[0])
    }
  }

  const onDragOver = (event: DragEvent) => {
    event.preventDefault()
    isDragOver.value = true
  }

  const onDragLeave = () => {
    isDragOver.value = false
  }

  // TODO: check email unicity and constraints on schools
  // Check validity of each row
  const checkValidity = () => {
    validationErrors.value = []
    csvPreview.value.forEach((user, index) => {
      if (!user.firstname || !user.lastname || !user.email || !user.role || (user.role === UserRole.PARTICIPANT && !user.school)) {
        validationErrors.value.push({index, message: `${t('organizer.userManagement.rowN', { n: index + 1 })}${t('organizer.userManagement.missingRequiredFields')}`})
      }
      if (user.email && !emailRule(user.email)) {
        validationErrors.value.push({index, message: `${t('organizer.userManagement.rowN', { n: index + 1 })}${t('organizer.userManagement.invalidEmail', { email: user.email })}`})
      }
      if (!Object.values(UserRole).includes(user.role)) {
        validationErrors.value.push({index, message: `${t('organizer.userManagement.rowN', { n: index + 1 })}${t('organizer.userManagement.invalidRole', { role: user.role })}`})
      }
    })
  }

  // Check if a row is invalid (for highlighting)
  const isRowInvalid = (user: Row) => {
  return (
    !user.firstname ||
    !user.lastname ||
    !emailRule(user.email) ||
    !Object.values(UserRole).includes(user.role) ||
    (user.role === UserRole.PARTICIPANT && !user.school) ||
    validationErrors.value.some(err => csvPreview.value[err.index].id === user.id)
  )
}


  // Add new empty row
  const addEmptyRow = () => {
    csvPreview.value.push({
      id: crypto.randomUUID(),
      firstname: '',
      lastname: '',
      email: '',
      role: UserRole.PARTICIPANT,
      school: ''
    })

    nextTick(() => {
      goToRow(csvPreview.value.length - 1)
    })
  }

  // Remove a row
  const removeRow = (id: string) => {
    csvPreview.value = csvPreview.value.filter(item => item.id !== id)
  }

  // Add all valid users
  const addAllUsers = async () => {
    checkValidity()
    if (validationErrors.value.length > 0) return

    const failedUsers: Row[] = []
    const newValidationErrors: { index: number; message: string }[] = []
    let successCount = 0

    for (let i = 0; i < csvPreview.value.length; i++) {
      const user = csvPreview.value[i]
      try {
        await props.addUser(user as UserDTO)
        successCount++
      } catch (error: any) {
        failedUsers.push(user)
        newValidationErrors.push({
          index: newValidationErrors.length,
          message: `${t('organizer.userManagement.alreadyExists', {name: `${user.firstname} ${user.lastname}`})}`,
        })
      }
    }

    // Afficher le toast pour les succès
    if (successCount > 0) {
      emit('toast', t('organizer.userManagement.usersCreated', { count: successCount }), false)
    }

    if (failedUsers.length > 0) {
      csvPreview.value = failedUsers
      validationErrors.value = newValidationErrors
      emit('toast', t('organizer.userManagement.usersNotAdded', { count: failedUsers.length }), true)
    } else {
      // tout est ok, fermer le dialog
      csvPreview.value = []
      validationErrors.value = []
      csvLoaded.value = false
      showDialog.value = false
      emit('close')
    }
  }


  // Go to specified row
  const goToRow = (index: number) => {
    const page = Math.ceil((index + 1) / pagination.value.itemsPerPage)
    pagination.value.page = page
  }


  // Cancel import
  const cancelImport = () => {
    showDialog.value = false
    csvPreview.value = []
    validationErrors.value = []
    csvLoaded.value = false
    emit('close')
  }
</script>

<template>
  <v-btn color="secondary" @click="showDialog = true" class="mr-5">{{ t('organizer.userManagement.importButton') }}</v-btn>

  <v-dialog v-model="showDialog" max-width="1200" @click:outside="cancelImport">
    <v-card>
      <v-card-title>{{ t('organizer.userManagement.previewTitle') }}</v-card-title>

      <v-card-text>
        <div v-if="!csvLoaded">
          <div
            class="border border-dashed rounded p-4 text-center mb-4"
            :class="{ 'bg-blue-50': isDragOver }"
            @drop="onDrop"
            @dragover="onDragOver"
            @dragleave="onDragLeave"
          >
            <p>{{ t('organizer.userManagement.dropCsvOrSelect') }}</p>
            <v-btn color="secondary" @click="csvInput?.click()">{{ t('organizer.userManagement.selectFile') }}</v-btn>
            <input ref="csvInput" type="file" accept=".csv" class="hidden" @change="onCsvImport" />
          </div>

          <div class="mb-4 text-sm text-gray-600">
            <strong>{{ t('organizer.userManagement.exampleCsvText') }}</strong>
            <pre class="bg-gray-100 p-2 rounded">{{ t('organizer.userManagement.exampleCsv') }}</pre>
          </div>
        </div>

        <div v-else>
          <v-data-table :items="csvPreview" :headers="[
              { title: t('users.firstname'), key: 'firstname' },
              { title: t('users.lastname'), key: 'lastname' },
              { title: t('organizer.userManagement.email'), key: 'email', width: '300px' },
              { title: t('organizer.userManagement.role'), key: 'role' },
              { title: t('users.school'), key: 'school' },
              { title: '', key: 'actions' }
            ]"
            class="elevation-1"
            v-model:page="pagination.page"
            :items-per-page="pagination.itemsPerPage"
          >
            <template #item="{ item , index }">
              <tr :key="item.id" :class="{'bg-red-100': isRowInvalid(item)}">
                <td>
                  <v-text-field v-model="item.firstname" variant="outlined" density="comfortable" hide-details />
                </td>
                <td>
                  <v-text-field v-model="item.lastname" variant="outlined" density="comfortable" hide-details />
                </td>
                <td>
                  <v-text-field v-model="item.email" variant="outlined" hide-details />
                </td>
                <td>
                  <v-select
                    v-model="item.role"
                    :items="['ORGANIZER','JURY','MENTOR','PARTICIPANT']"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  />
                </td>
                <td>
                  <v-text-field v-model="item.school" variant="outlined" density="comfortable" hide-details />
                </td>
                <td>
                  <v-btn icon @click="removeRow(item.id)">
                    <v-icon :title="t('common.delete')">mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>

          <v-btn color="green" text class="mt-2" @click="addEmptyRow">
            {{ t('organizer.userManagement.addRow') }}
          </v-btn>

          <div v-if="validationErrors.length > 0" class="mt-2 text-red-600">
            <ul>
              <li v-for="(err, i) in validationErrors" :key="i">
                <button class="underline text-red-600" @click="goToRow(err.index)">
                  {{ err.message }}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn color="grey" @click="cancelImport">{{ t('common.cancel') }}</v-btn>
        <v-spacer />
        <v-btn color="blue" variant="outlined" @click="checkValidity" :disabled="!csvLoaded">{{ t('organizer.userManagement.checkValidity') }}</v-btn>
        <v-btn color="primary" variant="flat" @click="addAllUsers" :disabled="!csvLoaded || validationErrors.length > 0">{{ t('organizer.userManagement.addAll') }}</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>
