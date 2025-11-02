<script setup lang="ts">
  import { FAQItemDTO } from '@/types/faq'

  const props = defineProps<{
    faqItem: FAQItemDTO
  }>()

  const emit = defineEmits<{
    (e: 'click', faqItem: FAQItemDTO): void
    (e: 'delete', faqItem: FAQItemDTO): void
  }>()

  const handleClick = () => {
    emit('click', props.faqItem)
  }

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation()
    emit('delete', props.faqItem)
  }
</script>

<template>
  <div class="flex items-stretch gap-2 w-full">
    <!-- Card prend toute la largeur -->
    <v-card
      class="faqItem-card flex-1 mb-4 p-4 flex flex-col md:flex-row gap-4"
      @click="handleClick"
    >
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <h3 class="text-lg font-bold">{{ faqItem.question }}</h3>
          <v-icon v-if="faqItem.isPrivate" color="black" size="18">mdi-lock</v-icon>
        </div>
        <p class="mt-3 text-gray-700 line-clamp-2">
          {{ faqItem.answer }}
        </p>
      </div>
    </v-card>

    <!-- Bouton delete -->
    <v-btn icon="mdi-delete" color="red" variant="text" size="small" @click.stop="handleDelete" />
  </div>
</template>

<style scoped>
  .faqItem-card:hover {
    box-shadow: 0 6px 18px rgb(0 0 0 / 0.15);
    cursor: pointer;
  }
</style>
