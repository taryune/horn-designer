/**
 * X-Shape Polar Modulation
 * =========================
 *
 * Implements diagonal reinforcement modulation to address "cross wavefront syndrome"
 * in rectangular horn designs.
 *
 * The X-modulation applies a polar function that creates lobed cross-sections,
 * adding material along the diagonals to compensate for wavefront distortion
 * that occurs in corners of rectangular horns.
 *
 * Polar modulation function:
 *   r(θ) = base + amp · |sin(freq·θ)|^exp
 *
 * Where:
 * - θ: angle around the cross-section [0, 2π]
 * - base: baseline value (offset)
 * - amp: amplitude of the modulation
 * - freq: frequency (typically 2 for X-shape, creating 4 lobes at diagonals)
 * - exp: exponent controlling lobe sharpness
 *
 * The modulation is blended from zero effect at the throat to full effect at the mouth,
 * ensuring smooth transition without throat distortion.
 */

import type { XModParams } from '../types/waveguide'

/**
 * Compute the raw (unnormalized) polar modulation value for preview/visualization.
 *
 * This function returns the base polar modulation pattern without blending
 * or normalization, useful for previewing the X-modulation shape in isolation.
 *
 * @param theta - Angle around cross-section [radians, 0..2π]
 * @param params - X-modulation parameters
 * @returns Raw polar modulation value
 *
 * @example
 * ```typescript
 * const params = { base: 1.0, amp: 0.3, freq: 2, exp: 1.5 };
 *
 * // At 0° (positive X-axis): sin(0) = 0, returns base
 * const r0 = xModRaw(0, params); // → 1.0
 *
 * // At 45° (diagonal): sin(90°) = 1, returns base + amp
 * const r45 = xModRaw(Math.PI/4, params); // → ~1.3
 *
 * // At 90° (positive Y-axis): sin(180°) = 0, returns base
 * const r90 = xModRaw(Math.PI/2, params); // → 1.0
 * ```
 */
export function xModRaw(
  theta: number,
  params: Pick<XModParams, 'base' | 'amp' | 'freq' | 'exp'>,
): number {
  const { base, amp, freq, exp } = params
  return base + amp * Math.abs(Math.sin(freq * theta)) ** exp
}

/**
 * Compute the X-shape polar modulation multiplier for a given angle and position.
 *
 * This function calculates the radial multiplier that should be applied to
 * cross-section points at a given angular position and axial parameter.
 *
 * The modulation:
 * 1. Computes the raw polar function r(θ)
 * 2. Normalizes it to average 1.0 (maintains cross-sectional area)
 * 3. Blends from no effect (multiplier = 1) at throat to full effect at mouth
 * 4. Returns 1.0 if disabled
 *
 * @param theta - Angle around cross-section [radians, 0..2π]
 * @param blendT - Axial parameter position [0..1] (0 = throat, 1 = mouth)
 * @param params - X-modulation parameters
 * @returns Radial multiplier to apply [typically 0.8..1.2]
 *
 * @example
 * ```typescript
 * const params = {
 *   enabled: true,
 *   base: 1.0,
 *   amp: 0.3,
 *   freq: 2,
 *   exp: 1.5,
 *   blendStart: 0.4,
 *   blendPow: 2.0
 * };
 *
 * // At throat (blendT=0): always returns 1.0 (no modulation)
 * const m0 = xModulation(Math.PI/4, 0, params); // → 1.0
 *
 * // At mouth (blendT=1), diagonal (θ=45°): returns full modulation
 * const m1 = xModulation(Math.PI/4, 1, params); // → ~1.2
 *
 * // Midway, on-axis: minimal modulation
 * const mMid = xModulation(0, 0.5, params); // → ~1.0
 * ```
 */
export function xModulation(theta: number, blendT: number, params: XModParams): number {
  const { enabled, base, amp, freq, exp, blendStart, blendPow } = params

  // If disabled, return unity multiplier (no effect)
  if (!enabled) return 1.0

  // Calculate blend factor: 0 at throat, 1 at mouth
  // Clamped to [0, 1] and raised to blendPow for transition curve control
  const normalizedT = Math.max(0, Math.min(1, (blendT - blendStart) / (1 - blendStart)))
  const blendFactor = normalizedT ** blendPow

  // Compute raw polar modulation value
  const raw = base + amp * Math.abs(Math.sin(freq * theta)) ** exp

  // Normalize around 1.0 to maintain average cross-sectional area
  // Average of |sin(freq·θ)|^exp over one period is approximately 0.5
  // (exact value depends on exp, but 0.5 is a good approximation)
  const avgRaw = base + amp * 0.5

  // Blend from 1.0 (no effect) to normalized modulation
  // This ensures smooth transition without discontinuities
  return 1 + blendFactor * (raw / avgRaw - 1)
}

/**
 * Generate preview points for X-modulation polar plot visualization.
 *
 * Creates a set of (r, θ) points suitable for rendering the X-modulation
 * pattern in a polar coordinate display.
 *
 * @param params - X-modulation parameters
 * @param numPoints - Number of points to generate (default: 360)
 * @returns Array of [radius, angle] pairs
 *
 * @example
 * ```typescript
 * const params = { base: 1.0, amp: 0.3, freq: 2, exp: 1.5 };
 * const points = generateXModPreview(params, 360);
 *
 * // Use points to draw polar plot:
 * // points.forEach(([r, theta]) => {
 * //   const x = r * Math.cos(theta);
 * //   const y = r * Math.sin(theta);
 * //   drawPoint(x, y);
 * // });
 * ```
 */
export function generateXModPreview(
  params: Pick<XModParams, 'base' | 'amp' | 'freq' | 'exp'>,
  numPoints: number = 360,
): [number, number][] {
  const points: [number, number][] = []

  for (let i = 0; i <= numPoints; i++) {
    const theta = (2 * Math.PI * i) / numPoints
    const r = xModRaw(theta, params)
    points.push([r, theta])
  }

  return points
}
