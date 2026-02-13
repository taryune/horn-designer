/**
 * R-OSSE Parametric Equations
 * ============================
 * Based on: "R-OSSE Acoustic Waveguide" by Marcel Batík (December 2022)
 * Reference: http://www.at-horns.eu
 *
 * Implements the Radial Oblate Spheroid Symmetric Expansion (R-OSSE)
 * parametric equations for designing acoustic waveguide profiles.
 */

import type { ROSSEParams, ROSSEPoint, ROSSEResult } from '../types/waveguide'

/**
 * Compute R-OSSE axisymmetric waveguide profile.
 *
 * This function calculates a smooth expansion profile from the throat to the mouth
 * of a horn using parametric equations that ensure controlled directivity and
 * minimal acoustic distortion.
 *
 * The profile is defined by parametric equations x(t) and y(t) where:
 * - t: parameter ranging from 0 (throat) to 1 (mouth)
 * - x(t): axial distance from throat [mm]
 * - y(t): radial distance from central axis [mm]
 *
 * Design Parameters:
 * - R: Outer radius at mouth [mm]
 * - r0: Throat radius [mm]
 * - a0_deg: Throat opening half-angle [degrees] - controls initial expansion rate
 * - a_deg: Nominal coverage half-angle [degrees] - determines final directivity
 * - k: Throat expansion factor (1 = exact OS, >1 = expanded throat)
 * - rho: Apex radius factor - affects curvature near the throat
 * - b: Bending factor - adds quadratic correction to axial profile
 * - m: Apex shift factor - shifts the apex position along the profile
 * - q: Throat shape factor - controls transition from throat to mouth
 *
 * @param params - R-OSSE design parameters
 * @param numPoints - Number of points to generate (default: 300)
 * @returns Profile data with points and auxiliary constants, or null if invalid
 *
 * @example
 * ```typescript
 * const result = computeROSSE({
 *   R: 100, r0: 12.5, a0_deg: 45, a_deg: 45,
 *   k: 1.2, rho: 0.3, b: 0.2, m: 0.5, q: 2.0
 * });
 * if (result) {
 *   console.log(`Horn length: ${result.L.toFixed(2)} mm`);
 *   console.log(`Points generated: ${result.points.length}`);
 * }
 * ```
 */
export function computeROSSE(params: ROSSEParams, numPoints: number = 300): ROSSEResult | null {
  const { R, r0, a0_deg, a_deg, k, rho, b, m, q } = params

  // Convert angles from degrees to radians
  const a0 = (a0_deg * Math.PI) / 180
  const a = (a_deg * Math.PI) / 180

  // Compute auxiliary constants for the parametric equations
  // c1, c2, c3 are coefficients in the radial equation y(t)
  const c1 = (k * r0) ** 2
  const c2 = 2 * k * r0 * Math.tan(a0)
  const c3 = Math.tan(a) ** 2

  // Check discriminant for valid geometry
  // The discriminant must be non-negative for the horn to have a real solution
  const disc = c2 * c2 - 4 * c3 * (c1 - (R + r0 * (k - 1)) ** 2)
  if (disc < 0) {
    // Invalid parameter combination - would result in imaginary geometry
    return null
  }

  // Calculate axial length L from the discriminant
  // This is the total depth of the horn from throat to mouth
  const L = (1 / (2 * c3)) * (Math.sqrt(disc) - c2)

  // Generate profile points
  const points: ROSSEPoint[] = []
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints

    // x(t) - Axial position along the horn
    // First term: oblate spheroid base profile
    // Second term: bending correction (quadratic in t)
    const x =
      L * (Math.sqrt(rho * rho + m * m) - Math.sqrt(rho * rho + (t - m) ** 2)) +
      b * L * (Math.sqrt(rho * rho + (1 - m) ** 2) - Math.sqrt(rho * rho + m * m)) * t * t

    // y(t) - Radial distance from axis
    // Blends between two curves using t^q:
    // - First term (1-t^q): throat-region expansion curve
    // - Second term (t^q): mouth-region asymptotic curve
    const y =
      (1 - t ** q) * (Math.sqrt(c1 + c2 * L * t + c3 * L * L * t * t) + r0 * (1 - k)) +
      t ** q * (R + L * (1 - Math.sqrt(1 + c3 * (t - 1) ** 2)))

    points.push({ t, x, y })
  }

  return { points, L, c1, c2, c3 }
}

/**
 * Look up Y (radial) value at parameter t from precomputed ROSSE points.
 *
 * Uses nearest-neighbor lookup for fast retrieval. For smooth interpolation,
 * consider using linear or cubic interpolation instead.
 *
 * @param points - Precomputed ROSSE profile points
 * @param t - Parameter value [0..1]
 * @returns Radial distance at parameter t [mm]
 */
export function lookupY(points: ROSSEPoint[], t: number): number {
  const index = Math.min(Math.round(t * (points.length - 1)), points.length - 1)
  return points[index].y
}

/**
 * Look up X (axial) value at parameter t from precomputed ROSSE points.
 *
 * Uses nearest-neighbor lookup for fast retrieval.
 *
 * @param points - Precomputed ROSSE profile points
 * @param t - Parameter value [0..1]
 * @returns Axial distance at parameter t [mm]
 */
export function lookupX(points: ROSSEPoint[], t: number): number {
  const index = Math.min(Math.round(t * (points.length - 1)), points.length - 1)
  return points[index].x
}
