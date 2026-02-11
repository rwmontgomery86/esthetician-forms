// ===== Settings =====

export interface EstheticianProfile {
  name: string
  phone: string
  email: string
  address: string
}

export interface Treatment {
  id: string
  name: string
}

export interface Product {
  id: string
  name: string
}

export interface ProductCategory {
  id: string
  name: string
  products: Product[]
}

export interface Settings {
  profile: EstheticianProfile
  logo: string | null
  treatments: Treatment[]
  productCatalog: ProductCategory[]
}

// ===== Form 1: Treatment Series =====

export interface TreatmentLogEntry {
  id: string
  treatmentName: string
  date: string
}

export interface TreatmentSeriesData {
  selectedTreatmentIds: string[]
  treatmentLog: TreatmentLogEntry[]
}

// ===== Form 2: Skincare Routine =====

export interface SkincareRoutineData {
  clientName: string
  date: string
  specialistName: string
  morning: {
    cleanser: string
    serum: string
    protect: string
  }
  evening: {
    cleanser: string
    serum: string
    nightCreme: string
  }
  addOns: {
    masque: string
    eyeTreatment: string
    specialty: string
  }
  notes: string
}

// ===== UI =====

export type ActiveTab = 'treatment-series' | 'skincare-routine' | 'settings'
