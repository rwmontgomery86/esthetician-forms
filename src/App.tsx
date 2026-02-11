import { useEffect } from 'react'
import { AppShell } from './components/layout/AppShell'
import { TreatmentSeriesForm } from './components/forms/TreatmentSeriesForm'
import { SkincareRoutineForm } from './components/forms/SkincareRoutineForm'
import { SettingsPage } from './components/settings/SettingsPage'
import { useUIStore } from './stores/ui-store'
import { loadDefaultAssets } from './utils/load-default-logo'

export default function App() {
  const activeTab = useUIStore((s) => s.activeTab)

  useEffect(() => {
    loadDefaultAssets()
  }, [])

  return (
    <AppShell>
      {activeTab === 'treatment-series' && <TreatmentSeriesForm />}
      {activeTab === 'skincare-routine' && <SkincareRoutineForm />}
      {activeTab === 'settings' && <SettingsPage />}
    </AppShell>
  )
}
