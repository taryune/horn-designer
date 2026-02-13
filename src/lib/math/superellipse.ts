/**
 * Superellipse (Lamé Curve) Cross-Section Generation
 * ====================================================
 *
 * Implements superellipse boundary generation for smooth morphing
 * between circular and rectangular cross-sections in waveguides.
 *
 * The superellipse (Lamé curve) is defined by the equation:
 *   |x/hw|^n + |y/hh|^n = 1
 *
 * Where:
 * - hw: half-width (x-axis semi-diameter)
 * - hh: half-height (y-axis semi-diameter)
 * - n: shape exponent controlling the geometry:
 *   - n = 2: perfect ellipse (circle if hw = hh)
 *   - 2 < n < ∞: rounded rectangle
 *   - n → ∞: perfect rectangle
 *
 * This allows smooth transitions from circular throats to rectangular mouths,
 * which is essential for controlling wavefront propagation in horn designs.
 */

/**
 * Generate superellipse boundary points using parametric equations.
 *
 * The parametric form of the superellipse is:
 *   x(θ) = hw · sgn(cos θ) · |cos θ|^(2/n)
 *   y(θ) = hh · sgn(sin θ) · |sin θ|^(2/n)
 *
 * This produces a closed curve with the desired shape characteristics,
 * sampled uniformly in the angular parameter θ.
 *
 * @param hw - Half-width (x-axis semi-diameter) [mm]
 * @param hh - Half-height (y-axis semi-diameter) [mm]
 * @param n - Shape exponent (2 = ellipse, higher = more rectangular)
 * @param numPts - Number of points to generate (default: 72, must be divisible by 4)
 * @returns Array of [x, y] coordinate pairs forming the superellipse boundary
 *
 * @example
 * ```typescript
 * // Generate a circular cross-section (n=2, hw=hh)
 * const circle = superellipsePoints(50, 50, 2, 72);
 *
 * // Generate a rounded rectangle (n=4)
 * const roundedRect = superellipsePoints(80, 60, 4, 72);
 *
 * // Generate a nearly perfect rectangle (n=10)
 * const rectangle = superellipsePoints(80, 60, 10, 72);
 * ```
 */
export function superellipsePoints(
  hw: number,
  hh: number,
  n: number,
  numPts: number = 72,
): [number, number][] {
  const pts: [number, number][] = []

  for (let i = 0; i <= numPts; i++) {
    // Angular parameter from 0 to 2π
    const th = (2 * Math.PI * i) / numPts
    const c = Math.cos(th)
    const s = Math.sin(th)

    // Parametric superellipse equations
    // Math.sign preserves the quadrant, |·|^(2/n) creates the shape
    const x = hw * Math.sign(c) * Math.abs(c) ** (2 / n)
    const y = hh * Math.sign(s) * Math.abs(s) ** (2 / n)

    pts.push([x, y])
  }

  return pts
}

/**
 * Compute the superellipse exponent for a given position along the waveguide.
 *
 * This function implements smooth blending from circular (n=2) at the throat
 * to a configurable shape (nMouth) at the mouth.
 *
 * @param t - Parameter position [0..1] (0 = throat, 1 = mouth)
 * @param nMouth - Target exponent at mouth (e.g., 4 for rounded rectangle)
 * @param transStart - Parameter value where transition begins [0..1]
 * @param shapePow - Power controlling transition curve (higher = sharper transition)
 * @returns Interpolated superellipse exponent at position t
 *
 * @example
 * ```typescript
 * // At throat (t=0): always returns 2 (circular)
 * const nThroat = computeSuperellipseN(0, 4, 0.3, 2.0); // → 2
 *
 * // At mouth (t=1): returns nMouth
 * const nMouth = computeSuperellipseN(1, 4, 0.3, 2.0); // → 4
 *
 * // Midway through transition: interpolated value
 * const nMid = computeSuperellipseN(0.65, 4, 0.3, 2.0); // → ~3
 * ```
 */
export function computeSuperellipseN(
  t: number,
  nMouth: number,
  transStart: number,
  shapePow: number,
): number {
  // Calculate blend factor (0 = circular, 1 = full nMouth)
  // Clamped to [0, 1] and raised to shapePow for curve control
  const blendFactor = Math.max(0, Math.min(1, (t - transStart) / (1 - transStart)))
  const smoothFactor = blendFactor ** shapePow

  // Interpolate from 2 (circle) to nMouth
  return 2 + (nMouth - 2) * smoothFactor
}
