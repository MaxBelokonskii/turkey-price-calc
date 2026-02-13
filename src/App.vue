<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import CategoryCard from './components/CategoryCard.vue'
import TotalDisplay from './components/TotalDisplay.vue'
import { useCalculator } from './composables/useCalculator'

const { selections, categories, categoryTotals, total, toggleCategory, isCategoryDisabled } = useCalculator()
</script>

<template>
  <div class="min-h-screen pb-24">
    <div class="max-w-5xl mx-auto px-4">
      <AppHeader />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CategoryCard
          v-for="(category, index) in categories"
          :key="category.id"
          :category="category"
          :selections="selections"
          :category-total="categoryTotals[category.id] ?? 0"
          :delay="index + 1"
          :disabled="isCategoryDisabled(category.id)"
          @toggle-category="toggleCategory(category.id)"
        />
      </div>
    </div>

    <TotalDisplay :total="total" />
  </div>
</template>
