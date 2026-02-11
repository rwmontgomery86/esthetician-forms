import { v4 as uuid } from 'uuid'
import type { ProductCategory } from '../types'

export function createDefaultProductCatalog(): ProductCategory[] {
  return [
    {
      id: uuid(),
      name: 'Cleansers',
      products: [
        { id: uuid(), name: 'ORMEDIC Balancing Gel Cleanser' },
        { id: uuid(), name: 'VITAL C Hydrating Facial Cleanser' },
        { id: uuid(), name: 'AGELESS Total Facial Cleanser' },
        { id: uuid(), name: 'CLEAR CELL Salicylic Gel Cleanser' },
        { id: uuid(), name: 'ILUMA Intense Brightening Exfoliating Cleanser' },
      ],
    },
    {
      id: uuid(),
      name: 'Serums',
      products: [
        { id: uuid(), name: 'VITAL C Hydrating Anti-Aging Serum' },
        { id: uuid(), name: 'AGELESS Total Pure Hyaluronic Filler' },
        { id: uuid(), name: 'ILUMA Intense Brightening Serum' },
        { id: uuid(), name: 'ORMEDIC Balancing Antioxidant Serum' },
        { id: uuid(), name: 'MAX Stem Cell Serum' },
      ],
    },
    {
      id: uuid(),
      name: 'SPF / Protect',
      products: [
        { id: uuid(), name: 'PREVENTION+ Daily Matte Moisturizer SPF 32' },
        { id: uuid(), name: 'PREVENTION+ Daily Ultimate Protection SPF 50' },
        { id: uuid(), name: 'PREVENTION+ Daily Hydrating Moisturizer SPF 30' },
        { id: uuid(), name: 'PREVENTION+ Daily Tinted Moisturizer SPF 30' },
      ],
    },
    {
      id: uuid(),
      name: 'Night Cremes',
      products: [
        { id: uuid(), name: 'VITAL C Hydrating Repair Creme' },
        { id: uuid(), name: 'AGELESS Total Repair Creme' },
        { id: uuid(), name: 'ORMEDIC Balancing Bio-Peptide Creme' },
        { id: uuid(), name: 'MAX Stem Cell Creme' },
      ],
    },
    {
      id: uuid(),
      name: 'Masques',
      products: [
        { id: uuid(), name: 'I MASK Hydrating Hydrogel Sheet Mask' },
        { id: uuid(), name: 'I MASK Firming Transformation Mask' },
        { id: uuid(), name: 'I MASK Purifying Probiotic Mask' },
        { id: uuid(), name: 'I MASK Biomolecular Hydrating Recovery Mask' },
      ],
    },
    {
      id: uuid(),
      name: 'Eye Treatments',
      products: [
        { id: uuid(), name: 'AGELESS Total Eye Lift Creme' },
        { id: uuid(), name: 'VITAL C Hydrating Eye Recovery Gel' },
        { id: uuid(), name: 'ORMEDIC Balancing Eye Lift Gel' },
      ],
    },
    {
      id: uuid(),
      name: 'Specialty',
      products: [
        { id: uuid(), name: 'VITAL C Hydrating Enzyme Masque' },
        { id: uuid(), name: 'AGELESS Total Retinol-A Creme' },
        { id: uuid(), name: 'ILUMA Intense Brightening Creme' },
        { id: uuid(), name: 'CLEAR CELL Medicated Acne Lotion' },
      ],
    },
  ]
}
