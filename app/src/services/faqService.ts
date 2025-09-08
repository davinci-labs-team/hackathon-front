import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import type { FAQItemDTO, CreateFaqDto, UpdateFaqDto } from '@/types/faq'

function getAuthHeaders() {
  const authStore = useAuthStore()
  if (!authStore.user?.accessToken) {
    throw new Error('User is not authenticated')
  }
  return {
    Authorization: `Bearer ${authStore.user.accessToken}`,
  }
}

export const faqService = {
  async getAll(): Promise<FAQItemDTO[]> {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/faq`)
    return res.data
  },

  async getById(faqId: string): Promise<FAQItemDTO> {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/faq/${faqId}`)
    return res.data
  },

  async create(createFaqDto: CreateFaqDto): Promise<FAQItemDTO> {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/faq`, createFaqDto, {
      headers: getAuthHeaders(),
    })
    return res.data
  },

  async update(faqId: string, updateFaqDto: UpdateFaqDto): Promise<FAQItemDTO> {
    const res = await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/faq/${faqId}`,
      updateFaqDto,
      {
        headers: getAuthHeaders(),
      }
    )
    return res.data
  },

  async remove(faqId: string): Promise<FAQItemDTO> {
    const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/faq/${faqId}`, {
      headers: getAuthHeaders(),
    })
    return res.data
  },
}
