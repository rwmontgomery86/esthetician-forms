import logoUrl from '../assets/logo.png'
import barryUrl from '../assets/barry.jpg'
import { useSettingsStore } from '../stores/settings-store'

function loadImageAsBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const img = new Image()
        const objectUrl = URL.createObjectURL(blob)
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0)
          const base64 = canvas.toDataURL('image/png')
          URL.revokeObjectURL(objectUrl)
          resolve(base64)
        }
        img.onerror = reject
        img.src = objectUrl
      })
      .catch(reject)
  })
}

export async function loadDefaultAssets(): Promise<void> {
  const { settings, setLogo, setBarryImage } = useSettingsStore.getState()

  // Load logo if not already set
  if (!settings.logo) {
    try {
      const base64 = await loadImageAsBase64(logoUrl)
      setLogo(base64)
    } catch {
      // Silently fail — logo upload in Settings still works
    }
  }

  // Load Barry's image if not already set
  if (!settings.barryImage) {
    try {
      const base64 = await loadImageAsBase64(barryUrl)
      setBarryImage(base64)
    } catch {
      // Silently fail
    }
  }
}
