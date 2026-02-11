import { cn } from '../../utils/cn'

interface CheckboxFieldProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

export function CheckboxField({ label, checked, onChange, className }: CheckboxFieldProps) {
  return (
    <label
      className={cn(
        'flex items-center gap-2.5 cursor-pointer group',
        className
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <div
        className={cn(
          'w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition-colors shrink-0',
          checked
            ? 'bg-accent border-accent'
            : 'bg-surface border-border group-hover:border-accent-light'
        )}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span className="text-sm text-text-primary select-none">{label}</span>
    </label>
  )
}
