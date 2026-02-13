<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TCategory, TSelections } from '@/types'
import { useCurrency } from '@/composables/useCurrency'
import { useCalculator } from '@/composables/useCalculator'
import SliderControl from './SliderControl.vue'
import CheckboxItem from './CheckboxItem.vue'
import AddItemForm from './AddItemForm.vue'

const props = defineProps<{
  category: TCategory
  selections: TSelections
  categoryTotal: number
  delay: number
  disabled: boolean
}>()

const emit = defineEmits<{
  toggleCategory: []
}>()

const { formatPrice } = useCurrency()
const { addCustomItem, removeCustomItem, getCustomItemsForCategory } = useCalculator()

const customItems = getCustomItemsForCategory(props.category.id)
const isFormShown = ref(false)

const animationDelay = computed(() => `${props.delay * 100}ms`)

function handleCheckboxChange(itemId: string, value: boolean) {
  props.selections[itemId].enabled = value
}

function handleSliderChange(itemId: string, value: number) {
  props.selections[itemId].value = value
}

function isSliderVisible(itemId: string): boolean {
  if (itemId === 'transport-taxi-rides') {
    return props.selections['transport-taxi']?.enabled ?? false
  }
  return true
}

function handleAddItem(label: string, priceUsd: number) {
  addCustomItem(props.category.id, label, priceUsd)
  isFormShown.value = false
}

function handleRemoveItem(itemId: string) {
  removeCustomItem(itemId)
}
</script>

<template>
  <div
    class="category-card bg-white rounded-2xl p-5 shadow-sm border opacity-0 animate-slide-up transition-all duration-300"
    :class="disabled ? 'border-istanbul-navy/5 opacity-60 grayscale' : 'border-istanbul-navy/5'"
    :style="{ animationDelay }"
  >
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <span class="text-2xl">{{ category.icon }}</span>
        <h3 class="font-bold text-lg text-istanbul-navy">{{ category.title }}</h3>
      </div>
      <div class="flex items-center gap-2">
        <span
          class="text-sm font-bold px-3 py-1 rounded-full transition-all duration-300"
          :class="disabled ? 'text-istanbul-navy/30 bg-istanbul-navy/5' : 'text-istanbul-terracotta bg-istanbul-terracotta/10'"
        >
          {{ disabled ? formatPrice(0) : formatPrice(categoryTotal) }}
        </span>
        <button
          class="w-10 h-6 rounded-full relative transition-colors duration-200 flex-shrink-0 cursor-pointer"
          :class="disabled ? 'bg-istanbul-navy/15' : 'bg-istanbul-terracotta'"
          @click="emit('toggleCategory')"
        >
          <span
            class="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
            :class="disabled ? 'left-0.5' : 'translate-x-4 left-0.5'"
          />
        </button>
      </div>
    </div>

    <div
      class="space-y-1 transition-all duration-300 overflow-hidden"
      :class="disabled ? 'max-h-0 opacity-0' : 'max-h-[2000px] opacity-100'"
    >
      <template v-for="item in category.items" :key="item.id">
        <div v-if="item.type === 'slider' && isSliderVisible(item.id)" class="py-2">
          <SliderControl
            :model-value="selections[item.id]?.value ?? 0"
            :min="item.min ?? 0"
            :max="item.options ? item.options.length - 1 : (item.max ?? 100)"
            :step="item.step ?? 1"
            :label="item.label"
            :options="item.options"
            :unit="item.unit"
            @update:model-value="handleSliderChange(item.id, $event)"
          />
        </div>
        <CheckboxItem
          v-else-if="item.type === 'checkbox'"
          :model-value="selections[item.id]?.enabled ?? false"
          :label="item.label"
          :price-usd="item.priceUsd"
          @update:model-value="handleCheckboxChange(item.id, $event)"
        />
      </template>

      <!-- Custom items -->
      <div
        v-for="ci in customItems"
        :key="ci.id"
        class="flex items-center gap-1"
      >
        <div class="flex-1 min-w-0">
          <CheckboxItem
            :model-value="selections[ci.id]?.enabled ?? false"
            :label="ci.label"
            :price-usd="ci.priceUsd"
            @update:model-value="handleCheckboxChange(ci.id, $event)"
          />
        </div>
        <button
          class="text-istanbul-navy/25 hover:text-istanbul-terracotta transition-colors cursor-pointer text-base leading-none px-1 flex-shrink-0"
          @click="handleRemoveItem(ci.id)"
        >
          &times;
        </button>
      </div>

      <!-- Add custom item -->
      <AddItemForm
        v-if="isFormShown"
        @add="handleAddItem"
        @cancel="isFormShown = false"
      />
      <button
        v-else
        class="flex items-center gap-1.5 px-3 py-1.5 text-sm text-istanbul-navy/40 hover:text-istanbul-terracotta transition-colors cursor-pointer"
        @click="isFormShown = true"
      >
        <span class="text-base leading-none">+</span>
        <span>Добавить пункт</span>
      </button>
    </div>
  </div>
</template>
