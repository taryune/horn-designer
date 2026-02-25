/**
 * STL Export for Waveguide Meshes
 * ================================
 *
 * Exports mesh data to binary STL format for 3D printing and CAD.
 * Supports shell thickness with inner/outer surfaces and caps.
 *
 * Surface definitions:
 * - INNER surface: Acoustic waveguide path (exact R-OSSE design)
 * - OUTER surface: Structural shell (design + thickness offset outward)
 *
 * When shell thickness is enabled, thickness is added to the BACKSIDE (exterior)
 * of the waveguide, preserving the designed acoustic path dimensions.
 */

import { generateShellMesh, type ShellMeshData } from '../math/shell'
import type { MeshData, ShellParams } from '../types/waveguide'

/**
 * Calculate normal vector for a triangle.
 */
function calculateTriangleNormal(
  v1: [number, number, number],
  v2: [number, number, number],
  v3: [number, number, number],
): [number, number, number] {
  // Edge vectors
  const e1x = v2[0] - v1[0]
  const e1y = v2[1] - v1[1]
  const e1z = v2[2] - v1[2]

  const e2x = v3[0] - v1[0]
  const e2y = v3[1] - v1[1]
  const e2z = v3[2] - v1[2]

  // Cross product
  const nx = e1y * e2z - e1z * e2y
  const ny = e1z * e2x - e1x * e2z
  const nz = e1x * e2y - e1y * e2x

  // Normalize
  const len = Math.sqrt(nx * nx + ny * ny + nz * nz)
  if (len < 1e-10) return [0, 0, 1]

  return [nx / len, ny / len, nz / len]
}

/**
 * Write a triangle to the STL data view.
 */
function writeTriangle(
  view: DataView,
  offset: number,
  v1: [number, number, number],
  v2: [number, number, number],
  v3: [number, number, number],
): number {
  // Calculate and write normal
  const [nx, ny, nz] = calculateTriangleNormal(v1, v2, v3)
  view.setFloat32(offset, nx, true)
  view.setFloat32(offset + 4, ny, true)
  view.setFloat32(offset + 8, nz, true)
  offset += 12

  // Write vertices
  view.setFloat32(offset, v1[0], true)
  view.setFloat32(offset + 4, v1[1], true)
  view.setFloat32(offset + 8, v1[2], true)
  offset += 12

  view.setFloat32(offset, v2[0], true)
  view.setFloat32(offset + 4, v2[1], true)
  view.setFloat32(offset + 8, v2[2], true)
  offset += 12

  view.setFloat32(offset, v3[0], true)
  view.setFloat32(offset + 4, v3[1], true)
  view.setFloat32(offset + 8, v3[2], true)
  offset += 12

  // Attribute byte count (unused)
  view.setUint16(offset, 0, true)
  offset += 2

  return offset
}

/**
 * Count total triangles in the mesh.
 */
function countTriangles(meshData: MeshData, shellData: ShellMeshData | null): number {
  const { rings, numSlices } = meshData
  const numRings = rings.length

  // Inner surface quads (2 triangles each)
  let count = (numRings - 1) * numSlices * 2

  if (shellData) {
    // Outer surface quads
    count += (numRings - 1) * numSlices * 2

    // Throat edge strip (always when shell enabled)
    count += numSlices * 2

    // Mouth edge strip (always when shell enabled)
    count += numSlices * 2
  }

  return count
}

/**
 * Export mesh to binary STL format.
 *
 * Binary STL structure:
 * - 80 byte header
 * - 4 byte triangle count (uint32)
 * - For each triangle (50 bytes):
 *   - 12 bytes: normal (3x float32)
 *   - 36 bytes: 3 vertices (3x 3x float32)
 *   - 2 bytes: attribute count (uint16, usually 0)
 *
 * Surface generation:
 * - Without shell: Exports only inner surface (acoustic path, reversed winding)
 * - With shell: Exports both surfaces + optional caps
 *   - Inner: Acoustic waveguide (inward-facing normals)
 *   - Outer: Structural shell (outward-facing normals)
 *   - Caps: Connect inner↔outer at throat/mouth ends
 *
 * @param meshData - Generated mesh data (represents acoustic path)
 * @param shellParams - Shell thickness parameters
 * @returns Binary STL as ArrayBuffer
 */
export function exportToSTL(meshData: MeshData | null, shellParams: ShellParams): ArrayBuffer {
  if (!meshData) return new ArrayBuffer(0)

  // Generate shell mesh if thickness is enabled
  const shellData = generateShellMesh(meshData, shellParams)
  const { rings, numSlices } = meshData

  // Count total triangles
  const triangleCount = countTriangles(meshData, shellData)

  // Allocate buffer: 80 (header) + 4 (count) + 50 * triangles
  const bufferSize = 80 + 4 + triangleCount * 50
  const buffer = new ArrayBuffer(bufferSize)
  const view = new DataView(buffer)

  // Write header (80 bytes)
  const headerText = 'Binary STL - Horn Designer - R-OSSE Waveguide'
  for (let i = 0; i < Math.min(headerText.length, 80); i++) {
    view.setUint8(i, headerText.charCodeAt(i))
  }

  // Write triangle count
  view.setUint32(80, triangleCount, true)

  let offset = 84

  // Write inner surface triangles (acoustic waveguide - original R-OSSE design)
  // Reversed winding for inward-facing normals
  for (let ri = 0; ri < rings.length - 1; ri++) {
    for (let si = 0; si < numSlices; si++) {
      const v1 = rings[ri].ring[si]
      const v2 = rings[ri].ring[si + 1]
      const v3 = rings[ri + 1].ring[si + 1]
      const v4 = rings[ri + 1].ring[si]

      // Split quad into two triangles (reversed winding for inward normals)
      offset = writeTriangle(view, offset, v1, v4, v3)
      offset = writeTriangle(view, offset, v1, v3, v2)
    }
  }

  // Write outer surface and caps if shell is enabled
  if (shellData) {
    const { outerRings, innerRings } = shellData

    // Outer surface triangles (structural shell - design + thickness)
    // Normal winding for outward-facing normals
    for (let ri = 0; ri < outerRings.length - 1; ri++) {
      for (let si = 0; si < numSlices; si++) {
        const v1 = outerRings[ri][si]
        const v2 = outerRings[ri][si + 1]
        const v3 = outerRings[ri + 1][si + 1]
        const v4 = outerRings[ri + 1][si]

        // Normal winding order for outer surface
        offset = writeTriangle(view, offset, v1, v2, v3)
        offset = writeTriangle(view, offset, v1, v3, v4)
      }
    }

    // Throat edge strip (connects outer[0] to inner[0])
    // Always generate when shell is enabled to close the gap between surfaces
    const throatOuterRing = outerRings[0]
    const throatInnerRing = innerRings[0]

    for (let si = 0; si < numSlices; si++) {
      const o1 = throatOuterRing[si]
      const o2 = throatOuterRing[si + 1]
      const i1 = throatInnerRing[si]
      const i2 = throatInnerRing[si + 1]

      // Create quad strip (2 triangles)
      offset = writeTriangle(view, offset, o1, i1, i2)
      offset = writeTriangle(view, offset, o1, i2, o2)
    }

    // Mouth edge strip (connects outer[N] to inner[N])
    // Always generate when shell is enabled to close the gap between surfaces
    const lastIdx = outerRings.length - 1
    const mouthOuterRing = outerRings[lastIdx]
    const mouthInnerRing = innerRings[lastIdx]

    for (let si = 0; si < numSlices; si++) {
      const o1 = mouthOuterRing[si]
      const o2 = mouthOuterRing[si + 1]
      const i1 = mouthInnerRing[si]
      const i2 = mouthInnerRing[si + 1]

      // Create quad strip (2 triangles, reversed winding)
      offset = writeTriangle(view, offset, o1, o2, i2)
      offset = writeTriangle(view, offset, o1, i2, i1)
    }
  }

  return buffer
}

/**
 * Download STL file to user's computer.
 *
 * @param meshData - Generated mesh data
 * @param shellParams - Shell thickness parameters
 * @param filename - Output filename (default: "waveguide.stl")
 */
export function downloadSTL(
  meshData: MeshData | null,
  shellParams: ShellParams,
  filename: string = 'horn-designer.stl',
): void {
  const buffer = exportToSTL(meshData, shellParams)
  if (buffer.byteLength === 0) return

  const blob = new Blob([buffer], { type: 'application/octet-stream' })
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
