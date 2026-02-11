import { v4 as uuid } from 'uuid'
import type { Treatment } from '../types'

export function createDefaultTreatments(): Treatment[] {
  return [
    { id: uuid(), name: 'Ormedic Lift' },
    { id: uuid(), name: 'The Signature Facelift' },
    { id: uuid(), name: 'Lightening Lift' },
    { id: uuid(), name: 'Lightening Lift FORTE' },
    { id: uuid(), name: 'Wrinkle Lift' },
    { id: uuid(), name: 'Wrinkle Lift FORTE' },
    { id: uuid(), name: 'Acne Lift' },
    { id: uuid(), name: 'Advanced BHA Lift' },
    { id: uuid(), name: 'Perfection Lift' },
    { id: uuid(), name: 'Perfection Lift FORTE' },
    { id: uuid(), name: 'O2 Lift' },
    { id: uuid(), name: 'IMAGE Facials' },
  ]
}
