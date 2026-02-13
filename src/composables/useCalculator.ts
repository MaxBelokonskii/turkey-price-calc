import { reactive, ref, computed, watch } from 'vue'
import type { TSelections, TCustomItem } from '@/types'
import { categories } from '@/data/mockData'

const CUSTOM_ITEMS_KEY = 'istanbul-calc-custom-items'

function loadCustomItems(): TCustomItem[] {
  try {
    const raw = localStorage.getItem(CUSTOM_ITEMS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCustomItems(items: TCustomItem[]) {
  localStorage.setItem(CUSTOM_ITEMS_KEY, JSON.stringify(items))
}

function buildDefaultSelections(customItems: TCustomItem[]): TSelections {
  const selections: TSelections = {}

  for (const category of categories) {
    for (const item of category.items) {
      if (item.type === 'checkbox') {
        selections[item.id] = {
          enabled: item.defaultEnabled ?? false,
          value: item.priceUsd,
        }
      } else if (item.type === 'slider') {
        selections[item.id] = {
          enabled: true,
          value: item.defaultValue ?? item.min ?? 0,
        }
      }
    }
  }

  for (const ci of customItems) {
    selections[ci.id] = {
      enabled: true,
      value: ci.priceUsd,
    }
  }

  return selections
}

const customItems = ref<TCustomItem[]>(loadCustomItems())
const selections = reactive<TSelections>(buildDefaultSelections(customItems.value))
const disabledCategories = reactive<Record<string, boolean>>({})

watch(customItems, (items) => saveCustomItems(items), { deep: true })

export function useCalculator() {
  function addCustomItem(categoryId: string, label: string, priceUsd: number) {
    const id = `custom-${Date.now()}`
    const item: TCustomItem = { id, categoryId, label, priceUsd }
    customItems.value = [...customItems.value, item]
    selections[id] = { enabled: true, value: priceUsd }
  }

  function removeCustomItem(itemId: string) {
    customItems.value = customItems.value.filter((i) => i.id !== itemId)
    delete selections[itemId]
  }

  function getCustomItemsForCategory(categoryId: string) {
    return computed(() => customItems.value.filter((i) => i.categoryId === categoryId))
  }

  const categoryTotals = computed(() => {
    const totals: Record<string, number> = {}

    for (const category of categories) {
      if (disabledCategories[category.id]) {
        totals[category.id] = 0
        continue
      }

      let catTotal = 0

      if (category.id === 'food') {
        // Food: checkbox items * food level multiplier
        const levelItem = category.items.find((i) => i.id === 'food-level')
        const levelSel = selections['food-level']
        let multiplier = 1
        if (levelItem?.options && levelSel) {
          const idx = Math.round(levelSel.value)
          multiplier = levelItem.options[idx]?.value ?? 1
        }

        for (const item of category.items) {
          if (item.id === 'food-level') continue
          const sel = selections[item.id]
          if (sel?.enabled && item.type === 'checkbox') {
            catTotal += item.priceUsd * multiplier
          }
        }

        // Custom items for food — also multiplied
        for (const ci of customItems.value) {
          if (ci.categoryId !== 'food') continue
          const sel = selections[ci.id]
          if (sel?.enabled) {
            catTotal += ci.priceUsd * multiplier
          }
        }
      } else if (category.id === 'transport') {
        // Transport: checkboxes + taxi rides calculation
        for (const item of category.items) {
          const sel = selections[item.id]
          if (item.id === 'transport-taxi-rides') continue
          if (item.id === 'transport-taxi') {
            if (sel?.enabled) {
              const rides = selections['transport-taxi-rides']?.value ?? 0
              catTotal += rides * item.priceUsd
            }
            continue
          }
          if (sel?.enabled && item.type === 'checkbox') {
            catTotal += item.priceUsd
          }
        }

        // Custom items for transport
        for (const ci of customItems.value) {
          if (ci.categoryId !== 'transport') continue
          const sel = selections[ci.id]
          if (sel?.enabled) {
            catTotal += ci.priceUsd
          }
        }
      } else {
        for (const item of category.items) {
          const sel = selections[item.id]
          if (!sel?.enabled) continue

          if (item.type === 'checkbox') {
            catTotal += item.priceUsd
          } else if (item.type === 'slider') {
            if (item.options) {
              // Named options slider (e.g., accommodation level)
              const idx = Math.round(sel.value)
              catTotal += item.options[idx]?.value ?? 0
            } else {
              // Numeric slider (e.g., shopping budget)
              catTotal += sel.value
            }
          }
        }

        // Custom items for other categories
        for (const ci of customItems.value) {
          if (ci.categoryId !== category.id) continue
          const sel = selections[ci.id]
          if (sel?.enabled) {
            catTotal += ci.priceUsd
          }
        }
      }

      totals[category.id] = catTotal
    }

    return totals
  })

  const total = computed(() => {
    return Object.values(categoryTotals.value).reduce((sum, val) => sum + val, 0)
  })

  function toggleCategory(categoryId: string) {
    disabledCategories[categoryId] = !disabledCategories[categoryId]
  }

  function isCategoryDisabled(categoryId: string): boolean {
    return !!disabledCategories[categoryId]
  }

  return {
    selections,
    categories,
    categoryTotals,
    total,
    toggleCategory,
    isCategoryDisabled,
    addCustomItem,
    removeCustomItem,
    getCustomItemsForCategory,
  }
}
