import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import type { Settings, EstheticianProfile } from '../types'
import { createDefaultTreatments } from '../data/default-treatments'
import { createDefaultProductCatalog } from '../data/default-products'

function createDefaultSettings(): Settings {
  return {
    profile: {
      name: '',
      phone: '',
      email: '',
      address: '',
    },
    logo: null,
    treatments: createDefaultTreatments(),
    productCatalog: createDefaultProductCatalog(),
  }
}

interface SettingsStore {
  settings: Settings

  // Profile
  updateProfile: (data: Partial<EstheticianProfile>) => void
  setLogo: (logo: string | null) => void

  // Treatments
  addTreatment: (name: string) => void
  removeTreatment: (id: string) => void
  updateTreatment: (id: string, name: string) => void

  // Product Catalog
  addCategory: (name: string) => void
  removeCategory: (id: string) => void
  renameCategory: (id: string, name: string) => void
  addProduct: (categoryId: string, name: string) => void
  removeProduct: (categoryId: string, productId: string) => void
  updateProduct: (categoryId: string, productId: string, name: string) => void

  // Helpers
  getProductsByCategory: (categoryName: string) => string[]

  // Reset
  resetSettings: () => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: createDefaultSettings(),

      // ===== Profile =====

      updateProfile: (data) =>
        set((state) => ({
          settings: {
            ...state.settings,
            profile: { ...state.settings.profile, ...data },
          },
        })),

      setLogo: (logo) =>
        set((state) => ({
          settings: { ...state.settings, logo },
        })),

      // ===== Treatments =====

      addTreatment: (name) =>
        set((state) => ({
          settings: {
            ...state.settings,
            treatments: [...state.settings.treatments, { id: uuid(), name }],
          },
        })),

      removeTreatment: (id) =>
        set((state) => ({
          settings: {
            ...state.settings,
            treatments: state.settings.treatments.filter((t) => t.id !== id),
          },
        })),

      updateTreatment: (id, name) =>
        set((state) => ({
          settings: {
            ...state.settings,
            treatments: state.settings.treatments.map((t) =>
              t.id === id ? { ...t, name } : t
            ),
          },
        })),

      // ===== Product Catalog =====

      addCategory: (name) =>
        set((state) => ({
          settings: {
            ...state.settings,
            productCatalog: [
              ...state.settings.productCatalog,
              { id: uuid(), name, products: [] },
            ],
          },
        })),

      removeCategory: (id) =>
        set((state) => ({
          settings: {
            ...state.settings,
            productCatalog: state.settings.productCatalog.filter((c) => c.id !== id),
          },
        })),

      renameCategory: (id, name) =>
        set((state) => ({
          settings: {
            ...state.settings,
            productCatalog: state.settings.productCatalog.map((c) =>
              c.id === id ? { ...c, name } : c
            ),
          },
        })),

      addProduct: (categoryId, name) =>
        set((state) => ({
          settings: {
            ...state.settings,
            productCatalog: state.settings.productCatalog.map((c) =>
              c.id === categoryId
                ? { ...c, products: [...c.products, { id: uuid(), name }] }
                : c
            ),
          },
        })),

      removeProduct: (categoryId, productId) =>
        set((state) => ({
          settings: {
            ...state.settings,
            productCatalog: state.settings.productCatalog.map((c) =>
              c.id === categoryId
                ? { ...c, products: c.products.filter((p) => p.id !== productId) }
                : c
            ),
          },
        })),

      updateProduct: (categoryId, productId, name) =>
        set((state) => ({
          settings: {
            ...state.settings,
            productCatalog: state.settings.productCatalog.map((c) =>
              c.id === categoryId
                ? {
                    ...c,
                    products: c.products.map((p) =>
                      p.id === productId ? { ...p, name } : p
                    ),
                  }
                : c
            ),
          },
        })),

      // ===== Helpers =====

      getProductsByCategory: (categoryName) => {
        const cat = get().settings.productCatalog.find(
          (c) => c.name.toLowerCase() === categoryName.toLowerCase()
        )
        return cat ? cat.products.map((p) => p.name) : []
      },

      // ===== Reset =====

      resetSettings: () => set({ settings: createDefaultSettings() }),
    }),
    {
      name: 'esthetician-settings',
      version: 1,
    }
  )
)
