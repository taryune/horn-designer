/**
 * Geometry Utility Functions
 * ===========================
 *
 * Common geometric transformations and utilities for 3D mesh manipulation.
 */

/**
 * Apply 3D rotation using Euler angles (X-axis then Y-axis).
 *
 * This function rotates a 3D point around the X and Y axes using
 * the Euler angle convention. The rotation is applied in the order:
 * 1. Rotation around Y-axis by ry
 * 2. Rotation around X-axis by rx
 *
 * This is commonly used for interactive 3D visualization where the user
 * drags to rotate the view.
 *
 * Rotation matrices:
 * - Y-rotation: [ cos(ry)  0  sin(ry) ]   [x]
 *               [   0      1     0    ] × [y]
 *               [-sin(ry)  0  cos(ry) ]   [z]
 *
 * - X-rotation: [ 1    0       0     ]   [x']
 *               [ 0  cos(rx) -sin(rx)] × [y']
 *               [ 0  sin(rx)  cos(rx)]   [z']
 *
 * @param px - X coordinate
 * @param py - Y coordinate
 * @param pz - Z coordinate
 * @param rx - Rotation angle around X-axis [radians]
 * @param ry - Rotation angle around Y-axis [radians]
 * @returns Rotated point as [x, y, z] tuple
 *
 * @example
 * ```typescript
 * // Rotate a point 45° around Y-axis, 30° around X-axis
 * const [x, y, z] = rot3(10, 0, 0, Math.PI/6, Math.PI/4);
 *
 * // For interactive view rotation:
 * const rotated = points.map(([px, py, pz]) =>
 *   rot3(px, py, pz, mouseRotX, mouseRotY)
 * );
 * ```
 */
export function rot3(
  px: number,
  py: number,
  pz: number,
  rx: number,
  ry: number,
): [number, number, number] {
  // Precompute trigonometric values
  const cx = Math.cos(rx)
  const sx = Math.sin(rx)
  const cy = Math.cos(ry)
  const sy = Math.sin(ry)

  // Apply Y-axis rotation first
  const x1 = px * cy + pz * sy
  const z1 = -px * sy + pz * cy
  const y1 = py

  // Apply X-axis rotation second
  const x2 = x1
  const y2 = y1 * cx - z1 * sx
  const z2 = y1 * sx + z1 * cx

  return [x2, y2, z2]
}

/**
 * Convert polar coordinates (r, θ) to Cartesian coordinates (x, y).
 *
 * @param r - Radius (distance from origin)
 * @param theta - Angle [radians, 0 = positive X-axis, counter-clockwise]
 * @returns [x, y] coordinates
 *
 * @example
 * ```typescript
 * // Point at 45°, distance 10
 * const [x, y] = polarToCartesian(10, Math.PI/4);
 * // → [7.07, 7.07]
 * ```
 */
export function polarToCartesian(r: number, theta: number): [number, number] {
  return [r * Math.cos(theta), r * Math.sin(theta)]
}

/**
 * Convert Cartesian coordinates (x, y) to polar coordinates (r, θ).
 *
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns [r, theta] where theta is in [0, 2π]
 *
 * @example
 * ```typescript
 * const [r, theta] = cartesianToPolar(10, 10);
 * // → [14.14, 0.785...] (45° in radians)
 * ```
 */
export function cartesianToPolar(x: number, y: number): [number, number] {
  const r = Math.sqrt(x * x + y * y)
  const theta = Math.atan2(y, x)
  // Normalize theta to [0, 2π]
  const normalizedTheta = theta < 0 ? theta + 2 * Math.PI : theta
  return [r, normalizedTheta]
}

/**
 * Linear interpolation between two values.
 *
 * @param a - Start value
 * @param b - End value
 * @param t - Interpolation parameter [0..1]
 * @returns Interpolated value
 *
 * @example
 * ```typescript
 * lerp(0, 100, 0.5); // → 50
 * lerp(10, 20, 0.25); // → 12.5
 * ```
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * Clamp a value between min and max.
 *
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 *
 * @example
 * ```typescript
 * clamp(150, 0, 100); // → 100
 * clamp(-50, 0, 100); // → 0
 * clamp(50, 0, 100);  // → 50
 * ```
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Calculate Euclidean distance between two 2D points.
 *
 * @param x1 - X coordinate of first point
 * @param y1 - Y coordinate of first point
 * @param x2 - X coordinate of second point
 * @param y2 - Y coordinate of second point
 * @returns Distance between points
 */
export function distance2D(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1
  const dy = y2 - y1
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Calculate Euclidean distance between two 3D points.
 *
 * @param x1 - X coordinate of first point
 * @param y1 - Y coordinate of first point
 * @param z1 - Z coordinate of first point
 * @param x2 - X coordinate of second point
 * @param y2 - Y coordinate of second point
 * @param z2 - Z coordinate of second point
 * @returns Distance between points
 */
export function distance3D(
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number,
): number {
  const dx = x2 - x1
  const dy = y2 - y1
  const dz = z2 - z1
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}
