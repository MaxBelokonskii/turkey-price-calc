<script setup lang="ts">
import { useMultiDay } from '@/composables/useMultiDay'

const { numberOfDays, activeDayIndex, switchDay } = useMultiDay()

function handleDaysChange(event: Event) {
  const target = event.target as HTMLInputElement
  numberOfDays.value = Number(target.value)
}
</script>

<template>
  <div class="mb-4 animate-fade-in">
    <!-- Number of days -->
    <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-istanbul-navy/5 shadow-sm">
      <div class="flex items-center gap-4">
        <label class="text-sm font-medium text-istanbul-navy/70 whitespace-nowrap">
          Дней в поездке
        </label>
        <input
          type="range"
          min="1"
          max="30"
          :value="numberOfDays"
          class="flex-1"
          :style="{ '--fill': ((numberOfDays - 1) / 29 * 100) + '%' }"
          @input="handleDaysChange"
        />
        <span class="text-lg font-bold text-istanbul-terracotta min-w-[2ch] text-center">
          {{ numberOfDays }}
        </span>
      </div>

      <!-- Day tabs -->
      <div
        v-if="numberOfDays > 1"
        class="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
      >
        <button
          v-for="i in numberOfDays"
          :key="i"
          class="flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
          :class="
            activeDayIndex === i - 1
              ? 'bg-istanbul-terracotta text-white shadow-md'
              : 'bg-istanbul-navy/5 text-istanbul-navy/60 hover:bg-istanbul-navy/10'
          "
          @click="switchDay(i - 1)"
        >
          День {{ i }}
        </button>
      </div>
    </div>
  </div>
</template>
