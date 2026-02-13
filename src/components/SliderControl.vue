<script setup lang="ts">
import { computed } from 'vue'
import type { TSliderOption } from '@/types'
import { useCurrency } from '@/composables/useCurrency'

const props = defineProps<{
  modelValue: number
  min: number
  max: number
  step: number
  label: string
  options?: TSliderOption[]
  unit?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const { formatPrice } = useCurrency()

const fillPercent = computed(() => {
  const range = props.max - props.min
  if (range === 0) return '0%'
  return `${((props.modelValue - props.min) / range) * 100}%`
})

const displayValue = computed(() => {
  if (props.options) {
    const idx = Math.round(props.modelValue)
    return props.options[idx]?.label ?? ''
  }
  if (props.unit === '$') {
    return formatPrice(props.modelValue)
  }
  return `${props.modelValue} ${props.unit ?? ''}`
})

const displayPrice = computed(() => {
  if (props.options) {
    const idx = Math.round(props.modelValue)
    const opt = props.options[idx]
    return opt ? formatPrice(opt.value) : ''
  }
  return ''
})

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', Number(target.value))
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-istanbul-navy/70">{{ label }}</span>
      <div class="flex items-center gap-2">
        <span class="text-sm font-semibold text-istanbul-terracotta transition-all duration-300">
          {{ displayValue }}
        </span>
        <span
          v-if="displayPrice"
          class="text-xs font-medium text-istanbul-gold bg-istanbul-gold/10 px-2 py-0.5 rounded-full transition-all duration-300"
        >
          {{ displayPrice }}
        </span>
      </div>
    </div>
    <input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      :style="{ '--fill': fillPercent }"
      @input="handleInput"
    />
    <div v-if="options" class="flex justify-between">
      <span
        v-for="(opt, idx) in options"
        :key="idx"
        class="text-[10px] text-istanbul-navy/40 transition-colors duration-200"
        :class="{ '!text-istanbul-terracotta font-medium': Math.round(modelValue) === idx }"
      >
        {{ opt.label }}
      </span>
    </div>
  </div>
</template>
