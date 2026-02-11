import jsPDF from 'jspdf'
import type { SkincareRoutineData, Settings } from '../types'
import {
  drawHeader,
  addSectionHeading,
  addLabelValue,
  addBodyText,
  addFooter,
  checkPageBreak,
  ACCENT,
  TEXT_DARK,
  TEXT_MED,
  MARGIN_LEFT,
  MARGIN_RIGHT,
  PAGE_WIDTH,
  CONTENT_WIDTH,
} from './pdf-shared'

export function generateSkincareRoutinePdf(
  data: SkincareRoutineData,
  settings: Settings
): void {
  const doc = new jsPDF('portrait', 'mm', 'a4')

  // Header
  let yPos = drawHeader(doc, settings.logo, settings.profile)

  // Title
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...TEXT_DARK)
  doc.text('Recommended Skincare Routine', PAGE_WIDTH / 2, yPos, { align: 'center' })
  yPos += 10

  // Client info bar
  doc.setFillColor(240, 244, 240)
  doc.roundedRect(MARGIN_LEFT, yPos - 3, CONTENT_WIDTH, 12, 2, 2, 'F')

  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...TEXT_MED)
  doc.text('Client:', MARGIN_LEFT + 4, yPos + 3)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...TEXT_DARK)
  doc.text(data.clientName || '—', MARGIN_LEFT + 18, yPos + 3)

  const dateStr = data.date
    ? new Date(data.date + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '—'
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...TEXT_MED)
  doc.text('Date:', PAGE_WIDTH - MARGIN_RIGHT - 50, yPos + 3)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...TEXT_DARK)
  doc.text(dateStr, PAGE_WIDTH - MARGIN_RIGHT - 38, yPos + 3)

  yPos += 14

  // Specialist
  if (data.specialistName) {
    yPos = addLabelValue(doc, 'Skincare Specialist:', data.specialistName, yPos)
    yPos += 4
  }

  // Morning routine
  yPos = checkPageBreak(doc, yPos, 30)
  yPos = addSectionHeading(doc, 'Morning Routine', yPos)

  const morningFields = [
    { label: 'Cleanser:', value: data.morning.cleanser },
    { label: 'Serum:', value: data.morning.serum },
    { label: 'Protect (SPF):', value: data.morning.protect },
  ]

  for (const field of morningFields) {
    if (field.value) {
      yPos = addRoutineRow(doc, field.label, field.value, yPos)
    } else {
      yPos = addRoutineRow(doc, field.label, '—', yPos)
    }
  }
  yPos += 4

  // Evening routine
  yPos = checkPageBreak(doc, yPos, 30)
  yPos = addSectionHeading(doc, 'Evening Routine', yPos)

  const eveningFields = [
    { label: 'Cleanser:', value: data.evening.cleanser },
    { label: 'Serum:', value: data.evening.serum },
    { label: 'Night Creme:', value: data.evening.nightCreme },
  ]

  for (const field of eveningFields) {
    if (field.value) {
      yPos = addRoutineRow(doc, field.label, field.value, yPos)
    } else {
      yPos = addRoutineRow(doc, field.label, '—', yPos)
    }
  }
  yPos += 4

  // Add-Ons
  const hasAddOns =
    data.addOns.masque || data.addOns.eyeTreatment || data.addOns.specialty
  if (hasAddOns) {
    yPos = checkPageBreak(doc, yPos, 25)
    yPos = addSectionHeading(doc, 'Add-Ons', yPos)

    if (data.addOns.masque) {
      yPos = addRoutineRow(doc, 'Masque:', data.addOns.masque, yPos)
    }
    if (data.addOns.eyeTreatment) {
      yPos = addRoutineRow(doc, 'Eye Treatment:', data.addOns.eyeTreatment, yPos)
    }
    if (data.addOns.specialty) {
      yPos = addRoutineRow(doc, 'Specialty:', data.addOns.specialty, yPos)
    }
    yPos += 4
  }

  // Notes
  if (data.notes) {
    yPos = checkPageBreak(doc, yPos, 20)
    yPos = addSectionHeading(doc, 'Notes', yPos)
    yPos = addBodyText(doc, data.notes, MARGIN_LEFT + 2, yPos, CONTENT_WIDTH - 4)
  }

  // Footer
  addFooter(doc, 'Recommended Skincare Routine')

  const pdfUrl = doc.output('bloburl') as unknown as string
  window.open(pdfUrl, '_blank')
}

function addRoutineRow(
  doc: jsPDF,
  label: string,
  value: string,
  yPos: number
): number {
  const rowHeight = 7
  const labelWidth = 34

  // Light background row
  doc.setFillColor(250, 250, 248)
  doc.setDrawColor(229, 229, 224) // border
  doc.rect(MARGIN_LEFT, yPos - 3.5, CONTENT_WIDTH, rowHeight, 'FD')

  // Accent left stripe
  doc.setFillColor(...ACCENT)
  doc.rect(MARGIN_LEFT, yPos - 3.5, 1.5, rowHeight, 'F')

  // Label
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...TEXT_MED)
  doc.text(label, MARGIN_LEFT + 5, yPos + 0.5)

  // Value
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...TEXT_DARK)
  doc.text(value, MARGIN_LEFT + labelWidth, yPos + 0.5)

  return yPos + rowHeight + 1
}
