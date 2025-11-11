import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { SubmissionDTO, UpdateSubmissionDto } from '@/types/submission'
import { Update } from 'vite'

function getAuthHeaders() {
  const authStore = useAuthStore()
  if (!authStore.user?.accessToken) {
    throw new Error('User is not authenticated')
  }
  return {
    Authorization: `Bearer ${authStore.user.accessToken}`,
  }
}

export const submissionService = {
  async getbyTeamId(teamId: string): Promise<SubmissionDTO | null> {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/submission?teamId=${teamId}`, { headers: getAuthHeaders() })
    return res.data
  },

  async create(teamId: string): Promise<SubmissionDTO> {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/submission`, { teamId }, { headers: getAuthHeaders() })
    return res.data
  },

  async getDueDate(): Promise<Date> {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/submission/due-date`, { headers: getAuthHeaders() })
    return new Date(res.data)
  },

  async update(submission: UpdateSubmissionDto): Promise<SubmissionDTO> {
    const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/submission`, submission, { headers: getAuthHeaders() })
    return res.data
  }
}
