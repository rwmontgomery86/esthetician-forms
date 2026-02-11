import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { TreatmentSeriesData, Settings } from '../types'
import {
  drawHeader,
  addSectionHeading,
  addFooter,
  checkPageBreak,
  ACCENT,
  ACCENT_DARK,
  TEXT_DARK,
  TEXT_MED,
  MARGIN_LEFT,
  MARGIN_RIGHT,
  PAGE_WIDTH,
  CONTENT_WIDTH,
} from './pdf-shared'

export function generateTreatmentSeriesPdf(
  data: TreatmentSeriesData,
  settings: Settings
): void {
  const doc = new jsPDF('portrait', 'mm', 'a4')

  // Header
  let yPos = drawHeader(doc, settings.logo, settings.profile)

  // Title
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...TEXT_DARK)
  doc.text('Professional Treatment Series Recommendation', PAGE_WIDTH / 2, yPos, {
    align: 'center',
  })
  yPos += 10

  // Selected treatments
  const selectedTreatments = settings.treatments.filter((t) =>
    data.selectedTreatmentIds.includes(t.id)
  )

  if (selectedTreatments.length > 0) {
    yPos = addSectionHeading(doc, 'Selected Treatments', yPos)

    const midPoint = Math.ceil(selectedTreatments.length / 2)
    const col1 = selectedTreatments.slice(0, midPoint)
    const col2 = selectedTreatments.slice(midPoint)

    const colWidth = CONTENT_WIDTH / 2

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')

    const startY = yPos
    col1.forEach((t, i) => {
      const y = startY + i * 5.5
      // Checkmark
      doc.setFillColor(...ACCENT)
      doc.roundedRect(MARGIN_LEFT, y - 2.8, 3.5, 3.5, 0.5, 0.5, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(7)
      doc.text('✓', MARGIN_LEFT + 0.8, y)
      // Name
      doc.setTextColor(...TEXT_DARK)
      doc.setFontSize(9)
      doc.text(t.name, MARGIN_LEFT + 6, y)
    })

    col2.forEach((t, i) => {
      const y = startY + i * 5.5
      const x = MARGIN_LEFT + colWidth
      doc.setFillColor(...ACCENT)
      doc.roundedRect(x, y - 2.8, 3.5, 3.5, 0.5, 0.5, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(7)
      doc.text('✓', x + 0.8, y)
      doc.setTextColor(...TEXT_DARK)
      doc.setFontSize(9)
      doc.text(t.name, x + 6, y)
    })

    yPos = startY + Math.max(col1.length, col2.length) * 5.5 + 4
  }

  // I PEEL callout
  yPos = checkPageBreak(doc, yPos, 18)
  doc.setFillColor(240, 244, 240) // accent-subtle
  doc.roundedRect(MARGIN_LEFT, yPos - 2, CONTENT_WIDTH, 14, 2, 2, 'F')
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...ACCENT_DARK)
  doc.text('I PEEL treatments', MARGIN_LEFT + 4, yPos + 3)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...TEXT_MED)
  doc.text(
    'are recommended in a series of 4–6 treatments at 2–4 week intervals for maximum results.',
    MARGIN_LEFT + 4,
    yPos + 8
  )
  yPos += 18

  // Treatment log table
  const logEntries = data.treatmentLog.filter((e) => e.treatmentName || e.date)
  const hasAnyLog = logEntries.length > 0

  yPos = checkPageBreak(doc, yPos, 40)
  yPos = addSectionHeading(doc, 'Treatment Log', yPos)

  // Always show 6 rows (filled or empty)
  const tableBody = data.treatmentLog.map((entry, i) => [
    String(i + 1),
    entry.treatmentName || (hasAnyLog ? '—' : ''),
    entry.date
      ? new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '',
  ])

  autoTable(doc, {
    startY: yPos,
    head: [['#', 'Treatment', 'Date']],
    body: tableBody,
    margin: { left: MARGIN_LEFT, right: MARGIN_RIGHT },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 40 },
    },
    headStyles: {
      fillColor: ACCENT,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: TEXT_DARK,
      minCellHeight: 8,
    },
    alternateRowStyles: {
      fillColor: [245, 248, 245],
    },
    theme: 'grid',
    tableLineColor: [220, 220, 216],
    tableLineWidth: 0.15,
  })

  // Footer
  addFooter(doc, 'Treatment Series Recommendation')

  doc.save('Treatment-Series-Recommendation.pdf')
}
