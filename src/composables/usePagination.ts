import { ref, computed, watch, type Ref } from 'vue'

export function usePagination<T>(items: T[] | Ref<T[]>, itemsPerPageDefault = 10) {
  const itemsPerPage = ref(itemsPerPageDefault)
  const currentPage = ref(1)

  const itemsRef = computed(() => (Array.isArray(items) ? items : items.value))

  const totalPages = computed(() =>
    Math.ceil(itemsRef.value.length / itemsPerPage.value)
  )

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return itemsRef.value.slice(start, start + itemsPerPage.value)
  })

  watch(itemsRef, () => {
    currentPage.value = 1
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
