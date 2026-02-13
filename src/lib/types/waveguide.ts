/**
 * TypeScript Type Definitions for R-OSSE Waveguide Designer
 * ===========================================================
 */

/**
 * R-OSSE parametric equation parameters.
 *
 * Based on Marcel Batík's R-OSSE (Radial Oblate Spheroid Symmetric Expansion)
 * parametric equations for acoustic waveguide design.
 */
export interface ROSSEParams {
  /** Outer radius [mm] */
  R: number

  /** Throat radius [mm] */
  r0: number

  /** Throat opening half-angle [degrees] */
  a0_deg: number

  /** Nominal coverage half-angle [degrees] */
  a_deg: number

  /** Throat expansion factor (1 = exact OS, >1 = expanded) */
  k: number

  /** Apex radius factor */
  rho: number

  /** Bending factor */
  b: number

  /** Apex shift factor */
  m: number

  /** Throat shape factor */
  q: number
}

/**
 * Superellipse (Lamé curve) parameters for cross-section morphing.
 *
 * Equation: |x/hw|^n + |y/hh|^n = 1
 * - n=2: ellipse/circle
 * - n>2: rounded rectangle
 * - n→∞: rectangle
 */
export interface SuperellipseParams {
  /** Superellipse exponent at mouth (2=ellipse, ∞=rectangle) */
  nMouth: number

  /** Transition start parameter (0..1) */
  transStart: number

  /** Shape transition power/curve */
  shapePow: number
}

/**
 * X-shape polar modulation parameters.
 *
 * Applies diagonal reinforcement to address "cross wavefront syndrome"
 * in rectangular horns.
 *
 * Function: r(θ) = base + amp · |sin(freq·θ)|^exp
 */
export interface XModParams {
  /** Enable/disable X-modulation */
  enabled: boolean

  /** Base value (offset) */
  base: number

  /** Amplitude of modulation */
  amp: number

  /** Frequency (typically 2 for X-shape) */
  freq: number

  /** Exponent (controls sharpness) */
  exp: number

  /** Blend start parameter (0..1) */
  blendStart: number

  /** Blend curve power */
  blendPow: number
}

/**
 * Complete waveguide state containing all design parameters.
 */
export interface WaveguideState {
  /** Horizontal R-OSSE guide curve parameters */
  horizontal: ROSSEParams

  /** Vertical R-OSSE guide curve parameters */
  vertical: ROSSEParams

  /** Superellipse cross-section parameters */
  superellipse: SuperellipseParams

  /** X-shape polar modulation parameters */
  xMod: XModParams

  /** Current visualization mode */
  visualizationMode: 'guides' | 'cross' | 'xmod' | '3d'
}

/**
 * 2D point in waveguide profile space.
 */
export interface Point2D {
  /** Horizontal coordinate */
  x: number

  /** Vertical coordinate */
  y: number
}

/**
 * 3D point in mesh space.
 */
export interface Point3D extends Point2D {
  /** Depth/axial coordinate */
  z: number
}

/**
 * R-OSSE profile point with parameter value.
 */
export interface ROSSEPoint {
  /** Parameter value [0..1] */
  t: number

  /** Axial distance from throat [mm] */
  x: number

  /** Radial distance from axis [mm] */
  y: number
}

/**
 * Result from R-OSSE computation including auxiliary data.
 */
export interface ROSSEResult {
  /** Array of profile points */
  points: ROSSEPoint[]

  /** Axial length [mm] */
  L: number

  /** Auxiliary constant c1 */
  c1: number

  /** Auxiliary constant c2 */
  c2: number

  /** Auxiliary constant c3 */
  c3: number
}

/**
 * Single ring in the mesh (cross-section at parameter t).
 */
export interface MeshRing {
  /** Parameter value [0..1] */
  t: number

  /** Array of [x, y, z] points around the ring */
  ring: [number, number, number][]

  /** Axial position (horizontal guide) */
  xH: number

  /** Half-width (horizontal guide radius) */
  yH: number

  /** Half-height (vertical guide radius) */
  yV: number

  /** Superellipse exponent at this station */
  n: number
}

/**
 * Complete 3D mesh data structure.
 */
export interface MeshData {
  /** Array of rings from throat to mouth */
  rings: MeshRing[]

  /** Number of slices (angular divisions) per ring */
  numSlices: number
}

/**
 * Default parameter values for a standard horn configuration.
 */
export const DEFAULT_PARAMS: WaveguideState = {
  horizontal: {
    R: 145,
    r0: 12.7,
    a0_deg: 7.5,
    a_deg: 45,
    k: 1.8,
    rho: 0.3,
    b: 0.3,
    m: 0.8,
    q: 3.7,
  },
  vertical: {
    R: 95,
    r0: 12.7,
    a0_deg: 7.5,
    a_deg: 30,
    k: 1.8,
    rho: 0.3,
    b: 0.3,
    m: 0.8,
    q: 3.7,
  },
  superellipse: {
    nMouth: 4.5,
    transStart: 0.12,
    shapePow: 1.6,
  },
  xMod: {
    enabled: false,
    base: 0.3,
    amp: 0.5,
    freq: 2.0,
    exp: 1.0,
    blendStart: 0.2,
    blendPow: 2.0,
  },
  visualizationMode: '3d',
}
