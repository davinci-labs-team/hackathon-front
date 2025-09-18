import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { SettingResponse, UpdateSettingDTO } from '@/types/hackathon'

function getAuthHeaders() {
  const authStore = useAuthStore()
  if (!authStore.user?.accessToken) {
    throw new Error('User is not authenticated')
  }
  return {
    Authorization: `Bearer ${authStore.user.accessToken}`,
  }
}

export const settingsService = {
  async update(
    id: string,
    updateDto: UpdateSettingDTO,
    supabaseUserId?: string
  ): Promise<SettingResponse> {
    const url =
      `${import.meta.env.VITE_API_URL}/api/settings/${id}` +
      (supabaseUserId ? `?supabaseUserId=${supabaseUserId}` : '')
    const res = await axios.patch(url, updateDto, { headers: getAuthHeaders() })
    return res.data
  },

  async findWithKey(key?: string): Promise<any> {
    const url = `${import.meta.env.VITE_API_URL}/api/settings/` + (key ? `?key=${key}` : '')
    const res = await axios.get(url, { headers: getAuthHeaders() })
    return res.data
  },
}
