import { CheckboxField } from '../form-fields/CheckboxField'
import type { Treatment } from '../../types'

interface TreatmentChecklistProps {
  treatments: Treatment[]
  selectedIds: string[]
  onToggle: (id: string) => void
}

export function TreatmentChecklist({
  treatments,
  selectedIds,
  onToggle,
}: TreatmentChecklistProps) {
  if (treatments.length === 0) {
    return (
      <p className="text-sm text-text-muted italic">
        No treatments configured. Add treatments in Settings.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {treatments.map((treatment) => (
        <CheckboxField
          key={treatment.id}
          label={treatment.name}
          checked={selectedIds.includes(treatment.id)}
          onChange={() => onToggle(treatment.id)}
        />
      ))}
    </div>
  )
}
