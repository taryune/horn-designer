/**
 * 3D Mesh Generation for Waveguides
 * ==================================
 *
 * Combines R-OSSE guide curves, superellipse cross-sections, and X-modulation
 * to generate a complete 3D mesh representation of the acoustic waveguide.
 *
 * The mesh generation process:
 * 1. Generate independent H (horizontal) and V (vertical) R-OSSE guide curves
 * 2. For each station along the horn (parameter t):
 *    a. Get half-width from H guide, half-height from V guide
 *    b. Compute superellipse exponent (morphing from circle to rectangle)
 *    c. Generate superellipse cross-section points
 *    d. Apply X-modulation as a radial multiplier
 *    e. Position the ring at the axial coordinate from H guide
 * 3. Connect rings with quad faces to form a watertight mesh
 */

import type {
  MeshData,
  MeshRing,
  ROSSEResult,
  SuperellipseParams,
  XModParams,
} from '../types/waveguide'
import { lookupX, lookupY } from './rosse'
import { computeSuperellipseN } from './superellipse'
import { xModulation } from './xModulation'

/**
 * Build complete 3D waveguide mesh from guide curves and modulation parameters.
 *
 * This function generates a 3D mesh by:
 * - Using two independent R-OSSE curves for horizontal and vertical expansion
 * - Applying superellipse cross-sections that morph from circular to rectangular
 * - Optionally applying X-shape polar modulation for diagonal reinforcement
 *
 * The mesh consists of:
 * - numRings + 1 cross-sectional rings from throat (t=0) to mouth (t=1)
 * - numSlices + 1 points per ring (including closing point at θ=2π)
 * - Quad faces connecting adjacent rings
 *
 * Coordinate system:
 * - X, Y: cross-sectional plane (X = horizontal, Y = vertical)
 * - Z: axial direction (along the horn, from throat to mouth)
 *
 * @param hData - Horizontal R-OSSE guide curve result
 * @param vData - Vertical R-OSSE guide curve result
 * @param superParams - Superellipse morphing parameters
 * @param xModParams - X-shape modulation parameters
 * @param numRings - Number of rings to generate (default: 50)
 * @param numSlices - Angular divisions per ring (default: 72)
 * @returns Mesh data structure with rings and metadata, or null if invalid input
 *
 * @example
 * ```typescript
 * const hResult = computeROSSE(hParams);
 * const vResult = computeROSSE(vParams);
 *
 * if (hResult && vResult) {
 *   const mesh = buildMesh(hResult, vResult, superParams, xModParams);
 *   if (mesh) {
 *     console.log(`Generated ${mesh.rings.length} rings`);
 *     console.log(`Each ring has ${mesh.numSlices + 1} points`);
 *   }
 * }
 * ```
 */
export function buildMesh(
  hData: ROSSEResult | null,
  vData: ROSSEResult | null,
  superParams: SuperellipseParams,
  xModParams: XModParams,
  numRings: number = 50,
  numSlices: number = 72,
): MeshData | null {
  // Validate input
  if (!hData || !vData) return null

  const { nMouth, transStart, shapePow } = superParams
  const hPts = hData.points
  const vPts = vData.points
  const rings: MeshRing[] = []

  // Generate each cross-sectional ring
  for (let ri = 0; ri <= numRings; ri++) {
    // Parameter position along the horn [0..1]
    const t = ri / numRings

    // Get axial position and radial dimensions from guide curves
    const xH = lookupX(hPts, t) // Axial position (from horizontal guide)
    const yH = lookupY(hPts, t) // Half-width (horizontal radius)
    const yV = lookupY(vPts, t) // Half-height (vertical radius)

    // Compute superellipse exponent for this station
    // Morphs from 2 (circle) at throat to nMouth (rectangular) at mouth
    const n = computeSuperellipseN(t, nMouth, transStart, shapePow)

    // Generate points around this ring
    const ring: [number, number, number][] = []
    for (let si = 0; si <= numSlices; si++) {
      // Angular position around the ring
      const th = (2 * Math.PI * si) / numSlices
      const c = Math.cos(th)
      const s = Math.sin(th)

      // Generate base superellipse point
      // Parametric equation: (x, y) = (hw·sgn(cos)·|cos|^(2/n), hh·sgn(sin)·|sin|^(2/n))
      let px = yH * Math.sign(c) * Math.abs(c) ** (2 / n)
      let py = yV * Math.sign(s) * Math.abs(s) ** (2 / n)

      // Apply X-shape modulation as radial multiplier
      // This creates diagonal reinforcement, blended from throat to mouth
      const mod = xModulation(th, t, xModParams)
      px *= mod
      py *= mod

      // Store point as [x, y, z] where z is axial position
      ring.push([px, py, xH])
    }

    // Store ring with metadata
    rings.push({ t, ring, xH, yH, yV, n })
  }

  return { rings, numSlices }
}

/**
 * Calculate computed geometry metrics from mesh data.
 *
 * Extracts key dimensions for display:
 * - Throat radius (at t=0)
 * - Mouth dimensions (at t=1)
 * - Axial depth (throat to mouth)
 * - Coverage angle (estimated from final dimensions)
 *
 * @param meshData - Generated mesh data
 * @returns Object with throat, depth, mouthWidth, mouthHeight, or null if invalid
 */
export function computeMeshMetrics(meshData: MeshData | null): {
  throat: number
  depth: number
  mouthWidth: number
  mouthHeight: number
} | null {
  if (!meshData || meshData.rings.length === 0) return null

  const firstRing = meshData.rings[0]
  const lastRing = meshData.rings[meshData.rings.length - 1]

  return {
    throat: firstRing.yH, // Throat radius (assuming circular)
    depth: lastRing.xH, // Axial depth from throat to mouth
    mouthWidth: lastRing.yH * 2, // Mouth width (horizontal diameter)
    mouthHeight: lastRing.yV * 2, // Mouth height (vertical diameter)
  }
}
