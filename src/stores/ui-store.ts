import { create } from 'zustand'
import type { ActiveTab } from '../types'

interface UIStore {
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
}

export const useUIStore = create<UIStore>()((set) => ({
  activeTab: 'treatment-series',
  setActiveTab: (tab) => set({ activeTab: tab }),
}))
