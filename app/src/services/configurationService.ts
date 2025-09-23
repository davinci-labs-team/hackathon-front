import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import {
  ConfigurationResponse,
  UpdateConfigurationDTO,
  CreateConfigurationDTO,
} from '@/types/hackathon'
import { ConfigurationKey } from '@/utils/configuration/configurationKey'
import { defaultConfigurations } from '@/utils/configuration/defaultConfiguration'

function getAuthHeaders() {
  const authStore = useAuthStore()
  if (!authStore.user?.accessToken) {
    throw new Error('User is not authenticated')
  }
  return {
    Authorization: `Bearer ${authStore.user.accessToken}`,
  }
}

export const configurationService = {
  async create(dto: CreateConfigurationDTO): Promise<ConfigurationResponse> {
    const url = `${import.meta.env.VITE_API_URL}/api/configuration`
    const res = await axios.post(url, dto, { headers: getAuthHeaders() })
    return res.data
  },

  async update(key: ConfigurationKey, dto: UpdateConfigurationDTO): Promise<ConfigurationResponse> {
    const url = `${import.meta.env.VITE_API_URL}/api/configuration/${key}`
    const res = await axios.patch(url, dto, { headers: getAuthHeaders() })
    return res.data
  },

  async findOne(key: ConfigurationKey): Promise<ConfigurationResponse> {
    const url = `${import.meta.env.VITE_API_URL}/api/configuration/${key}`
    const res = await axios.get(url, { headers: getAuthHeaders() })
    return res.data
  },
}

export async function getOrCreateConfiguration(key: ConfigurationKey) {
  try {
    const config = await configurationService.findOne(key)
    return config
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      const defaultValue = defaultConfigurations[key]
      const newConfig = await configurationService.create({ key, value: defaultValue })
      return newConfig
    }
    throw error
  }
}
