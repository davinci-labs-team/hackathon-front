import axios from 'axios'
import {
  ConfigurationResponse,
  UpdateConfigurationDTO,
  CreateConfigurationDTO,
} from '@/types/config'
import { ConfigurationKey } from '@/utils/configuration/configurationKey'
import { defaultConfigurations } from '@/utils/configuration/defaultConfiguration'
import { getAuthHeaders } from '@/stores/auth'

const API_URL = `${import.meta.env.VITE_API_URL}/api/configuration`

export const configurationService = {
  async create(dto: CreateConfigurationDTO): Promise<ConfigurationResponse> {
    const url = `${API_URL}`
    const res = await axios.post(url, dto, { headers: getAuthHeaders() })
    return res.data
  },

  async update(key: ConfigurationKey, dto: UpdateConfigurationDTO): Promise<ConfigurationResponse> {
    const url = `${API_URL}/${key}`
    const res = await axios.patch(url, dto, { headers: getAuthHeaders() })
    return res.data
  },

  async findOne(key: ConfigurationKey): Promise<ConfigurationResponse> {
    const url = `${API_URL}/${key}`
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

export async function getConfiguration(key: ConfigurationKey) {
  try {
    const config = await configurationService.findOne(key)
    return config
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null
    }
    throw error
  }
}
