/**
 * Central Parameter Configuration
 * ================================
 * Single source of truth for all parameter metadata including:
 * - Min/max ranges
 * - Step values for sliders
 * - Decimal precision
 * - Units
 *
 * Used by both UI components and validation logic.
 */

export interface ParameterConfig {
  min: number
  max: number
  step: number
  decimals: number
  unit?: string
}

/**
 * R-OSSE parameters (shared between horizontal and vertical guides)
 */
export const ROSSE_PARAMS = {
  r0: { min: 6, max: 90, step: 0.5, decimals: 1, unit: 'mm' },
  a0_deg: { min: 0, max: 20, step: 0.5, decimals: 1, unit: '°' },
  k: { min: 0.3, max: 5, step: 0.1, decimals: 1 },
  rho: { min: 0.05, max: 0.9, step: 0.05, decimals: 2 },
  b: { min: 0, max: 0.8, step: 0.05, decimals: 2 },
  m: { min: 0.5, max: 1.0, step: 0.05, decimals: 2 },
  q: { min: 1, max: 10, step: 0.1, decimals: 1 },
} as const satisfies Record<string, ParameterConfig>

/**
 * Horizontal guide specific parameters
 */
export const HORIZONTAL_GUIDE_PARAMS = {
  R: { min: 40, max: 350, step: 5, decimals: 0, unit: 'mm' },
  a_deg: { min: 15, max: 60, step: 1, decimals: 0, unit: '°' },
} as const satisfies Record<string, ParameterConfig>

/**
 * Vertical guide specific parameters
 */
export const VERTICAL_GUIDE_PARAMS = {
  R: { min: 30, max: 300, step: 5, decimals: 0, unit: 'mm' },
  a_deg: { min: 10, max: 55, step: 1, decimals: 0, unit: '°' },
} as const satisfies Record<string, ParameterConfig>

/**
 * Shape blend parameters (superellipse/aspect ratio morphing)
 */
export const SHAPE_BLEND_PARAMS = {
  nMouth: { min: 2, max: 10, step: 0.1, decimals: 1 },
  shapeStart: { min: 0, max: 0.6, step: 0.01, decimals: 2 },
  shapeEnd: { min: 0.2, max: 1.0, step: 0.01, decimals: 2 },
  shapePow: { min: 0.3, max: 4, step: 0.1, decimals: 1 },
} as const satisfies Record<string, ParameterConfig>

/**
 * Modulation blend parameters
 */
export const MODULATION_BLEND_PARAMS = {
  modStart: { min: 0, max: 0.6, step: 0.01, decimals: 2 },
  modEnd: { min: 0.3, max: 1.0, step: 0.01, decimals: 2 },
  modPow: { min: 0.3, max: 4, step: 0.1, decimals: 1 },
} as const satisfies Record<string, ParameterConfig>

/**
 * Modulation parameters (shared by diagonal and cardinal)
 */
export const MODULATION_PARAMS = {
  base: { min: 0.05, max: 1.0, step: 0.05, decimals: 2 },
  amp: { min: 0, max: 1.5, step: 0.05, decimals: 2 },
  freq: { min: 0.5, max: 6.0, step: 0.1, decimals: 1 },
  exp: { min: 1, max: 12, step: 0.5, decimals: 1 },
} as const satisfies Record<string, ParameterConfig>

/**
 * Mesh resolution parameters
 */
export const MESH_RESOLUTION_PARAMS = {
  rings: { min: 20, max: 200, step: 5, decimals: 0 },
  slices: { min: 36, max: 256, step: 4, decimals: 0 },
} as const satisfies Record<string, ParameterConfig>

/**
 * Shell thickness parameters
 */
export const SHELL_PARAMS = {
  thickness: { min: 0.5, max: 20, step: 0.5, decimals: 1, unit: 'mm' },
} as const satisfies Record<string, ParameterConfig>

/**
 * Consolidated parameter ranges for validation
 * (legacy format for backward compatibility with validator)
 */
export const PARAM_RANGES = {
  rosse: {
    R: { min: 40, max: 350 },
    r0: { min: 6, max: 36 },
    a0_deg: { min: 0, max: 20 },
    a_deg: { min: 10, max: 60 },
    k: { min: 0.3, max: 5 },
    rho: { min: 0.05, max: 0.9 },
    b: { min: 0, max: 0.8 },
    m: { min: 0.5, max: 1.0 },
    q: { min: 1, max: 10 },
  },
  shapeBlend: {
    nMouth: { min: 2, max: 10 },
    shapeStart: { min: 0, max: 0.6 },
    shapeEnd: { min: 0.2, max: 1.0 },
    shapePow: { min: 0.3, max: 4 },
  },
  modBlend: {
    modStart: { min: 0, max: 0.6 },
    modEnd: { min: 0.3, max: 1.0 },
    modPow: { min: 0.3, max: 4 },
  },
  modulation: {
    base: { min: 0.05, max: 1.0 },
    amp: { min: 0, max: 1.5 },
    freq: { min: 0.5, max: 6.0 },
    exp: { min: 1, max: 12 },
  },
  meshResolution: {
    rings: { min: 20, max: 200 },
    slices: { min: 36, max: 256 },
  },
  shellParams: {
    thickness: { min: 0.5, max: 20 },
  },
} as const
