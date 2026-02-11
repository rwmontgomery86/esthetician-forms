import { cn } from '../../utils/cn'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors rounded-md cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-accent text-white hover:bg-accent-dark': variant === 'primary',
          'bg-surface text-text-primary border border-border hover:bg-accent-subtle':
            variant === 'secondary',
          'bg-transparent text-text-secondary hover:bg-accent-subtle hover:text-text-primary':
            variant === 'ghost',
          'bg-error text-white hover:bg-error/90': variant === 'danger',
        },
        {
          'text-sm px-3 py-1.5': size === 'sm',
          'text-sm px-4 py-2': size === 'md',
          'text-base px-6 py-2.5': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
