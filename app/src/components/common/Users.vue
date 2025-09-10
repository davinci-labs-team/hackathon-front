<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { UserDTO } from '@/types/user'

  const { t } = useI18n()

  const props = defineProps<{
    users: UserDTO[]
    itemsPerPage?: number
  }>()
  defineEmits(['edit', 'lock', 'delete'])

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
</script>

<template>
  <div class="bg-white border rounded-lg overflow-x-auto">
    <table class="min-w-full text-sm">
      <thead>
        <tr class="border-b">
          <th class="px-4 py-2 text-left font-semibold">{{ t('organizer.userManagement.name') }}</th>
          <th class="px-4 py-2 text-left font-semibold">{{ t('organizer.userManagement.email') }}</th>
          <th class="px-4 py-2 text-left font-semibold">{{ t('organizer.userManagement.role') }}</th>
          <th class="px-4 py-2 text-left font-semibold">{{ t('organizer.userManagement.school') }}</th>
          <th class="px-4 py-2 text-center font-semibold">{{ t('organizer.userManagement.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in paginatedUsers" :key="user.id" class="border-b">
          <td class="px-4 py-2">{{ user.firstname + ' ' + user.lastname }}</td>
          <td class="px-4 py-2">{{ user.email }}</td>
          <td class="px-4 py-2">{{ user.role }}</td>
          <td class="px-4 py-2">{{ user.school }}</td>
          <td class="px-4 py-2 text-center">
            <v-icon small class="mr-2" color="primary" @click="$emit('edit', user)">mdi-pencil</v-icon>
            <v-icon small class="mr-2" color="secondary" @click="$emit('lock', user)">mdi-lock</v-icon>
            <v-icon small color="error" @click="$emit('delete', user)">mdi-delete</v-icon>
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
