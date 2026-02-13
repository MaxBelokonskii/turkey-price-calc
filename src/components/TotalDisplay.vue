<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useCurrency } from '@/composables/useCurrency'

const props = defineProps<{
  total: number
  numberOfDays?: number
  grandTotal?: number
  activeDayIndex?: number
}>()

const { convert, symbol } = useCurrency()

const displayNumber = ref(0)
const displayGrandTotal = ref(0)
const isPulsing = ref(false)
let animationFrame: number | null = null
let grandTotalAnimFrame: number | null = null

function animateNumber(
  from: number,
  to: number,
  target: { value: number },
  frameRef: { value: number | null },
  duration = 400,
) {
  if (frameRef.value) cancelAnimationFrame(frameRef.value)

  const start = performance.now()

  function tick(now: number) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    target.value = Math.round(from + (to - from) * eased)

    if (progress < 1) {
      frameRef.value = requestAnimationFrame(tick)
    }
  }

  frameRef.value = requestAnimationFrame(tick)
}

const animFrameRef = { get value() { return animationFrame }, set value(v) { animationFrame = v } }
const grandFrameRef = { get value() { return grandTotalAnimFrame }, set value(v) { grandTotalAnimFrame = v } }

watch(
  () => convert(props.total),
  (newVal, oldVal) => {
    animateNumber(oldVal ?? 0, newVal, displayNumber, animFrameRef)
    isPulsing.value = true
    setTimeout(() => {
      isPulsing.value = false
    }, 400)
  },
)

watch(
  () => props.grandTotal != null ? convert(props.grandTotal) : 0,
  (newVal, oldVal) => {
    if (props.numberOfDays && props.numberOfDays > 1) {
      animateNumber(oldVal ?? 0, newVal, displayGrandTotal, grandFrameRef)
    }
  },
)

onMounted(() => {
  displayNumber.value = Math.round(convert(props.total))
  if (props.grandTotal != null) {
    displayGrandTotal.value = Math.round(convert(props.grandTotal))
  }
})

const isMultiDay = () => (props.numberOfDays ?? 1) > 1
</script>

<template>
  <div
    class="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-t border-istanbul-navy/10 shadow-[0_-4px_30px_rgba(26,39,68,0.1)]"
  >
    <div class="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
      <div>
        <div class="text-xs font-medium text-istanbul-navy/50 uppercase tracking-wider">
          {{ isMultiDay() ? `День ${(activeDayIndex ?? 0) + 1}` : 'Итого за день' }}
        </div>
        <div
          class="text-3xl font-extrabold bg-gradient-to-r from-istanbul-terracotta to-istanbul-gold bg-clip-text text-transparent transition-transform duration-300"
          :class="{ 'total-pulse': isPulsing }"
        >
          {{ symbol }}{{ displayNumber.toLocaleString() }}
        </div>
      </div>
      <div class="text-right">
        <template v-if="isMultiDay()">
          <div class="text-xs text-istanbul-navy/40">
            Поездка ({{ numberOfDays }} дн.)
          </div>
          <div class="text-lg font-bold text-istanbul-navy/70">
            {{ symbol }}{{ displayGrandTotal.toLocaleString() }}
          </div>
        </template>
        <template v-else>
          <div class="text-xs text-istanbul-navy/40">
            ~ {{ symbol }}{{ Math.round(convert(total) * 7).toLocaleString() }} / нед
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
