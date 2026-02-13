<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  add: [label: string, priceUsd: number]
  cancel: []
}>()

const label = ref('')
const price = ref<number | undefined>(undefined)

function handleSubmit() {
  const trimmed = label.value.trim()
  if (!trimmed || !price.value || price.value <= 0) return
  emit('add', trimmed, price.value)
  label.value = ''
  price.value = undefined
}
</script>

<template>
  <div class="flex items-center gap-2 px-3 py-2">
    <input
      v-model="label"
      type="text"
      placeholder="Название"
      class="flex-1 min-w-0 text-sm px-2 py-1.5 rounded-lg border border-istanbul-navy/15 bg-white focus:outline-none focus:border-istanbul-terracotta/50 transition-colors"
    />
    <input
      v-model.number="price"
      type="number"
      placeholder="$"
      min="0.01"
      step="0.01"
      class="w-20 text-sm px-2 py-1.5 rounded-lg border border-istanbul-navy/15 bg-white focus:outline-none focus:border-istanbul-terracotta/50 transition-colors"
    />
    <button
      class="text-istanbul-terracotta hover:text-istanbul-terracotta/80 transition-colors cursor-pointer text-lg leading-none px-1"
      @click="handleSubmit"
    >
      &#10003;
    </button>
    <button
      class="text-istanbul-navy/30 hover:text-istanbul-navy/60 transition-colors cursor-pointer text-lg leading-none px-1"
      @click="emit('cancel')"
    >
      &times;
    </button>
  </div>
</template>
