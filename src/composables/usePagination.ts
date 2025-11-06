import { ref, computed } from 'vue'

export function usePagination<T>(items: T[], itemsPerPageDefault = 10) {
  const itemsPerPage = ref(itemsPerPageDefault)
  const currentPage = ref(1)

  const totalPages = computed(() => Math.ceil(items.length / itemsPerPage.value))

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return items.slice(start, start + itemsPerPage.value)
  })

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  return {
    itemsPerPage,
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
  }
}
