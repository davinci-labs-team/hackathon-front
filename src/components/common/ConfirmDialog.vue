<script setup lang="ts">
  const props = defineProps<{
    modelValue: boolean
    title: string
    text: string
    secondaryText?: string
    confirmLabel?: string
    cancelLabel?: string
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'confirm'): void
    (e: 'cancel'): void
  }>()

  const close = () => {
    emit('update:modelValue', false)
    emit('cancel')
  }

  const confirm = () => {
    emit('confirm')
    emit('update:modelValue', false)
  }
</script>

<template>
  <v-dialog v-model="props.modelValue" max-width="500">
    <v-card>
      <v-card-title class="text-lg font-bold">
        {{ title }}
      </v-card-title>
      <v-card-text>
        {{ text }}
        <div v-if="secondaryText" class="mt-4 font-medium">
          {{ secondaryText }}
        </div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text @click="close">
          {{ cancelLabel || 'Annuler' }}
        </v-btn>
        <v-btn color="red" @click="confirm">
          {{ confirmLabel || 'Supprimer' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
