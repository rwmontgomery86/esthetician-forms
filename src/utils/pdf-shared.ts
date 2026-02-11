import jsPDF from 'jspdf'
import type { EstheticianProfile } from '../types'

// Brand colors for PDF
export const ACCENT: [number, number, number] = [139, 158, 139] // #8B9E8B sage green
export const ACCENT_DARK: [number, number, number] = [107, 127, 107] // #6B7F6B
export const TEXT_DARK: [number, number, number] = [44, 44, 44]
export const TEXT_MED: [number, number, number] = [107, 107, 107]
export const TEXT_LIGHT: [number, number, number] = [155, 155, 155]
export const BORDER: [number, number, number] = [229, 229, 224]

export const PAGE_WIDTH = 210
export const MARGIN_LEFT = 14
export const MARGIN_RIGHT = 14
export const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT
export const PAGE_BREAK_THRESHOLD = 270

export function drawHeader(
  doc: jsPDF,
  logo: string | null,
  profile: EstheticianProfile
): number {
  let yPos = 12

  // Logo on the left (preserve aspect ratio, fit within 30mm height)
  if (logo) {
    try {
      const maxH = 30
      const maxW = 55
      const img = new Image()
      img.src = logo
      const aspect = img.width / img.height
      let w = maxH * aspect
      let h = maxH
      if (w > maxW) {
        w = maxW
        h = maxW / aspect
      }
      doc.addImage(logo, 'PNG', MARGIN_LEFT, yPos, w, h)
    } catch {
      // Skip logo if it fails to load
    }
  }

  // Contact info on the right
  const rightX = PAGE_WIDTH - MARGIN_RIGHT
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...TEXT_DARK)
  if (profile.name) {
    doc.text(profile.name, rightX, yPos + 6, { align: 'right' })
  }

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...TEXT_MED)

  let infoY = yPos + 12
  if (profile.phone) {
    doc.text(profile.phone, rightX, infoY, { align: 'right' })
    infoY += 4
  }
  if (profile.email) {
    doc.text(profile.email, rightX, infoY, { align: 'right' })
    infoY += 4
  }
  if (profile.address) {
    doc.text(profile.address, rightX, infoY, { align: 'right' })
  }

  yPos += 34

  // Divider line
  doc.setDrawColor(...ACCENT)
  doc.setLineWidth(0.5)
  doc.line(MARGIN_LEFT, yPos, PAGE_WIDTH - MARGIN_RIGHT, yPos)

  return yPos + 8
}

export function addSectionHeading(doc: jsPDF, title: string, yPos: number): number {
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...ACCENT_DARK)
  doc.text(title, MARGIN_LEFT, yPos)
  doc.setDrawColor(...ACCENT)
  doc.setLineWidth(0.2)
  doc.line(MARGIN_LEFT, yPos + 1.5, MARGIN_LEFT + CONTENT_WIDTH, yPos + 1.5)
  return yPos + 7
}

export function addLabelValue(
  doc: jsPDF,
  label: string,
  value: string,
  yPos: number
): number {
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...TEXT_MED)
  doc.text(label, MARGIN_LEFT, yPos)
  const labelWidth = doc.getTextWidth(label + ' ')
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...TEXT_DARK)
  const wrappedValue = doc.splitTextToSize(value, CONTENT_WIDTH - labelWidth)
  doc.text(wrappedValue, MARGIN_LEFT + labelWidth, yPos)
  return yPos + wrappedValue.length * 4
}

export function addBodyText(
  doc: jsPDF,
  text: string,
  x: number,
  yPos: number,
  maxWidth: number
): number {
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...TEXT_DARK)
  const lines = doc.splitTextToSize(text, maxWidth)
  doc.text(lines, x, yPos)
  return yPos + lines.length * 4
}

export function checkPageBreak(doc: jsPDF, yPos: number, needed: number): number {
  if (yPos + needed > PAGE_BREAK_THRESHOLD) {
    doc.addPage()
    return 20
  }
  return yPos
}

export function addFooter(doc: jsPDF, title: string): void {
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...TEXT_LIGHT)
    doc.text(
      `${title} — Page ${i} of ${pageCount}`,
      PAGE_WIDTH / 2,
      290,
      { align: 'center' }
    )
  }
}
