export type TCurrency = 'USD' | 'TRY' | 'RUB'

export type TExpenseItemType = 'checkbox' | 'slider'

export interface TSliderOption {
  label: string
  value: number
}

export interface TExpenseItem {
  id: string
  label: string
  type: TExpenseItemType
  priceUsd: number
  /** For slider type: min value */
  min?: number
  /** For slider type: max value */
  max?: number
  /** For slider type: step */
  step?: number
  /** For slider type: named options along the slider */
  options?: TSliderOption[]
  /** For slider type: unit label */
  unit?: string
  /** Default enabled state for checkboxes */
  defaultEnabled?: boolean
  /** Default value for sliders */
  defaultValue?: number
}

export interface TCategory {
  id: string
  icon: string
  title: string
  items: TExpenseItem[]
}

export interface TSelections {
  [itemId: string]: {
    enabled: boolean
    value: number
  }
}

export interface TCustomItem {
  id: string
  categoryId: string
  label: string
  priceUsd: number
}

export interface TDayState {
  selections: TSelections
  customItems: TCustomItem[]
  disabledCategories: Record<string, boolean>
}

export interface TDaySummary {
  dayIndex: number
  total: number
  categoryTotals: Record<string, number>
}
