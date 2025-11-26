import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import type { ExpertTeamsResponse, UserDTO, UserReducedDTO } from '@/types/user'

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

  async getAllReduced(): Promise<UserReducedDTO[]> {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/reduced`, {
      headers: getAuthHeaders(),
    })
    return res.data
  },

  async getById(userId: string): Promise<UserDTO> {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/${userId}`,
      { headers: getAuthHeaders() })
    return res.data
  },

  async getExpertTeamsById(userId: string): Promise<ExpertTeamsResponse> {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/${userId}/expertTeams`,
      { headers: getAuthHeaders() })
    return res.data
  },

  async remove(userId: string): Promise<UserDTO> {
    const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/user/${userId}`, {
      headers: getAuthHeaders(),
    })
    return res.data
  },

  async create(userData: Partial<UserDTO>): Promise<UserDTO> {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user`, userData, {
      headers: getAuthHeaders(),
    })
    return res.data
  },

  async update(userId: string, userData: Partial<UserDTO>): Promise<UserDTO> {
    const res = await axios.patch(`${import.meta.env.VITE_API_URL}/api/user/${userId}`, userData, {
      headers: getAuthHeaders(),
    })
    return res.data
  },

  async inviteUser(userId: string): Promise<void> {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/user/invite/${userId}`, {}, {
      headers: getAuthHeaders(),
    })
  },

  async requestPasswordReset(email: string): Promise<void> {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/user/requestPasswordReset`, { email })
  },

  async resetPassword(email: string, token: string, newPassword: string): Promise<void> {
    await axios.put(`${import.meta.env.VITE_API_URL}/api/user/resetPassword`, {
      email,
      token,
      newPassword,
    })
  },
}
