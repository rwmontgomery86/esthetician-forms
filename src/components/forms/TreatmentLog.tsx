import { ComboBox } from '../ui/ComboBox'
import { DateField } from '../form-fields/DateField'
import type { TreatmentLogEntry } from '../../types'

interface TreatmentLogProps {
  entries: TreatmentLogEntry[]
  treatmentNames: string[]
  onUpdate: (index: number, field: 'treatmentName' | 'date', value: string) => void
}

export function TreatmentLog({ entries, treatmentNames, onUpdate }: TreatmentLogProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[auto_1fr_180px] gap-3 items-end">
        <span className="text-xs font-medium text-text-muted w-6">#</span>
        <span className="text-xs font-medium text-text-muted">Treatment</span>
        <span className="text-xs font-medium text-text-muted">Date</span>
      </div>
      {entries.map((entry, i) => (
        <div key={entry.id} className="grid grid-cols-[auto_1fr_180px] gap-3 items-center">
          <span className="text-sm text-text-muted w-6 text-center">{i + 1}</span>
          <ComboBox
            value={entry.treatmentName}
            onChange={(val) => onUpdate(i, 'treatmentName', val)}
            options={treatmentNames}
            placeholder="Select treatment..."
          />
          <DateField
            value={entry.date}
            onChange={(val) => onUpdate(i, 'date', val)}
          />
        </div>
      ))}
    </div>
  )
}
