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

  const createUser = async (userData: Partial<UserDTO>) => {
    try {
      const newUser = await userService.create(userData)
      users.value.push(newUser)
    } catch (e: any) {
      error.value = e.message
      throw e
    }
  }

  const updateUser = async (id: string, userData: Partial<UserDTO>) => {
    try {
      const updatedUser = await userService.update(id, userData)
      const index = users.value.findIndex((u) => u.id === id)
      if (index !== -1) {
        users.value[index] = updatedUser
      }
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
    createUser,
    updateUser,
  }
}
