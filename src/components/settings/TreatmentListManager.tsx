import { useState } from 'react'
import { Button } from '../ui/Button'
import { useSettingsStore } from '../../stores/settings-store'

export function TreatmentListManager() {
  const treatments = useSettingsStore((s) => s.settings.treatments)
  const addTreatment = useSettingsStore((s) => s.addTreatment)
  const removeTreatment = useSettingsStore((s) => s.removeTreatment)
  const updateTreatment = useSettingsStore((s) => s.updateTreatment)

  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  function handleAdd() {
    const trimmed = newName.trim()
    if (!trimmed) return
    addTreatment(trimmed)
    setNewName('')
  }

  function startEdit(id: string, name: string) {
    setEditingId(id)
    setEditValue(name)
  }

  function saveEdit() {
    if (editingId && editValue.trim()) {
      updateTreatment(editingId, editValue.trim())
    }
    setEditingId(null)
    setEditValue('')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditValue('')
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
        Treatment List
      </h3>
      <p className="text-xs text-text-muted">
        Manage the treatments available for selection on the Treatment Series form.
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add new treatment..."
          className="flex-1 px-3 py-2 text-sm bg-surface border border-border rounded-md
            text-text-primary placeholder:text-text-muted
            focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />
        <Button size="sm" onClick={handleAdd} disabled={!newName.trim()}>
          Add
        </Button>
      </div>

      <div className="space-y-1">
        {treatments.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-accent-subtle/50 group"
          >
            {editingId === t.id ? (
              <>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit()
                    if (e.key === 'Escape') cancelEdit()
                  }}
                  autoFocus
                  className="flex-1 px-2 py-1 text-sm bg-surface border border-accent rounded
                    text-text-primary focus:outline-none"
                />
                <Button variant="ghost" size="sm" onClick={saveEdit}>
                  Save
                </Button>
                <Button variant="ghost" size="sm" onClick={cancelEdit}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm text-text-primary">{t.name}</span>
                <button
                  onClick={() => startEdit(t.id, t.name)}
                  className="opacity-0 group-hover:opacity-100 text-xs text-text-muted
                    hover:text-text-secondary transition-opacity cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeTreatment(t.id)}
                  className="opacity-0 group-hover:opacity-100 text-xs text-error
                    hover:text-error/80 transition-opacity cursor-pointer"
                >
                  Remove
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
