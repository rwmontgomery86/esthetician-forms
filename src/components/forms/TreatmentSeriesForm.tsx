import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { TreatmentChecklist } from './TreatmentChecklist'
import { TreatmentLog } from './TreatmentLog'
import { useSettingsStore } from '../../stores/settings-store'
import { generateTreatmentSeriesPdf } from '../../utils/pdf-treatment-series'
import type { TreatmentSeriesData, TreatmentLogEntry } from '../../types'

function createEmptyLog(): TreatmentLogEntry[] {
  return Array.from({ length: 6 }, () => ({
    id: uuid(),
    treatmentName: '',
    date: '',
  }))
}

function createEmptyForm(): TreatmentSeriesData {
  return {
    selectedTreatmentIds: [],
    treatmentLog: createEmptyLog(),
  }
}

export function TreatmentSeriesForm() {
  const [formData, setFormData] = useState<TreatmentSeriesData>(createEmptyForm)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const settings = useSettingsStore((s) => s.settings)

  function toggleTreatment(id: string) {
    setFormData((prev) => ({
      ...prev,
      selectedTreatmentIds: prev.selectedTreatmentIds.includes(id)
        ? prev.selectedTreatmentIds.filter((tid) => tid !== id)
        : [...prev.selectedTreatmentIds, id],
    }))
  }

  function updateLogEntry(index: number, field: 'treatmentName' | 'date', value: string) {
    setFormData((prev) => ({
      ...prev,
      treatmentLog: prev.treatmentLog.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      ),
    }))
  }

  function handleGeneratePdf() {
    generateTreatmentSeriesPdf(formData, settings)
  }

  function handleClear() {
    setFormData(createEmptyForm())
    setShowClearConfirm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            Professional Treatment Series Recommendation
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Select treatments and log the series schedule for your client.
          </p>
        </div>
        <div className="flex gap-2">
          {showClearConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">Clear all data?</span>
              <Button variant="danger" size="sm" onClick={handleClear}>
                Yes, Clear
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowClearConfirm(true)}
            >
              Clear Form
            </Button>
          )}
          <Button onClick={handleGeneratePdf}>Generate PDF</Button>
        </div>
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
          Treatment Selection
        </h3>
        <TreatmentChecklist
          treatments={settings.treatments}
          selectedIds={formData.selectedTreatmentIds}
          onToggle={toggleTreatment}
        />
        <div className="mt-4 p-3 bg-accent-subtle rounded-md">
          <p className="text-xs text-accent-dark leading-relaxed">
            <strong>I PEEL treatments</strong> are recommended in a series of 4–6 treatments
            at 2–4 week intervals for maximum results.
          </p>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
          Treatment Log
        </h3>
        <TreatmentLog
          entries={formData.treatmentLog}
          treatmentNames={settings.treatments.map((t) => t.name)}
          onUpdate={updateLogEntry}
        />
      </Card>
    </div>
  )
}
