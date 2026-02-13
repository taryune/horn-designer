/**
 * Dual Modulation System for R-OSSE Waveguide
 * ============================================
 *
 * Implements both Diagonal and Cardinal modulations
 * to control material distribution in the cross-section.
 *
 * Diagonal modulation: Peaks at 45°, 135°, 225°, 315° (diagonals)
 * Cardinal modulation: Peaks at 0°, 90°, 180°, 270° (axes)
 *
 * Both modulations share the same blend zone and are normalized
 * to preserve cross-sectional area.
 */

import type {
  CardinalModParams,
  DiagonalModParams,
  ModulationBlendParams,
} from '../types/waveguide'
import { poweredSmoothstep } from './blending'

/**
 * Compute raw diagonal modulation value.
 *
 * Uses |sin(freq·θ)|^exp to create diagonal peaks.
 *
 * @param theta - Angle in radians [0..2π]
 * @param params - Diagonal modulation parameters
 * @returns Raw modulation value
 */
export function modRawDiagonal(theta: number, params: DiagonalModParams): number {
  const { base, amp, freq, exp } = params
  return base + amp * Math.abs(Math.sin(freq * theta)) ** exp
}

/**
 * Compute raw cardinal modulation value.
 *
 * Uses |cos(freq·θ)|^exp to create cardinal (axis) peaks.
 *
 * @param theta - Angle in radians [0..2π]
 * @param params - Cardinal modulation parameters
 * @returns Raw modulation value
 */
export function modRawCardinal(theta: number, params: CardinalModParams): number {
  const { base, amp, freq, exp } = params
  return base + amp * Math.abs(Math.cos(freq * theta)) ** exp
}

/**
 * Modulation preparation data with precomputed averages.
 */
export interface ModulationPrep {
  /** Diagonal modulation parameters with average */
  diagonal: DiagonalModParams & { _avg: number }
  /** Cardinal modulation parameters with average */
  cardinal: CardinalModParams & { _avg: number }
}

/**
 * Precompute modulation averages for normalization.
 *
 * Calculates the average value of each modulation over a full
 * rotation to enable normalization that preserves area.
 *
 * @param diagonalMod - Diagonal modulation parameters
 * @param cardinalMod - Cardinal modulation parameters
 * @param numSamples - Number of samples for integration (default: 360)
 * @returns Prepared modulation data with averages
 */
export function prepModParams(
  diagonalMod: DiagonalModParams,
  cardinalMod: CardinalModParams,
  numSamples: number = 360,
): ModulationPrep {
  // Calculate average for diagonal modulation
  let sumDiagonal = 0
  let sumCardinal = 0

  for (let i = 0; i < numSamples; i++) {
    const theta = (2 * Math.PI * i) / numSamples

    if (diagonalMod.enabled) {
      sumDiagonal += modRawDiagonal(theta, diagonalMod)
    }

    if (cardinalMod.enabled) {
      sumCardinal += modRawCardinal(theta, cardinalMod)
    }
  }

  // If disabled, average is 1.0 (no effect when normalized)
  const avgDiagonal = diagonalMod.enabled ? sumDiagonal / numSamples : 1.0
  const avgCardinal = cardinalMod.enabled ? sumCardinal / numSamples : 1.0

  return {
    diagonal: { ...diagonalMod, _avg: avgDiagonal },
    cardinal: { ...cardinalMod, _avg: avgCardinal },
  }
}

/**
 * Calculate combined modulation multiplier.
 *
 * Combines diagonal and cardinal modulations with proper normalization
 * and blending from throat to mouth.
 *
 * @param theta - Angle in radians [0..2π]
 * @param t - Axial parameter [0..1] (0 = throat, 1 = mouth)
 * @param prep - Prepared modulation data
 * @param modBlend - Modulation blend parameters
 * @returns Combined multiplier (centered on 1.0)
 */
export function combinedModulation(
  theta: number,
  t: number,
  prep: ModulationPrep,
  modBlend: ModulationBlendParams,
): number {
  // Calculate modulation blend factor
  const mf = poweredSmoothstep(t, modBlend.modStart, modBlend.modEnd, modBlend.modPow)

  // Start with unity multiplier
  let multiplier = 1.0

  // Add diagonal modulation contribution
  if (prep.diagonal.enabled && prep.diagonal._avg > 0) {
    const rawDiagonal = modRawDiagonal(theta, prep.diagonal)
    const normalizedDiagonal = rawDiagonal / prep.diagonal._avg
    multiplier += mf * (normalizedDiagonal - 1)
  }

  // Add cardinal modulation contribution
  if (prep.cardinal.enabled && prep.cardinal._avg > 0) {
    const rawCardinal = modRawCardinal(theta, prep.cardinal)
    const normalizedCardinal = rawCardinal / prep.cardinal._avg
    multiplier += mf * (normalizedCardinal - 1)
  }

  // Safety floor to prevent collapse
  return Math.max(0.1, multiplier)
}

/**
 * Generate preview points for combined modulation visualization.
 *
 * @param diagonalMod - Diagonal modulation parameters
 * @param cardinalMod - Cardinal modulation parameters
 * @param numPoints - Number of points to generate
 * @returns Object with separate and combined polar data
 */
export function generateModulationPreview(
  diagonalMod: DiagonalModParams,
  cardinalMod: CardinalModParams,
  numPoints: number = 360,
): {
  diagonalPoints: [number, number][]
  cardinalPoints: [number, number][]
  combinedPoints: [number, number][]
  prep: ModulationPrep
} {
  // Prepare modulation with averages
  const prep = prepModParams(diagonalMod, cardinalMod, numPoints)

  const diagonalPoints: [number, number][] = []
  const cardinalPoints: [number, number][] = []
  const combinedPoints: [number, number][] = []

  // Use full effect (t=1) for preview
  const modBlend = { modStart: 0, modEnd: 0, modPow: 1 }

  for (let i = 0; i <= numPoints; i++) {
    const theta = (2 * Math.PI * i) / numPoints

    // Diagonal modulation raw shape
    if (diagonalMod.enabled) {
      const rDiagonal = modRawDiagonal(theta, diagonalMod)
      diagonalPoints.push([rDiagonal, theta])
    }

    // Cardinal modulation raw shape
    if (cardinalMod.enabled) {
      const rCardinal = modRawCardinal(theta, cardinalMod)
      cardinalPoints.push([rCardinal, theta])
    }

    // Combined normalized multiplier
    const mult = combinedModulation(theta, 1, prep, modBlend)
    combinedPoints.push([mult, theta])
  }

  return {
    diagonalPoints,
    cardinalPoints,
    combinedPoints,
    prep,
  }
}
