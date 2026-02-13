import { ref, computed, watch, toRaw } from 'vue'
import type { TDayState, TDaySummary } from '@/types'
import type { TSelections } from '@/types'
import { useCalculator, buildDefaultSelections, calculateCategoryTotals } from './useCalculator'

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

function snapshotSelections(selections: TSelections): TSelections {
  const raw: TSelections = {}
  for (const key of Object.keys(selections)) {
    const entry = selections[key]
    raw[key] = { enabled: entry.enabled, value: entry.value }
  }
  return raw
}

function snapshotDisabledCategories(disabled: Record<string, boolean>): Record<string, boolean> {
  const raw: Record<string, boolean> = {}
  for (const key of Object.keys(disabled)) {
    raw[key] = disabled[key]
  }
  return raw
}

const STORAGE_KEY = 'istanbul-calc-multi-day'

const numberOfDays = ref(1)
const activeDayIndex = ref(0)
const dayStates = ref<TDayState[]>([])

let initialized = false

function createDefaultDayState(): TDayState {
  return {
    selections: buildDefaultSelections([]),
    customItems: [],
    disabledCategories: {},
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return

    const data = JSON.parse(raw)
    if (data.numberOfDays && data.dayStates) {
      numberOfDays.value = data.numberOfDays
      activeDayIndex.value = Math.min(data.activeDayIndex ?? 0, data.numberOfDays - 1)
      dayStates.value = data.dayStates
    }
  } catch {
    // ignore
  }
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null

function saveToStorage() {
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        numberOfDays: numberOfDays.value,
        activeDayIndex: activeDayIndex.value,
        dayStates: dayStates.value,
      }),
    )
  }, 300)
}

export function useMultiDay() {
  const { selections, customItems, disabledCategories, setPersistCustomItems } = useCalculator()

  function saveCurrentDay() {
    const snapshot: TDayState = {
      selections: snapshotSelections(selections),
      customItems: deepClone(toRaw(customItems.value)),
      disabledCategories: snapshotDisabledCategories(disabledCategories),
    }

    while (dayStates.value.length <= activeDayIndex.value) {
      dayStates.value.push(createDefaultDayState())
    }

    dayStates.value[activeDayIndex.value] = snapshot
    saveToStorage()
  }

  function loadDay(index: number) {
    const state = dayStates.value[index]
    if (!state) return

    setPersistCustomItems(false)

    // Clear and replace selections
    Object.keys(selections).forEach((k) => delete selections[k])
    Object.assign(selections, deepClone(state.selections))

    // Clear and replace customItems
    customItems.value = deepClone(state.customItems)

    // Clear and replace disabledCategories
    Object.keys(disabledCategories).forEach((k) => delete disabledCategories[k])
    Object.assign(disabledCategories, deepClone(state.disabledCategories))

    setPersistCustomItems(true)
  }

  function switchDay(newIndex: number) {
    if (newIndex === activeDayIndex.value) return
    if (newIndex < 0 || newIndex >= numberOfDays.value) return

    saveCurrentDay()
    activeDayIndex.value = newIndex

    if (dayStates.value[newIndex]) {
      loadDay(newIndex)
    } else {
      // Initialize new day with defaults
      setPersistCustomItems(false)

      Object.keys(selections).forEach((k) => delete selections[k])
      Object.assign(selections, buildDefaultSelections([]))

      customItems.value = []

      Object.keys(disabledCategories).forEach((k) => delete disabledCategories[k])

      setPersistCustomItems(true)

      // Save this new default state
      saveCurrentDay()
    }
  }

  // Watch numberOfDays changes
  watch(numberOfDays, (newCount, oldCount) => {
    if (newCount < oldCount) {
      // Trim excess days
      dayStates.value = dayStates.value.slice(0, newCount)

      if (activeDayIndex.value >= newCount) {
        switchDay(newCount - 1)
      }
    }

    saveToStorage()
  })

  // Auto-save current day on changes (debounced via saveToStorage)
  watch(
    [() => ({ ...selections }), () => customItems.value, () => ({ ...disabledCategories })],
    () => {
      if (initialized) {
        saveCurrentDay()
      }
    },
    { deep: true },
  )

  const allDaysSummary = computed<TDaySummary[]>(() => {
    // Ensure current day is up to date in dayStates
    const states = [...dayStates.value]

    // Current active day uses live state
    const currentState: TDayState = {
      selections: { ...selections },
      customItems: customItems.value,
      disabledCategories: { ...disabledCategories },
    }

    while (states.length < numberOfDays.value) {
      states.push(createDefaultDayState())
    }

    states[activeDayIndex.value] = currentState

    return states.slice(0, numberOfDays.value).map((state, i) => {
      const categoryTotals = calculateCategoryTotals(
        state.selections,
        state.customItems,
        state.disabledCategories,
      )
      const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0)

      return {
        dayIndex: i,
        total,
        categoryTotals,
      }
    })
  })

  const grandTotal = computed(() => {
    return allDaysSummary.value.reduce((sum, day) => sum + day.total, 0)
  })

  // Initialize: load from storage and apply first day
  if (!initialized) {
    loadFromStorage()

    if (dayStates.value.length > 0 && dayStates.value[activeDayIndex.value]) {
      loadDay(activeDayIndex.value)
    } else {
      // Save initial state as day 0
      saveCurrentDay()
    }

    initialized = true
  }

  return {
    numberOfDays,
    activeDayIndex,
    dayStates,
    switchDay,
    saveCurrentDay,
    allDaysSummary,
    grandTotal,
  }
}
