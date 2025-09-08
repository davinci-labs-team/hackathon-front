import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import type { UserDTO } from '@/types/user'

function getAuthHeaders() {
  const authStore = useAuthStore()
  if (!authStore.user?.accessToken) {
    throw new Error('User is not authenticated')
  }
  return {
    Authorization: `Bearer ${authStore.user.accessToken}`,
  }
}

export const userService = {
  async getAll(): Promise<UserDTO[]> {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`)
    return res.data
  },

  async getById(userId: string): Promise<UserDTO> {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/${userId}`)
    return res.data
  },

  async remove(userId: string): Promise<UserDTO> {
    const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/user/${userId}`, {
      headers: getAuthHeaders(),
    })
    return res.data
  },
}
