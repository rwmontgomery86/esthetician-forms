import { cn } from '../../utils/cn'
import type { InputHTMLAttributes } from 'react'

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  value: string
  onChange: (value: string) => void
}

export function TextField({ label, value, onChange, className, ...props }: TextFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-sm font-medium text-text-secondary">{label}</label>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-md
          text-text-primary placeholder:text-text-muted
          focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
          transition-colors"
        {...props}
      />
    </div>
  )
}
