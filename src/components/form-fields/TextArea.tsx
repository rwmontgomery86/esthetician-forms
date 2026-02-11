import { cn } from '../../utils/cn'
import type { TextareaHTMLAttributes } from 'react'

interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string
  value: string
  onChange: (value: string) => void
}

export function TextArea({ label, value, onChange, className, rows = 4, ...props }: TextAreaProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-sm font-medium text-text-secondary">{label}</label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-md
          text-text-primary placeholder:text-text-muted resize-vertical
          focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
          transition-colors"
        {...props}
      />
    </div>
  )
}
