import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import type { Settings, EstheticianProfile } from '../types'
import { createDefaultTreatments } from '../data/default-treatments'
import { createDefaultProductCatalog } from '../data/default-products'
import {
  createDefaultEstheticians,
  BUSINESS_PHONE,
  BUSINESS_ADDRESS,
} from '../data/default-estheticians'

function createDefaultSettings(): Settings {
  const { estheticians, defaultId } = createDefaultEstheticians()
  const selected = estheticians[0]
  return {
    profile: {
      name: selected.name,
      phone: BUSINESS_PHONE,
      email: selected.email,
      address: BUSINESS_ADDRESS,
    },
    logo: null,
    estheticians,
    selectedEstheticianId: defaultId,
    treatments: createDefaultTreatments(),
    productCatalog: createDefaultProductCatalog(),
  }
}

function resolveProfile(settings: Settings): EstheticianProfile {
  const selected = settings.estheticians.find(
    (e) => e.id === settings.selectedEstheticianId
  )
  return {
    name: selected?.name ?? '',
    email: selected?.email ?? '',
    phone: BUSINESS_PHONE,
    address: BUSINESS_ADDRESS,
  }
}

interface SettingsStore {
  settings: Settings

  // Profile (resolved from selected esthetician + constants)
  getProfile: () => EstheticianProfile
  setLogo: (logo: string | null) => void

  // Estheticians
  addEsthetician: (name: string, email: string) => void
  removeEsthetician: (id: string) => void
  setSelectedEsthetician: (id: string) => void

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

      getProfile: () => resolveProfile(get().settings),

      setLogo: (logo) =>
        set((state) => ({
          settings: { ...state.settings, logo },
        })),

      // ===== Estheticians =====

      addEsthetician: (name, email) => {
        const newId = uuid()
        set((state) => ({
          settings: {
            ...state.settings,
            estheticians: [
              ...state.settings.estheticians,
              { id: newId, name, email },
            ],
          },
        }))
      },

      removeEsthetician: (id) =>
        set((state) => {
          const remaining = state.settings.estheticians.filter((e) => e.id !== id)
          if (remaining.length === 0) return state // can't remove last one
          const selectedId =
            state.settings.selectedEstheticianId === id
              ? remaining[0].id
              : state.settings.selectedEstheticianId
          const updated = {
            ...state.settings,
            estheticians: remaining,
            selectedEstheticianId: selectedId,
          }
          return {
            settings: {
              ...updated,
              profile: resolveProfile(updated),
            },
          }
        }),

      setSelectedEsthetician: (id) =>
        set((state) => {
          const updated = {
            ...state.settings,
            selectedEstheticianId: id,
          }
          return {
            settings: {
              ...updated,
              profile: resolveProfile(updated),
            },
          }
        }),

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
      version: 2,
      migrate: (persisted: unknown) => {
        const state = persisted as Record<string, unknown>
        const settings = state.settings as Record<string, unknown> | undefined
        // If no estheticians array, this is a v1 store — add defaults
        if (settings && !settings.estheticians) {
          const { estheticians, defaultId } = createDefaultEstheticians()
          settings.estheticians = estheticians
          settings.selectedEstheticianId = defaultId
          // Sync profile with defaults
          const profile = settings.profile as Record<string, string>
          if (!profile.name) profile.name = estheticians[0].name
          if (!profile.email) profile.email = estheticians[0].email
          profile.phone = BUSINESS_PHONE
          profile.address = BUSINESS_ADDRESS
        }
        return state as { settings: Settings }
      },
    }
  )
)
