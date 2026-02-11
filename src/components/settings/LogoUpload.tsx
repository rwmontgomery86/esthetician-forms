import { useRef } from 'react'
import { Button } from '../ui/Button'
import { useSettingsStore } from '../../stores/settings-store'

const MAX_DIMENSION = 400
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = (height / width) * MAX_DIMENSION
            width = MAX_DIMENSION
          } else {
            width = (width / height) * MAX_DIMENSION
            height = MAX_DIMENSION
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/png'))
      }
      img.onerror = reject
      img.src = reader.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function LogoUpload() {
  const logo = useSettingsStore((s) => s.settings.logo)
  const setLogo = useSettingsStore((s) => s.setLogo)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      alert('Logo file is too large. Please use an image under 2MB.')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, SVG).')
      return
    }

    const resized = await resizeImage(file)
    setLogo(resized)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function handleRemove() {
    setLogo(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
        Logo
      </h3>

      {logo ? (
        <div className="flex items-start gap-4">
          <div className="w-32 h-32 rounded-lg border border-border bg-background flex items-center justify-center p-2">
            <img
              src={logo}
              alt="Business logo"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Change Logo
            </Button>
            <Button variant="ghost" size="sm" onClick={handleRemove}>
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-32 rounded-lg border-2 border-dashed border-border hover:border-accent
            bg-background hover:bg-accent-subtle/50 transition-colors cursor-pointer
            flex flex-col items-center justify-center gap-2"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-text-muted"
          >
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-sm text-text-muted">Click to upload logo</span>
          <span className="text-xs text-text-muted">PNG, JPG or SVG (max 2MB)</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
