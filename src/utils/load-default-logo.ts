import logoUrl from '../assets/logo.png'
import { useSettingsStore } from '../stores/settings-store'

export async function loadDefaultLogo(): Promise<void> {
  const { settings, setLogo } = useSettingsStore.getState()
  if (settings.logo) return

  try {
    const response = await fetch(logoUrl)
    const blob = await response.blob()

    const img = new Image()
    const objectUrl = URL.createObjectURL(blob)

    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0)
        const base64 = canvas.toDataURL('image/png')
        setLogo(base64)
        URL.revokeObjectURL(objectUrl)
        resolve()
      }
      img.onerror = reject
      img.src = objectUrl
    })
  } catch {
    // Silently fail — logo upload in Settings still works
  }
}
