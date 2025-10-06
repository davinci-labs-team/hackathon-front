<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { UserDTO } from '@/types/user'

  const { t } = useI18n()

  const props = defineProps<{
    users: UserDTO[]
    itemsPerPage?: number
  }>()
  const emit = defineEmits(['edit', 'invite', 'delete', 'selection-change'])

  const itemsPerPage = props.itemsPerPage || 5
  const currentPage = ref(1)

  const totalPages = computed(() => Math.ceil(props.users.length / itemsPerPage))

  const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return props.users.slice(start, start + itemsPerPage)
  })

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const selectedUserIds = ref<string[]>([])
  const allSelected = computed({
    get: () =>
      paginatedUsers.value.length > 0 &&
      paginatedUsers.value.every((u) => selectedUserIds.value.includes(u.id)),
    set: (val: boolean) => {
      if (val) {
        selectedUserIds.value = paginatedUsers.value.map((u) => u.id)
      } else {
        selectedUserIds.value = []
      }
    },
  })

  const toggleSelectAll = () => {
    if (allSelected.value) {
      selectedUserIds.value = []
    } else {
      selectedUserIds.value = paginatedUsers.value.map((u) => u.id)
    }
  }

  const selectAllPendingInvites = () => {
    selectedUserIds.value = props.users
      .filter((u) => !u.invitationSent)
      .map((u) => u.id)
  }

  watch(selectedUserIds, () => {
    emit('selection-change', selectedUserIds.value)
  })
</script>

<template>
  <v-btn class="mb-4" color="primary" @click="selectAllPendingInvites">
    {{ t('organizer.userManagement.selectAllPending') }}
  </v-btn>

  <div class="bg-white border rounded-lg overflow-x-auto">
    <table class="min-w-full text-sm">
      <thead>
        <tr class="border-b">
          <th class="px-4 py-2">
            <v-checkbox
              v-model="allSelected"
              hide-details
              density="compact"
              @click.stop="toggleSelectAll"
            />
          </th>
          <th class="px-4 py-2 text-left font-semibold">
            {{ t('organizer.userManagement.name') }}
          </th>
          <th class="px-4 py-2 text-left font-semibold">
            {{ t('organizer.userManagement.email') }}
          </th>
          <th class="px-4 py-2 text-left font-semibold">
            {{ t('organizer.userManagement.role') }}
          </th>
          <th class="px-4 py-2 text-left font-semibold">
            {{ t('organizer.userManagement.school') }}
          </th>
          <th class="px-4 py-2 text-center font-semibold">
            {{ t('organizer.userManagement.actions') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in paginatedUsers" :key="user.id" class="border-b">
          <td class="px-4 py-2">
            <v-checkbox
              v-model="selectedUserIds"
              :value="user.id"
              hide-details
              density="compact"
            />
          </td>
          <td class="px-4 py-2">
            {{ t('common.fullname', { firstname: user.firstname, lastname: user.lastname }) }}
          </td>
          <td class="px-4 py-2">{{ user.email }}</td>
          <td class="px-4 py-2">{{ t(`roles.${user.role.toLowerCase()}`) }}</td>
          <td class="px-4 py-2">{{ user.school }}</td>
          <td class="px-4 py-2 text-center flex gap-2 justify-center">
            <v-icon small color="primary" :title="t('common.edit')" @click="$emit('edit', user)">mdi-pencil</v-icon>
            <div v-if="user.invitationSent">
              <v-icon small color="grey-darken-2" :title="t('organizer.userManagement.invite')" @click="$emit('invite', user)">mdi-send-check</v-icon>
            </div>
            <div v-else>
              <v-icon small color="secondary" :title="t('organizer.userManagement.invite')" @click="$emit('invite', user)">mdi-send</v-icon>
            </div>
            <v-icon small color="error" :title="t('common.delete')" @click="$emit('delete', user)">mdi-delete</v-icon>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-6">
    <v-btn
      icon="mdi-chevron-left"
      :disabled="currentPage === 1"
      @click="goToPage(currentPage - 1)"
    ></v-btn>
    <v-btn
      v-for="n in totalPages"
      :key="n"
      :variant="n === currentPage ? 'flat' : 'text'"
      color="primary"
      @click="goToPage(n)"
    >
      {{ n }}
    </v-btn>
    <v-btn
      icon="mdi-chevron-right"
      :disabled="currentPage === totalPages"
      @click="goToPage(currentPage + 1)"
    ></v-btn>
  </div>
</template>
