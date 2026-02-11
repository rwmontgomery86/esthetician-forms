import { TabNav } from './TabNav'

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-sm border-b border-border-light">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M9 2C5.134 2 2 5.134 2 9s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm0 2.5a2.25 2.25 0 110 4.5 2.25 2.25 0 010-4.5zm0 9.5a5.5 5.5 0 01-4.243-2c.054-1.407 2.829-2.18 4.243-2.18s4.189.773 4.243 2.18A5.5 5.5 0 019 14z"
                fill="white"
              />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-text-primary tracking-tight">
            Client Forms
          </h1>
        </div>
        <TabNav />
      </div>
    </header>
  )
}
