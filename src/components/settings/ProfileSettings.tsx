import { useState } from 'react'
import { useSettingsStore } from '../../stores/settings-store'
import { TextField } from '../form-fields/TextField'
import { Button } from '../ui/Button'
import { BUSINESS_PHONE, BUSINESS_ADDRESS } from '../../data/default-estheticians'

export function ProfileSettings() {
  const estheticians = useSettingsStore((s) => s.settings.estheticians)
  const selectedId = useSettingsStore((s) => s.settings.selectedEstheticianId)
  const setSelected = useSettingsStore((s) => s.setSelectedEsthetician)
  const addEsthetician = useSettingsStore((s) => s.addEsthetician)
  const removeEsthetician = useSettingsStore((s) => s.removeEsthetician)

  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')

  const handleAdd = () => {
    if (!newName.trim()) return
    addEsthetician(newName.trim(), newEmail.trim())
    setNewName('')
    setNewEmail('')
    setShowAdd(false)
  }

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
        Esthetician
      </h3>

      {/* Esthetician selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-secondary">
          Active Esthetician
        </label>
        <div className="flex items-center gap-2">
          <select
            value={selectedId}
            onChange={(e) => setSelected(e.target.value)}
            className="flex-1 px-3 py-2 text-sm bg-surface border border-border rounded-md
              text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30
              focus:border-accent transition-colors"
          >
            {estheticians.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
          {estheticians.length > 1 && (
            <button
              onClick={() => removeEsthetician(selectedId)}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10
                rounded-md transition-colors"
              title="Remove esthetician"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Selected esthetician email (read-only) */}
      {(() => {
        const selected = estheticians.find((e) => e.id === selectedId)
        return selected ? (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Email</label>
            <p className="px-3 py-2 text-sm text-text-primary bg-surface/50 border border-border/50
              rounded-md">{selected.email || '—'}</p>
          </div>
        ) : null
      })()}

      {/* Add esthetician */}
      {showAdd ? (
        <div className="p-4 bg-surface/50 border border-border rounded-lg space-y-3">
          <h4 className="text-sm font-medium text-text-primary">Add Esthetician</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField
              label="Name"
              value={newName}
              onChange={setNewName}
              placeholder="Full name"
            />
            <TextField
              label="Email"
              value={newEmail}
              onChange={setNewEmail}
              placeholder="email@example.com"
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd} disabled={!newName.trim()}>
              Add
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowAdd(false)
                setNewName('')
                setNewEmail('')
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="text-sm text-accent hover:text-accent/80 transition-colors"
        >
          + Add another esthetician
        </button>
      )}

      {/* Hardcoded business info */}
      <div className="pt-2 border-t border-border/50">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Business Info
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Phone</label>
            <p className="px-3 py-2 text-sm text-text-primary bg-surface/50 border border-border/50
              rounded-md">{BUSINESS_PHONE}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Address</label>
            <p className="px-3 py-2 text-sm text-text-primary bg-surface/50 border border-border/50
              rounded-md">{BUSINESS_ADDRESS}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
