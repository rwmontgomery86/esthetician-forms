import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { TextField } from '../form-fields/TextField'
import { DateField } from '../form-fields/DateField'
import { TextArea } from '../form-fields/TextArea'
import { RoutineSection } from './RoutineSection'
import { AddOnsSection } from './AddOnsSection'
import { useSettingsStore } from '../../stores/settings-store'
import { generateSkincareRoutinePdf } from '../../utils/pdf-skincare-routine'
import type { SkincareRoutineData } from '../../types'

function createEmptyForm(specialistName: string): SkincareRoutineData {
  return {
    clientName: '',
    date: new Date().toISOString().slice(0, 10),
    specialistName,
    morning: { cleanser: '', serum: '', protect: '' },
    evening: { cleanser: '', serum: '', nightCreme: '' },
    addOns: { masque: '', eyeTreatment: '', specialty: '' },
    notes: '',
  }
}

const MORNING_FIELDS = [
  { key: 'cleanser', label: 'Cleanser', category: 'Cleansers' },
  { key: 'serum', label: 'Serum', category: 'Serums' },
  { key: 'protect', label: 'Protect (SPF)', category: 'SPF / Protect' },
]

const EVENING_FIELDS = [
  { key: 'cleanser', label: 'Cleanser', category: 'Cleansers' },
  { key: 'serum', label: 'Serum', category: 'Serums' },
  { key: 'nightCreme', label: 'Night Creme', category: 'Night Cremes' },
]

export function SkincareRoutineForm() {
  const settings = useSettingsStore((s) => s.settings)
  const getProductsByCategory = useSettingsStore((s) => s.getProductsByCategory)
  const [formData, setFormData] = useState<SkincareRoutineData>(() =>
    createEmptyForm(settings.profile.name)
  )
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  function updateField<K extends keyof SkincareRoutineData>(
    key: K,
    value: SkincareRoutineData[K]
  ) {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  function updateMorning(key: string, value: string) {
    setFormData((prev) => ({
      ...prev,
      morning: { ...prev.morning, [key]: value },
    }))
  }

  function updateEvening(key: string, value: string) {
    setFormData((prev) => ({
      ...prev,
      evening: { ...prev.evening, [key]: value },
    }))
  }

  function updateAddOn(key: 'masque' | 'eyeTreatment' | 'specialty', value: string) {
    setFormData((prev) => ({
      ...prev,
      addOns: { ...prev.addOns, [key]: value },
    }))
  }

  function handleGeneratePdf() {
    generateSkincareRoutinePdf(formData, settings)
  }

  function handleClear() {
    setFormData(createEmptyForm(settings.profile.name))
    setShowClearConfirm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            Recommended Skincare Routine
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Build a personalized skincare routine for your client.
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TextField
            label="Client Name"
            value={formData.clientName}
            onChange={(val) => updateField('clientName', val)}
            placeholder="Enter client name..."
          />
          <DateField
            label="Date"
            value={formData.date}
            onChange={(val) => updateField('date', val)}
          />
          <TextField
            label="Skincare Specialist"
            value={formData.specialistName}
            onChange={(val) => updateField('specialistName', val)}
            placeholder="Your name..."
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <RoutineSection
            title="Morning"
            icon="☀️"
            fields={MORNING_FIELDS}
            values={formData.morning}
            onChange={updateMorning}
            getProducts={getProductsByCategory}
          />
        </Card>

        <Card>
          <RoutineSection
            title="Evening"
            icon="🌙"
            fields={EVENING_FIELDS}
            values={formData.evening}
            onChange={updateEvening}
            getProducts={getProductsByCategory}
          />
        </Card>
      </div>

      <Card>
        <AddOnsSection
          values={formData.addOns}
          onChange={updateAddOn}
          getProducts={getProductsByCategory}
        />
      </Card>

      <Card>
        <TextArea
          label="Notes"
          value={formData.notes}
          onChange={(val) => updateField('notes', val)}
          placeholder="Additional notes, special instructions, skin concerns..."
          rows={4}
        />
      </Card>
    </div>
  )
}
