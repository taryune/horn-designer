/**
 * Shell Mesh Generation for CAD Export
 * =====================================
 *
 * Generates hollow shell meshes with wall thickness for manufacturing.
 * Creates inner surface by offsetting vertices along normals.
 */

import type { MeshData, ShellParams } from '../types/waveguide'

/**
 * Shell mesh data with inner surface (acoustic path), outer surface (structure), and caps.
 */
export interface ShellMeshData {
  /** Inner surface rings (acoustic waveguide - original R-OSSE design) */
  innerRings: [number, number, number][][]

  /** Outer surface rings (structural shell - design + thickness offset outward) */
  outerRings: [number, number, number][][]

  /** Vertex normals for both surfaces */
  normals: [number, number, number][]

  /** Number of slices per ring */
  numSlices: number

  /** Whether throat cap should be generated */
  hasThroatCap: boolean

  /** Whether mouth cap should be generated */
  hasMouthCap: boolean
}

/**
 * Normalize a 3D vector.
 */
function normalize(x: number, y: number, z: number): [number, number, number] {
  const len = Math.sqrt(x * x + y * y + z * z)
  if (len < 1e-10) return [0, 0, 1]
  return [x / len, y / len, z / len]
}

/**
 * Calculate vertex normals by averaging adjacent face normals.
 *
 * @param meshData - Original mesh data
 * @returns Array of normalized normals for each vertex
 */
function calculateVertexNormals(meshData: MeshData): [number, number, number][] {
  const { rings, numSlices } = meshData
  const vertsPerRing = numSlices + 1
  const totalVerts = rings.length * vertsPerRing

  // Initialize normal accumulator
  const normals: [number, number, number][] = Array(totalVerts)
    .fill(null)
    .map(() => [0, 0, 0])

  // Process each quad face
  for (let ri = 0; ri < rings.length - 1; ri++) {
    for (let si = 0; si < numSlices; si++) {
      const a = ri * vertsPerRing + si
      const b = ri * vertsPerRing + si + 1
      const c = (ri + 1) * vertsPerRing + si + 1
      const d = (ri + 1) * vertsPerRing + si

      const vA = rings[ri].ring[si]
      const vB = rings[ri].ring[si + 1]
      const vD = rings[ri + 1].ring[si]

      // Calculate face normal from two edges
      const e1x = vB[0] - vA[0]
      const e1y = vB[1] - vA[1]
      const e1z = vB[2] - vA[2]

      const e2x = vD[0] - vA[0]
      const e2y = vD[1] - vA[1]
      const e2z = vD[2] - vA[2]

      // Cross product
      let nx = e1y * e2z - e1z * e2y
      let ny = e1z * e2x - e1x * e2z
      let nz = e1x * e2y - e1y * e2x

      // Normalize
      ;[nx, ny, nz] = normalize(nx, ny, nz)

      // Accumulate to all four vertices
      normals[a][0] += nx
      normals[a][1] += ny
      normals[a][2] += nz

      normals[b][0] += nx
      normals[b][1] += ny
      normals[b][2] += nz

      normals[c][0] += nx
      normals[c][1] += ny
      normals[c][2] += nz

      normals[d][0] += nx
      normals[d][1] += ny
      normals[d][2] += nz
    }
  }

  // Fix seam normals: vertices at si=0 and si=numSlices are at the same position
  // They should share the same normal to avoid gaps after offset
  for (let ri = 0; ri < rings.length; ri++) {
    const idx0 = ri * vertsPerRing + 0
    const idxLast = ri * vertsPerRing + numSlices

    // Average the accumulated normals from both seam vertices
    const avgX = normals[idx0][0] + normals[idxLast][0]
    const avgY = normals[idx0][1] + normals[idxLast][1]
    const avgZ = normals[idx0][2] + normals[idxLast][2]

    // Apply the averaged normal to both seam vertices
    normals[idx0][0] = avgX
    normals[idx0][1] = avgY
    normals[idx0][2] = avgZ

    normals[idxLast][0] = avgX
    normals[idxLast][1] = avgY
    normals[idxLast][2] = avgZ
  }

  // Normalize all accumulated normals
  for (let i = 0; i < totalVerts; i++) {
    normals[i] = normalize(normals[i][0], normals[i][1], normals[i][2])
  }

  return normals
}

/**
 * Generate shell mesh with inner and outer surfaces.
 *
 * Creates a hollow shell by:
 * 1. Using original mesh as INNER surface (acoustic waveguide - exact R-OSSE design)
 * 2. Offsetting vertices OUTWARD along normals for OUTER surface (structural shell)
 * 3. Optionally generating cap faces at throat and/or mouth
 *
 * This ensures the acoustic path matches your designed R-OSSE geometry exactly,
 * with thickness added on the exterior for structural strength.
 *
 * @param meshData - Original mesh data (represents acoustic path)
 * @param shellParams - Shell thickness parameters
 * @returns Shell mesh data with both surfaces
 */
export function generateShellMesh(
  meshData: MeshData,
  shellParams: ShellParams,
): ShellMeshData | null {
  if (!meshData || !shellParams.enabled) return null

  const { rings, numSlices } = meshData
  const { thickness, throatCap, mouthCap } = shellParams

  // Calculate normals for all vertices
  const normals = calculateVertexNormals(meshData)

  // Original mesh becomes INNER surface (acoustic waveguide path)
  const innerRings = rings.map((r) => r.ring)

  // Generate OUTER surface by offsetting vertices OUTWARD (structural shell)
  const outerRings: [number, number, number][][] = []
  const vertsPerRing = numSlices + 1

  for (let ri = 0; ri < rings.length; ri++) {
    const outerRing: [number, number, number][] = []

    for (let si = 0; si <= numSlices; si++) {
      const vertIdx = ri * vertsPerRing + si
      const [x, y, z] = rings[ri].ring[si]
      const [nx, ny, nz] = normals[vertIdx]

      // Offset OUTWARD (add thickness to exterior)
      const outerX = x + nx * thickness
      const outerY = y + ny * thickness
      const outerZ = z + nz * thickness

      outerRing.push([outerX, outerY, outerZ])
    }

    // Ensure wraparound vertex (last) exactly matches first vertex (closes seam)
    outerRing[numSlices] = [...outerRing[0]]

    outerRings.push(outerRing)
  }

  return {
    innerRings,
    outerRings,
    normals,
    numSlices,
    hasThroatCap: throatCap,
    hasMouthCap: mouthCap,
  }
}
