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

export function buildDefaultSelections(customItems: TCustomItem[]): TSelections {
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

export function calculateCategoryTotals(
  sel: TSelections,
  customItemsList: TCustomItem[],
  disabledCats: Record<string, boolean>,
): Record<string, number> {
  const totals: Record<string, number> = {}

  for (const category of categories) {
    if (disabledCats[category.id]) {
      totals[category.id] = 0
      continue
    }

    let catTotal = 0

    if (category.id === 'food') {
      const levelItem = category.items.find((i) => i.id === 'food-level')
      const levelSel = sel['food-level']
      let multiplier = 1
      if (levelItem?.options && levelSel) {
        const idx = Math.round(levelSel.value)
        multiplier = levelItem.options[idx]?.value ?? 1
      }

      for (const item of category.items) {
        if (item.id === 'food-level') continue
        const s = sel[item.id]
        if (s?.enabled && item.type === 'checkbox') {
          catTotal += item.priceUsd * multiplier
        }
      }

      for (const ci of customItemsList) {
        if (ci.categoryId !== 'food') continue
        const s = sel[ci.id]
        if (s?.enabled) {
          catTotal += ci.priceUsd * multiplier
        }
      }
    } else if (category.id === 'transport') {
      for (const item of category.items) {
        const s = sel[item.id]
        if (item.id === 'transport-taxi-rides') continue
        if (item.id === 'transport-taxi') {
          if (s?.enabled) {
            const rides = sel['transport-taxi-rides']?.value ?? 0
            catTotal += rides * item.priceUsd
          }
          continue
        }
        if (s?.enabled && item.type === 'checkbox') {
          catTotal += item.priceUsd
        }
      }

      for (const ci of customItemsList) {
        if (ci.categoryId !== 'transport') continue
        const s = sel[ci.id]
        if (s?.enabled) {
          catTotal += ci.priceUsd
        }
      }
    } else {
      for (const item of category.items) {
        const s = sel[item.id]
        if (!s?.enabled) continue

        if (item.type === 'checkbox') {
          catTotal += item.priceUsd
        } else if (item.type === 'slider') {
          if (item.options) {
            const idx = Math.round(s.value)
            catTotal += item.options[idx]?.value ?? 0
          } else {
            catTotal += s.value
          }
        }
      }

      for (const ci of customItemsList) {
        if (ci.categoryId !== category.id) continue
        const s = sel[ci.id]
        if (s?.enabled) {
          catTotal += ci.priceUsd
        }
      }
    }

    totals[category.id] = catTotal
  }

  return totals
}

const customItems = ref<TCustomItem[]>(loadCustomItems())
const selections = reactive<TSelections>(buildDefaultSelections(customItems.value))
const disabledCategories = reactive<Record<string, boolean>>({})

let persistCustomItems = true

watch(
  customItems,
  (items) => {
    if (persistCustomItems) saveCustomItems(items)
  },
  { deep: true },
)

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
    return calculateCategoryTotals(selections, customItems.value, disabledCategories)
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
    customItems,
    disabledCategories,
    categories,
    categoryTotals,
    total,
    toggleCategory,
    isCategoryDisabled,
    addCustomItem,
    removeCustomItem,
    getCustomItemsForCategory,
    setPersistCustomItems(value: boolean) {
      persistCustomItems = value
    },
  }
}
