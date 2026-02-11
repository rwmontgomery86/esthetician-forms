import { cn } from '../../utils/cn'
import { useUIStore } from '../../stores/ui-store'
import type { ActiveTab } from '../../types'

const TABS: { key: ActiveTab; label: string }[] = [
  { key: 'treatment-series', label: 'Treatment Series' },
  { key: 'skincare-routine', label: 'Skincare Routine' },
  { key: 'settings', label: 'Settings' },
]

export function TabNav() {
  const activeTab = useUIStore((s) => s.activeTab)
  const setActiveTab = useUIStore((s) => s.setActiveTab)

  return (
    <nav className="flex gap-1 bg-background rounded-lg p-1">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-md transition-all cursor-pointer',
            activeTab === tab.key
              ? 'bg-surface text-accent-dark shadow-card'
              : 'text-text-muted hover:text-text-secondary hover:bg-surface/50'
          )}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
