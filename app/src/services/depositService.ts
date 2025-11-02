import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { DepositDTO } from '@/types/deposit'

function getAuthHeaders() {
  const authStore = useAuthStore()
  if (!authStore.user?.accessToken) {
    throw new Error('User is not authenticated')
  }
  return {
    Authorization: `Bearer ${authStore.user.accessToken}`,
  }
}

export const depositService = {
  async getbyTeamId(teamId: string): Promise<DepositDTO[]> {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/deposit?teamId=${teamId}`, { headers: getAuthHeaders() })
    return res.data
  },

  async create(teamId: string): Promise<DepositDTO> {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/deposit`, { teamId }, { headers: getAuthHeaders() })
    return res.data
  },
}
