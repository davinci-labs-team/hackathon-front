import { ref, onMounted } from 'vue'
import type { FAQItemDTO, UpdateFaqDto } from '@/types/faq'
import { faqService } from '@/services/faqService'

export function useFaq() {
  const faqs = ref<FAQItemDTO[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchFaqs = async () => {
    loading.value = true
    try {
      faqs.value = await faqService.getAll()
    } catch (e: any) {
      error.value = e.message || 'Error fetching FAQs'
    } finally {
      loading.value = false
    }
  }

  const createFaq = async (faq: Omit<FAQItemDTO, 'id' | 'createdAt'>) => {
    try {
      const created = await faqService.create(faq)
      faqs.value.push(created)
      return created
    } catch (e: any) {
      error.value = e.message
    }
  }

  const updateFaq = async (id: string, faq: UpdateFaqDto) => {
    try {
      const updated = await faqService.update(id, faq)
      const index = faqs.value.findIndex((f) => f.id === id)
      if (index !== -1) {
        faqs.value[index] = updated
      }
      return updated
    } catch (e: any) {
      error.value = e.message
    }
  }

  const deleteFaq = async (id: string) => {
    try {
      await faqService.remove(id)
      faqs.value = faqs.value.filter((f) => f.id !== id)
    } catch (e: any) {
      error.value = e.message
    }
  }

  // Charger au montage
  onMounted(fetchFaqs)

  return {
    faqs,
    loading,
    error,
    fetchFaqs,
    createFaq,
    updateFaq,
    deleteFaq,
  }
}
