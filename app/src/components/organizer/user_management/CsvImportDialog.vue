<script setup lang="ts">
  import { nextTick, ref } from 'vue'
  import { csvParse } from 'd3-dsv'
  import { UserDTO } from '@/types/user'
  import { UserRole } from '@/types/roles'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const emailRule = (v: string) => /.+@.+\..+/.test(v)

  interface Row {
    firstname: string
    lastname: string
    email: string
    role: UserRole
    school: string
  }

  const pagination = ref({ page: 1, itemsPerPage: 10 })

  const props = defineProps<{addUser: (user: UserDTO) => void}>()
  const emit = defineEmits<{(e: 'close'): void}>()

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
      csvPreview.value = csvParse<keyof Row>(text) as Row[]
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
      if (!user.firstname || !user.lastname || !user.email || !user.role) {
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
    return !user.firstname || !user.lastname || !emailRule(user.email) || !Object.values(UserRole).includes(user.role)
  }

  // Add new empty row
  const addEmptyRow = () => {
    csvPreview.value.push({
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
  const removeRow = (index: number) => {
    csvPreview.value.splice(index, 1)
  }

  // Add all valid users
  const addAllUsers = () => {
    checkValidity() // Check validity before adding
    if (validationErrors.value.length > 0) return
    csvPreview.value.forEach(user => props.addUser(user as UserDTO))
    csvPreview.value = []
    csvLoaded.value = false
    showDialog.value = false
    emit('close')
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
              <tr :class="{'bg-red-100': isRowInvalid(item)}">
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
                  <v-btn icon @click="removeRow(index)">
                    <v-icon>mdi-delete</v-icon>
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
