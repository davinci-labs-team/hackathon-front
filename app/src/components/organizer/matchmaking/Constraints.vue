<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { ConstraintDTO } from '@/types/hackathon'
  import ConstraintForm from './ConstraintForm.vue'

  const { t } = useI18n()

  const props = defineProps<{
    constraints: ConstraintDTO[]
    itemsPerPage?: number
    schoolNames?: string[]
  }>()

  defineEmits(['edit', 'delete'])

  const itemsPerPage = props.itemsPerPage || 5
  const currentPage = ref(1)

  const totalPages = computed(() => Math.ceil(props.constraints.length / itemsPerPage))

  // Edit state
  const editedConstraint = ref<(ConstraintDTO & { index?: number }) | null>(null)
  const showEditForm = ref(false)

  const paginatedCriteria = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return props.constraints.slice(start, start + itemsPerPage)
  })

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const formatRule = (criterion: ConstraintDTO) => {
    switch (criterion.rule) {
      case 'MIN':
        return `${t('common.minimum')} ${t('common.people', { count: criterion.value })}`
      case 'MAX':
        return `${t('common.maximum')} ${t('common.people', { count: criterion.value })}`
      case 'EQUAL':
        return `${t('common.equal')} ${t('common.people', { count: criterion.value })}`
      default:
        return ''
    }
  }
</script>

<template>
  <div class="bg-white border rounded-lg overflow-x-auto">
    <table class="min-w-full text-sm">
      <thead>
        <tr class="border-b">
          <th class="px-4 py-2 text-left font-semibold">
            {{ t('matchmakingSettings.schools') }}
          </th>
          <th class="px-4 py-2 text-left font-semibold">
            {{ t('matchmakingSettings.rule') }}
          </th>
          <th class="px-4 py-2 text-center font-semibold">
            {{ t('common.actions') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(criterion, index) in paginatedCriteria"
          :key="criterion.schools.join('-') + '-' + index"
          class="border-b"
        >
          <td class="px-4 py-2">
            {{ criterion.schools.join(', ') }}
          </td>
          <td class="px-4 py-2">
            {{ formatRule(criterion) }}
          </td>
          <td class="px-4 py-2 text-center">
            <v-btn
              icon="mdi-pencil"
              color="black"
              variant="text"
              size="small"
              @click.stop="
                showEditForm = true; 
                editedConstraint = { ...criterion, index }
              "
            />
            <v-btn
              icon="mdi-delete"
              color="red"
              variant="text"
              size="small"
              @click.stop="$emit('delete', criterion)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-6">
    <v-btn
      icon="mdi-chevron-left"
      :disabled="currentPage === 1"
      @click="goToPage(currentPage - 1)"
    />
    <v-btn
      v-for="n in totalPages"
      :key="n"
      :variant="n === currentPage ? 'flat' : 'text'"
      color="primary"
      @click="goToPage(n)"
    >
      {{ n }}
    </v-btn>
    <v-btn
      icon="mdi-chevron-right"
      :disabled="currentPage === totalPages"
      @click="goToPage(currentPage + 1)"
    />
  </div>

  <ConstraintForm
    v-model="showEditForm"
    :edit-mode="true"
    :constraint="editedConstraint"
    :school-names="props.schoolNames"
    @save="(updatedCriterion) => $emit('edit', editedConstraint?.index, updatedCriterion)"
  />
</template>
