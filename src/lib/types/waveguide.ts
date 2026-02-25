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
 * Shape blend zone parameters for superellipse/aspect ratio morphing.
 *
 * Controls the transition from circular throat to rectangular mouth.
 * Uses smoothstep blending for C1 continuity.
 */
export interface ShapeBlendParams {
  /** Superellipse exponent at mouth (2=ellipse, ∞=rectangle) */
  nMouth: number

  /** Shape blend start parameter (0..1) */
  shapeStart: number

  /** Shape blend end parameter (0..1) */
  shapeEnd: number

  /** Shape blend power/curve */
  shapePow: number
}

/**
 * Modulation blend zone parameters.
 *
 * Controls when polar modulations (X and +) ramp in.
 * Shared by both modulation types.
 */
export interface ModulationBlendParams {
  /** Modulation blend start parameter (0..1) */
  modStart: number

  /** Modulation blend end parameter (0..1) */
  modEnd: number

  /** Modulation blend power/curve */
  modPow: number
}

/**
 * Diagonal polar modulation parameters.
 *
 * Applies diagonal reinforcement to address "cross wavefront syndrome"
 * in rectangular horns. Peaks at 45°, 135°, 225°, 315°.
 *
 * Function: r(θ) = base + amp · |sin(freq·θ)|^exp
 */
export interface DiagonalModParams {
  /** Enable/disable diagonal modulation */
  enabled: boolean

  /** Base value (offset) [0.05..1.0] */
  base: number

  /** Amplitude of modulation [0..1.5] */
  amp: number

  /** Frequency (2 = 4 lobes) [0.5..6.0] */
  freq: number

  /** Exponent (controls sharpness) [1..12] */
  exp: number
}

/**
 * Cardinal polar modulation parameters.
 *
 * Reinforces H/V axes. Peaks at 0°, 90°, 180°, 270°.
 * Can exaggerate rectangular character or counteract thinning.
 *
 * Function: r(θ) = base + amp · |cos(freq·θ)|^exp
 */
export interface CardinalModParams {
  /** Enable/disable cardinal modulation */
  enabled: boolean

  /** Base value (offset) [0.05..1.0] */
  base: number

  /** Amplitude of modulation [0..1.5] */
  amp: number

  /** Frequency (2 = 4 lobes) [0.5..6.0] */
  freq: number

  /** Exponent (controls sharpness) [1..12] */
  exp: number
}

/**
 * Mesh resolution parameters for 3D geometry generation.
 *
 * Controls the tessellation density of the exported mesh.
 * Higher values produce smoother geometry but larger file sizes.
 */
export interface MeshResolution {
  /** Number of rings (axial divisions) [20..200] */
  rings: number

  /** Number of slices (angular divisions) [36..256] */
  slices: number
}

/**
 * Shell thickness parameters for CAD export.
 *
 * Controls wall thickness and caps for manufacturing-ready models.
 * When disabled, exports surface-only mesh.
 */
export interface ShellParams {
  /** Enable/disable shell thickness */
  enabled: boolean

  /** Wall thickness in mm [0.5..20] */
  thickness: number

  /** Close throat end with cap face */
  throatCap: boolean

  /** Close mouth end with cap face */
  mouthCap: boolean
}

/**
 * Complete waveguide state containing all design parameters.
 */
export interface WaveguideState {
  /** Horizontal R-OSSE guide curve parameters */
  horizontal: ROSSEParams

  /** Vertical R-OSSE guide curve parameters */
  vertical: ROSSEParams

  /** Shape blend zone parameters */
  shapeBlend: ShapeBlendParams

  /** Modulation blend zone parameters */
  modBlend: ModulationBlendParams

  /** Diagonal polar modulation parameters */
  diagonalMod: DiagonalModParams

  /** Cardinal polar modulation parameters */
  cardinalMod: CardinalModParams

  /** Mesh resolution for 3D export */
  meshResolution: MeshResolution

  /** Shell thickness for CAD export */
  shellParams: ShellParams

  /** Current visualization mode */
  visualizationMode: 'guides' | 'cross' | 'xmod' | '3d' | 'blend'
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
 * Metadata for YAML export/import.
 */
export interface WaveguideMetadata {
  /** App version string */
  version: string

  /** ISO 8601 timestamp */
  created: string

  /** Application name */
  appName: string

  /** Optional user description */
  description?: string
}

/**
 * Complete export structure with metadata and state.
 */
export interface WaveguideExport {
  /** Export metadata */
  metadata: WaveguideMetadata

  /** Waveguide design state */
  state: WaveguideState
}

/**
 * Default parameter values for R-OSSE Waveguide Designer v2.
 *
 * Produces a waveguide similar to the ST260 example:
 * - Coverage: 90° × 60°
 * - Mouth: ~290 × 190 mm
 * - Depth: ~78 mm
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
  shapeBlend: {
    nMouth: 4.5,
    shapeStart: 0.05,
    shapeEnd: 0.85,
    shapePow: 1.0,
  },
  modBlend: {
    modStart: 0.15,
    modEnd: 0.75,
    modPow: 1.0,
  },
  diagonalMod: {
    enabled: false,
    base: 0.3,
    amp: 0.5,
    freq: 2.0,
    exp: 4.0,
  },
  cardinalMod: {
    enabled: false,
    base: 0.3,
    amp: 0.5,
    freq: 2.0,
    exp: 4.0,
  },
  meshResolution: {
    rings: 50,
    slices: 72,
  },
  shellParams: {
    enabled: false,
    thickness: 3.0,
    throatCap: false,
    mouthCap: true,
  },
  visualizationMode: '3d',
}
