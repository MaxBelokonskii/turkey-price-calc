<script setup lang="ts">
import { computed } from 'vue'
import { useCurrency } from '@/composables/useCurrency'

const { currency, currencies, setCurrency } = useCurrency()

const activeIndex = computed(() => currencies.indexOf(currency.value))
</script>

<template>
  <div class="relative flex items-center bg-istanbul-navy/5 rounded-full p-1">
    <div
      class="absolute h-8 w-14 rounded-full bg-gradient-to-r from-istanbul-terracotta to-istanbul-gold transition-transform duration-300 ease-out"
      :style="{ transform: `translateX(${activeIndex * 3.5}rem)` }"
    />
    <button
      v-for="c in currencies"
      :key="c"
      class="relative z-10 w-14 h-8 flex items-center justify-center text-sm font-bold transition-colors duration-300 cursor-pointer"
      :class="currency === c ? 'text-white' : 'text-istanbul-navy/50 hover:text-istanbul-navy/70'"
      @click="setCurrency(c)"
    >
      {{ c }}
    </button>
  </div>
</template>
