<script setup lang="ts">
import { useCurrency } from '@/composables/useCurrency'

defineProps<{
  modelValue: boolean
  label: string
  priceUsd: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { formatPrice } = useCurrency()

function handleToggle(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>

<template>
  <label
    class="flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 group"
    :class="modelValue ? 'bg-istanbul-terracotta/5' : 'hover:bg-istanbul-cream-dark/50'"
  >
    <div class="flex items-center gap-3">
      <div class="relative">
        <input
          type="checkbox"
          :checked="modelValue"
          class="sr-only peer"
          @change="handleToggle"
        />
        <div
          class="w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center
                 border-istanbul-navy/20 peer-checked:border-istanbul-terracotta peer-checked:bg-istanbul-terracotta"
        >
          <svg
            class="w-3 h-3 text-white transition-all duration-200"
            :class="modelValue ? 'opacity-100 scale-100' : 'opacity-0 scale-50'"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="3"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <span
        class="text-sm transition-colors duration-200"
        :class="modelValue ? 'text-istanbul-navy font-medium' : 'text-istanbul-navy/60'"
      >
        {{ label }}
      </span>
    </div>
    <span
      class="text-sm font-semibold transition-all duration-300"
      :class="modelValue ? 'text-istanbul-terracotta' : 'text-istanbul-navy/30'"
    >
      {{ formatPrice(priceUsd) }}
    </span>
  </label>
</template>
