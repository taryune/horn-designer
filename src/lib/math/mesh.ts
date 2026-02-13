/**
 * 3D Mesh Generation for Waveguides v2
 * =====================================
 *
 * Combines R-OSSE guide curves, superellipse cross-sections, and dual modulation
 * to generate a complete 3D mesh representation of the acoustic waveguide.
 *
 * The mesh generation process:
 * 1. Generate independent H (horizontal) and V (vertical) R-OSSE guide curves
 * 2. For each station along the horn (parameter t):
 *    a. Apply shape blend to interpolate dimensions from circular to guide values
 *    b. Compute superellipse exponent with smoothstep blending
 *    c. Generate superellipse cross-section points
 *    d. Apply combined X and Cardinal modulation with shared blend zone
 *    e. Position the ring at the axial coordinate from H guide
 * 3. Connect rings with quad faces to form a watertight mesh
 *
 * New in v2:
 * - Smoothstep blending for C1 continuity (eliminates throat spikes)
 * - Dual modulation system (X diagonal + Cardinal axes)
 * - Separate blend zones for shape and modulation
 */

import type {
  CardinalModParams,
  DiagonalModParams,
  MeshData,
  MeshRing,
  ModulationBlendParams,
  ROSSEResult,
  ShapeBlendParams,
} from '../types/waveguide'
import { smoothLerp } from './blending'
import { combinedModulation, prepModParams } from './modulation'
import { lookupX, lookupY } from './rosse'

/**
 * Build complete 3D waveguide mesh with v2 dual modulation and smoothstep blending.
 *
 * This function generates a 3D mesh by:
 * - Using two independent R-OSSE curves for horizontal and vertical expansion
 * - Applying smoothstep blending for C1 continuous transitions
 * - Supporting both X (diagonal) and Cardinal (+) modulations
 * - Using separate blend zones for shape and modulation
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
 * @param shapeBlend - Shape blend zone parameters
 * @param modBlend - Modulation blend zone parameters
 * @param diagonalModParams - X-shape (diagonal) modulation parameters
 * @param cardModParams - Cardinal (+) modulation parameters
 * @param numRings - Number of rings to generate (default: 50)
 * @param numSlices - Angular divisions per ring (default: 72)
 * @returns Mesh data structure with rings and metadata, or null if invalid input
 */
export function buildMesh(
  hData: ROSSEResult | null,
  vData: ROSSEResult | null,
  shapeBlend: ShapeBlendParams,
  modBlend: ModulationBlendParams,
  diagonalModParams: DiagonalModParams,
  cardModParams: CardinalModParams,
  numRings: number = 50,
  numSlices: number = 72,
): MeshData | null {
  // Validate input
  if (!hData || !vData) return null

  const hPts = hData.points
  const vPts = vData.points
  const rings: MeshRing[] = []

  // Get throat radius (assuming circular at throat)
  const r0 = hPts[0].y

  // Precompute modulation normalization
  const modPrep = prepModParams(diagonalModParams, cardModParams)

  // Generate each cross-sectional ring
  for (let ri = 0; ri <= numRings; ri++) {
    // Parameter position along the horn [0..1]
    const t = ri / numRings

    // Get axial position from horizontal guide
    const xH = lookupX(hPts, t)

    // Get raw guide values
    const yH_raw = lookupY(hPts, t) // Raw H guide radius
    const yV_raw = lookupY(vPts, t) // Raw V guide radius

    // Interpolate dimensions from circular throat to guide values using smoothstep
    const yH = smoothLerp(
      r0,
      yH_raw,
      t,
      shapeBlend.shapeStart,
      shapeBlend.shapeEnd,
      shapeBlend.shapePow,
    )
    const yV = smoothLerp(
      r0,
      yV_raw,
      t,
      shapeBlend.shapeStart,
      shapeBlend.shapeEnd,
      shapeBlend.shapePow,
    )

    // Interpolate superellipse exponent: 2 (circle) → nMouth
    const n = smoothLerp(
      2,
      shapeBlend.nMouth,
      t,
      shapeBlend.shapeStart,
      shapeBlend.shapeEnd,
      shapeBlend.shapePow,
    )

    // Generate points around this ring
    const ring: [number, number, number][] = []
    for (let si = 0; si <= numSlices; si++) {
      // Angular position around the ring
      const theta = (2 * Math.PI * si) / numSlices
      const c = Math.cos(theta)
      const s = Math.sin(theta)

      // Generate base superellipse point
      // Parametric equation: (x, y) = (hw·sgn(cos)·|cos|^(2/n), hh·sgn(sin)·|sin|^(2/n))
      let px = yH * Math.sign(c) * Math.abs(c) ** (2 / n)
      let py = yV * Math.sign(s) * Math.abs(s) ** (2 / n)

      // Apply combined modulation (X + Cardinal)
      const mod = combinedModulation(theta, t, modPrep, modBlend)
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
