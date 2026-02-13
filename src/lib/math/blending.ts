/**
 * Blending Functions for Smooth Transitions
 * ==========================================
 *
 * Implements C1 and C2 continuous blending functions to eliminate
 * slope discontinuities in waveguide transitions.
 */

/**
 * Clamp a value between min and max bounds.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Hermite smoothstep function (C1 continuous).
 *
 * Provides smooth transition from 0 to 1 with zero derivatives at boundaries.
 * - f(start) = 0, f(end) = 1
 * - f'(start) = 0, f'(end) = 0
 *
 * @param t - Input parameter
 * @param start - Start of transition region
 * @param end - End of transition region
 * @returns Smoothed value [0..1]
 */
export function smoothstep(t: number, start: number, end: number): number {
  if (start >= end) return t >= end ? 1 : 0

  const s = clamp((t - start) / (end - start), 0, 1)
  return s * s * (3 - 2 * s)
}

/**
 * Quintic smoothstep function (C2 continuous).
 *
 * Even smoother transition with zero first and second derivatives at boundaries.
 * - f(start) = 0, f(end) = 1
 * - f'(start) = 0, f'(end) = 0
 * - f''(start) = 0, f''(end) = 0
 *
 * @param t - Input parameter
 * @param start - Start of transition region
 * @param end - End of transition region
 * @returns Smoothed value [0..1]
 */
export function smoothstep5(t: number, start: number, end: number): number {
  if (start >= end) return t >= end ? 1 : 0

  const s = clamp((t - start) / (end - start), 0, 1)
  return s * s * s * (s * (s * 6 - 15) + 10)
}

/**
 * Apply power curve on top of smoothstep for additional control.
 *
 * @param t - Input parameter
 * @param start - Start of transition region
 * @param end - End of transition region
 * @param power - Power exponent (1.0 = pure smoothstep)
 * @returns Powered smoothstep value [0..1]
 */
export function poweredSmoothstep(
  t: number,
  start: number,
  end: number,
  power: number = 1.0,
): number {
  const smooth = smoothstep(t, start, end)
  return smooth ** power
}

/**
 * Linear interpolation between two values.
 *
 * @param a - Start value
 * @param b - End value
 * @param t - Interpolation parameter [0..1]
 * @returns Interpolated value
 */
export function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a)
}

/**
 * Smooth interpolation between two values using smoothstep.
 *
 * @param a - Start value
 * @param b - End value
 * @param t - Input parameter
 * @param start - Start of transition region
 * @param end - End of transition region
 * @param power - Power exponent (default 1.0)
 * @returns Smoothly interpolated value
 */
export function smoothLerp(
  a: number,
  b: number,
  t: number,
  start: number,
  end: number,
  power: number = 1.0,
): number {
  const factor = poweredSmoothstep(t, start, end, power)
  return lerp(a, b, factor)
}
