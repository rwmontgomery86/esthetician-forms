import { useState, useRef, useEffect } from 'react'
import { cn } from '../../utils/cn'

interface ComboBoxProps {
  label?: string
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  className?: string
}

export function ComboBox({
  label,
  value,
  onChange,
  options,
  placeholder = 'Type or select...',
  className,
}: ComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(value.toLowerCase())
  )

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setHighlightedIndex(-1)
  }, [value])

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightedIndex])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true)
      return
    }

    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((i) => (i < filtered.length - 1 ? i + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((i) => (i > 0 ? i - 1 : filtered.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
          onChange(filtered[highlightedIndex])
          setIsOpen(false)
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  function selectOption(opt: string) {
    onChange(opt)
    setIsOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div className={cn('flex flex-col gap-1.5 relative', className)} ref={containerRef}>
      {label && (
        <label className="text-sm font-medium text-text-secondary">{label}</label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-activedescendant={
            highlightedIndex >= 0 ? `combo-opt-${highlightedIndex}` : undefined
          }
          className="w-full px-3 py-2 pr-8 text-sm bg-surface border border-border rounded-md
            text-text-primary placeholder:text-text-muted
            focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
            transition-colors"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => {
            setIsOpen(!isOpen)
            inputRef.current?.focus()
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary cursor-pointer"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className={cn('transition-transform', isOpen && 'rotate-180')}
          >
            <path
              d="M3.5 5.25L7 8.75L10.5 5.25"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {isOpen && filtered.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-48 overflow-auto
            bg-surface border border-border rounded-md shadow-card-hover"
        >
          {filtered.map((opt, i) => (
            <li
              key={opt}
              id={`combo-opt-${i}`}
              role="option"
              aria-selected={i === highlightedIndex}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectOption(opt)}
              onMouseEnter={() => setHighlightedIndex(i)}
              className={cn(
                'px-3 py-2 text-sm cursor-pointer transition-colors',
                i === highlightedIndex
                  ? 'bg-accent-subtle text-text-primary'
                  : 'text-text-secondary hover:bg-accent-subtle/50'
              )}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
