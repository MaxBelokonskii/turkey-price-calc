<script setup lang="ts">
import { useMultiDay } from '@/composables/useMultiDay'
import { useCurrency } from '@/composables/useCurrency'

const { allDaysSummary, grandTotal } = useMultiDay()
const { formatPrice } = useCurrency()
</script>

<template>
  <div class="mt-4 mb-4 bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-istanbul-navy/5 shadow-sm animate-fade-in">
    <h3 class="text-sm font-semibold text-istanbul-navy/70 uppercase tracking-wider mb-3">
      Сводка по поездке
    </h3>

    <div class="space-y-2">
      <div
        v-for="day in allDaysSummary"
        :key="day.dayIndex"
        class="flex items-center justify-between text-sm"
      >
        <span class="text-istanbul-navy/60">День {{ day.dayIndex + 1 }}</span>
        <span class="font-medium text-istanbul-navy">{{ formatPrice(day.total) }}</span>
      </div>
    </div>

    <div class="mt-3 pt-3 border-t border-istanbul-navy/10 flex items-center justify-between">
      <span class="font-semibold text-istanbul-navy">Итого за поездку</span>
      <span class="text-lg font-bold bg-gradient-to-r from-istanbul-terracotta to-istanbul-gold bg-clip-text text-transparent">
        {{ formatPrice(grandTotal) }}
      </span>
    </div>
  </div>
</template>
