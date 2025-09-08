import { ref, onMounted } from 'vue'
import type { UserDTO } from '@/types/user'
import { userService } from '@/services/userService'

export function useUser() {
  const users = ref<UserDTO[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchUsers = async () => {
    loading.value = true
    try {
      users.value = await userService.getAll()
    } catch (e: any) {
      error.value = e.message || 'Error fetching users'
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id: string) => {
    try {
      await userService.remove(id)
      users.value = users.value.filter((u) => u.id !== id)
    } catch (e: any) {
      error.value = e.message
    }
  }

  // Charger au montage
  onMounted(fetchUsers)

  return {
    users,
    loading,
    error,
    fetchUsers,
    deleteUser,
  }
}
