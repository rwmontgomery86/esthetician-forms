import { v4 as uuid } from 'uuid'
import type { Esthetician } from '../types'

export const BUSINESS_PHONE = '770-796-7418'
export const BUSINESS_ADDRESS = '506 S. 8th Street, Griffin, GA 30224'

export function createDefaultEstheticians(): { estheticians: Esthetician[]; defaultId: string } {
  const id = uuid()
  return {
    estheticians: [
      { id, name: 'Amanda Cortes', email: 'acortes@maxaraaesthetics.com' },
    ],
    defaultId: id,
  }
}
