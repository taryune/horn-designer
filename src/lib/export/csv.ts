/**
 * CSV Export for Waveguide Meshes
 * ================================
 *
 * Exports mesh data to CSV format suitable for CAD import and analysis.
 */

import type { MeshData } from '../types/waveguide'

/**
 * Export mesh to CSV format.
 *
 * Format: ring, slice, x_mm, y_mm, z_mm, t
 * - ring: ring index (0 = throat)
 * - slice: angular slice index
 * - x_mm, y_mm: cross-sectional coordinates
 * - z_mm: axial coordinate
 * - t: parameter value [0..1]
 *
 * @param meshData - Generated mesh data
 * @returns CSV string with header and data rows
 */
export function exportToCSV(meshData: MeshData | null): string {
  if (!meshData) return ''

  const { rings } = meshData
  let csv = 'ring,slice,x_mm,y_mm,z_mm,t\n'

  for (const [ri, { ring, t }] of rings.entries()) {
    for (const [si, [px, py, pz]] of ring.entries()) {
      csv += `${ri},${si},${px.toFixed(4)},${py.toFixed(4)},${pz.toFixed(4)},${t.toFixed(4)}\n`
    }
  }

  return csv
}

/**
 * Download CSV file to user's computer.
 *
 * @param meshData - Generated mesh data
 * @param filename - Output filename (default: "waveguide.csv")
 */
export function downloadCSV(meshData: MeshData | null, filename: string = 'waveguide.csv'): void {
  const csv = exportToCSV(meshData)
  if (!csv) return

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
