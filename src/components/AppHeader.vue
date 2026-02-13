<script setup lang="ts">
import CurrencyToggle from './CurrencyToggle.vue'
</script>

<template>
  <header class="text-center mb-8 pt-8 opacity-0 animate-fade-in">
    <div class="inline-flex items-center gap-2 mb-3">
      <span class="text-4xl">🇹🇷</span>
    </div>
    <h1 class="text-3xl md:text-4xl font-extrabold text-istanbul-navy mb-2">
      Istanbul
      <span class="bg-gradient-to-r from-istanbul-terracotta to-istanbul-gold bg-clip-text text-transparent">
        Daily Cost
      </span>
      Calculator
    </h1>
    <p class="text-istanbul-navy/50 text-sm max-w-md mx-auto mb-4">
      Рассчитайте стоимость одного дня в Стамбуле. Выберите категории расходов и настройте параметры.
    </p>
    <div class="flex justify-center">
      <CurrencyToggle />
    </div>
  </header>
</template>
