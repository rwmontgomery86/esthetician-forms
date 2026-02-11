import { TextField } from '../form-fields/TextField'
import { useSettingsStore } from '../../stores/settings-store'

export function ProfileSettings() {
  const profile = useSettingsStore((s) => s.settings.profile)
  const updateProfile = useSettingsStore((s) => s.updateProfile)

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
        Your Information
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          label="Name"
          value={profile.name}
          onChange={(val) => updateProfile({ name: val })}
          placeholder="Your full name"
        />
        <TextField
          label="Phone"
          value={profile.phone}
          onChange={(val) => updateProfile({ phone: val })}
          placeholder="(555) 123-4567"
        />
        <TextField
          label="Email"
          value={profile.email}
          onChange={(val) => updateProfile({ email: val })}
          placeholder="you@example.com"
        />
        <TextField
          label="Address"
          value={profile.address}
          onChange={(val) => updateProfile({ address: val })}
          placeholder="123 Main St, City, ST 12345"
        />
      </div>
    </div>
  )
}
