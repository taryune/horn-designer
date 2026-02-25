/**
 * Validation Logic for Waveguide State Import
 * ==========================================
 * Provides comprehensive validation for imported YAML/JSON data
 * to ensure type safety and parameter bounds.
 */

// Validation uses structural typing, no direct WaveguideState import needed

export interface ValidationError {
  path: string
  message: string
  value: unknown
  expected: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: string[]
}

/**
 * Parameter range definitions for validation.
 */
const PARAM_RANGES = {
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
    modEnd: { min: 0.2, max: 1.0 },
    modPow: { min: 0.5, max: 5 },
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
}

/**
 * Check if value is a number and within range.
 */
function validateNumber(
  value: unknown,
  path: string,
  min: number,
  max: number,
  errors: ValidationError[],
): boolean {
  if (typeof value !== 'number') {
    errors.push({
      path,
      message: 'Must be a number',
      value,
      expected: `number in range [${min}, ${max}]`,
    })
    return false
  }

  if (Number.isNaN(value) || !Number.isFinite(value)) {
    errors.push({
      path,
      message: 'Must be a finite number',
      value,
      expected: `number in range [${min}, ${max}]`,
    })
    return false
  }

  if (value < min || value > max) {
    errors.push({
      path,
      message: `Must be between ${min} and ${max}`,
      value,
      expected: `number in range [${min}, ${max}]`,
    })
    return false
  }

  return true
}

/**
 * Check if value is a boolean.
 */
function validateBoolean(value: unknown, path: string, errors: ValidationError[]): boolean {
  if (typeof value !== 'boolean') {
    errors.push({
      path,
      message: 'Must be a boolean',
      value,
      expected: 'true or false',
    })
    return false
  }
  return true
}

/**
 * Validate R-OSSE parameters object.
 */
function validateROSSEParams(data: unknown, prefix: string, errors: ValidationError[]): boolean {
  if (typeof data !== 'object' || data === null) {
    errors.push({
      path: prefix,
      message: 'Must be an object',
      value: data,
      expected: 'ROSSEParams object',
    })
    return false
  }

  const obj = data as Record<string, unknown>
  const ranges = PARAM_RANGES.rosse
  let valid = true

  valid = validateNumber(obj.R, `${prefix}.R`, ranges.R.min, ranges.R.max, errors) && valid
  valid = validateNumber(obj.r0, `${prefix}.r0`, ranges.r0.min, ranges.r0.max, errors) && valid
  valid =
    validateNumber(obj.a0_deg, `${prefix}.a0_deg`, ranges.a0_deg.min, ranges.a0_deg.max, errors) &&
    valid
  valid =
    validateNumber(obj.a_deg, `${prefix}.a_deg`, ranges.a_deg.min, ranges.a_deg.max, errors) &&
    valid
  valid = validateNumber(obj.k, `${prefix}.k`, ranges.k.min, ranges.k.max, errors) && valid
  valid = validateNumber(obj.rho, `${prefix}.rho`, ranges.rho.min, ranges.rho.max, errors) && valid
  valid = validateNumber(obj.b, `${prefix}.b`, ranges.b.min, ranges.b.max, errors) && valid
  valid = validateNumber(obj.m, `${prefix}.m`, ranges.m.min, ranges.m.max, errors) && valid
  valid = validateNumber(obj.q, `${prefix}.q`, ranges.q.min, ranges.q.max, errors) && valid

  return valid
}

/**
 * Validate ShapeBlendParams object.
 */
function validateShapeBlendParams(data: unknown, errors: ValidationError[]): boolean {
  if (typeof data !== 'object' || data === null) {
    errors.push({
      path: 'shapeBlend',
      message: 'Must be an object',
      value: data,
      expected: 'ShapeBlendParams object',
    })
    return false
  }

  const obj = data as Record<string, unknown>
  const ranges = PARAM_RANGES.shapeBlend
  let valid = true

  valid =
    validateNumber(obj.nMouth, 'shapeBlend.nMouth', ranges.nMouth.min, ranges.nMouth.max, errors) &&
    valid
  valid =
    validateNumber(
      obj.shapeStart,
      'shapeBlend.shapeStart',
      ranges.shapeStart.min,
      ranges.shapeStart.max,
      errors,
    ) && valid
  valid =
    validateNumber(
      obj.shapeEnd,
      'shapeBlend.shapeEnd',
      ranges.shapeEnd.min,
      ranges.shapeEnd.max,
      errors,
    ) && valid
  valid =
    validateNumber(
      obj.shapePow,
      'shapeBlend.shapePow',
      ranges.shapePow.min,
      ranges.shapePow.max,
      errors,
    ) && valid

  // Logical validation: shapeStart < shapeEnd
  if (typeof obj.shapeStart === 'number' && typeof obj.shapeEnd === 'number') {
    if (obj.shapeStart >= obj.shapeEnd) {
      errors.push({
        path: 'shapeBlend',
        message: 'shapeStart must be less than shapeEnd',
        value: { shapeStart: obj.shapeStart, shapeEnd: obj.shapeEnd },
        expected: 'shapeStart < shapeEnd',
      })
      valid = false
    }
  }

  return valid
}

/**
 * Validate ModulationBlendParams object.
 */
function validateModulationBlendParams(data: unknown, errors: ValidationError[]): boolean {
  if (typeof data !== 'object' || data === null) {
    errors.push({
      path: 'modBlend',
      message: 'Must be an object',
      value: data,
      expected: 'ModulationBlendParams object',
    })
    return false
  }

  const obj = data as Record<string, unknown>
  const ranges = PARAM_RANGES.modBlend
  let valid = true

  valid =
    validateNumber(
      obj.modStart,
      'modBlend.modStart',
      ranges.modStart.min,
      ranges.modStart.max,
      errors,
    ) && valid
  valid =
    validateNumber(obj.modEnd, 'modBlend.modEnd', ranges.modEnd.min, ranges.modEnd.max, errors) &&
    valid
  valid =
    validateNumber(obj.modPow, 'modBlend.modPow', ranges.modPow.min, ranges.modPow.max, errors) &&
    valid

  // Logical validation: modStart < modEnd
  if (typeof obj.modStart === 'number' && typeof obj.modEnd === 'number') {
    if (obj.modStart >= obj.modEnd) {
      errors.push({
        path: 'modBlend',
        message: 'modStart must be less than modEnd',
        value: { modStart: obj.modStart, modEnd: obj.modEnd },
        expected: 'modStart < modEnd',
      })
      valid = false
    }
  }

  return valid
}

/**
 * Validate modulation parameters (diagonal or cardinal).
 */
function validateModulationParams(
  data: unknown,
  prefix: string,
  errors: ValidationError[],
): boolean {
  if (typeof data !== 'object' || data === null) {
    errors.push({
      path: prefix,
      message: 'Must be an object',
      value: data,
      expected: 'Modulation parameters object',
    })
    return false
  }

  const obj = data as Record<string, unknown>
  const ranges = PARAM_RANGES.modulation
  let valid = true

  valid = validateBoolean(obj.enabled, `${prefix}.enabled`, errors) && valid
  valid =
    validateNumber(obj.base, `${prefix}.base`, ranges.base.min, ranges.base.max, errors) && valid
  valid = validateNumber(obj.amp, `${prefix}.amp`, ranges.amp.min, ranges.amp.max, errors) && valid
  valid =
    validateNumber(obj.freq, `${prefix}.freq`, ranges.freq.min, ranges.freq.max, errors) && valid
  valid = validateNumber(obj.exp, `${prefix}.exp`, ranges.exp.min, ranges.exp.max, errors) && valid

  return valid
}

/**
 * Validate MeshResolution object.
 */
function validateMeshResolution(data: unknown, errors: ValidationError[]): boolean {
  if (typeof data !== 'object' || data === null) {
    errors.push({
      path: 'meshResolution',
      message: 'Must be an object',
      value: data,
      expected: 'MeshResolution object',
    })
    return false
  }

  const obj = data as Record<string, unknown>
  const ranges = PARAM_RANGES.meshResolution
  let valid = true

  valid =
    validateNumber(obj.rings, 'meshResolution.rings', ranges.rings.min, ranges.rings.max, errors) &&
    valid
  valid =
    validateNumber(
      obj.slices,
      'meshResolution.slices',
      ranges.slices.min,
      ranges.slices.max,
      errors,
    ) && valid

  return valid
}

/**
 * Validate ShellParams object.
 */
function validateShellParams(data: unknown, errors: ValidationError[]): boolean {
  if (typeof data !== 'object' || data === null) {
    errors.push({
      path: 'shellParams',
      message: 'Must be an object',
      value: data,
      expected: 'ShellParams object',
    })
    return false
  }

  const obj = data as Record<string, unknown>
  const ranges = PARAM_RANGES.shellParams
  let valid = true

  valid = validateBoolean(obj.enabled, 'shellParams.enabled', errors) && valid
  valid =
    validateNumber(
      obj.thickness,
      'shellParams.thickness',
      ranges.thickness.min,
      ranges.thickness.max,
      errors,
    ) && valid
  valid = validateBoolean(obj.throatCap, 'shellParams.throatCap', errors) && valid
  valid = validateBoolean(obj.mouthCap, 'shellParams.mouthCap', errors) && valid

  return valid
}

/**
 * Validate visualization mode.
 */
function validateVisualizationMode(value: unknown, errors: ValidationError[]): boolean {
  const validModes = ['guides', 'cross', 'xmod', '3d', 'blend']

  if (typeof value !== 'string' || !validModes.includes(value)) {
    errors.push({
      path: 'visualizationMode',
      message: `Must be one of: ${validModes.join(', ')}`,
      value,
      expected: validModes.join(' | '),
    })
    return false
  }

  return true
}

/**
 * Main validation function for WaveguideState.
 * Returns detailed validation result with all errors and warnings.
 */
export function validateWaveguideState(data: unknown): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: string[] = []

  // Check if data is an object
  if (typeof data !== 'object' || data === null) {
    return {
      valid: false,
      errors: [
        {
          path: 'root',
          message: 'Data must be an object',
          value: data,
          expected: 'WaveguideState object',
        },
      ],
      warnings,
    }
  }

  const obj = data as Record<string, unknown>

  // Validate all required fields
  let valid = true

  if (!obj.horizontal) {
    errors.push({
      path: 'horizontal',
      message: 'Missing required field',
      value: undefined,
      expected: 'ROSSEParams object',
    })
    valid = false
  } else {
    valid = validateROSSEParams(obj.horizontal, 'horizontal', errors) && valid
  }

  if (!obj.vertical) {
    errors.push({
      path: 'vertical',
      message: 'Missing required field',
      value: undefined,
      expected: 'ROSSEParams object',
    })
    valid = false
  } else {
    valid = validateROSSEParams(obj.vertical, 'vertical', errors) && valid
  }

  if (!obj.shapeBlend) {
    errors.push({
      path: 'shapeBlend',
      message: 'Missing required field',
      value: undefined,
      expected: 'ShapeBlendParams object',
    })
    valid = false
  } else {
    valid = validateShapeBlendParams(obj.shapeBlend, errors) && valid
  }

  if (!obj.modBlend) {
    errors.push({
      path: 'modBlend',
      message: 'Missing required field',
      value: undefined,
      expected: 'ModulationBlendParams object',
    })
    valid = false
  } else {
    valid = validateModulationBlendParams(obj.modBlend, errors) && valid
  }

  if (!obj.diagonalMod) {
    errors.push({
      path: 'diagonalMod',
      message: 'Missing required field',
      value: undefined,
      expected: 'DiagonalModParams object',
    })
    valid = false
  } else {
    valid = validateModulationParams(obj.diagonalMod, 'diagonalMod', errors) && valid
  }

  if (!obj.cardinalMod) {
    errors.push({
      path: 'cardinalMod',
      message: 'Missing required field',
      value: undefined,
      expected: 'CardinalModParams object',
    })
    valid = false
  } else {
    valid = validateModulationParams(obj.cardinalMod, 'cardinalMod', errors) && valid
  }

  if (!obj.meshResolution) {
    errors.push({
      path: 'meshResolution',
      message: 'Missing required field',
      value: undefined,
      expected: 'MeshResolution object',
    })
    valid = false
  } else {
    valid = validateMeshResolution(obj.meshResolution, errors) && valid
  }

  if (!obj.shellParams) {
    errors.push({
      path: 'shellParams',
      message: 'Missing required field',
      value: undefined,
      expected: 'ShellParams object',
    })
    valid = false
  } else {
    valid = validateShellParams(obj.shellParams, errors) && valid
  }

  if (!obj.visualizationMode) {
    errors.push({
      path: 'visualizationMode',
      message: 'Missing required field',
      value: undefined,
      expected: 'guides | cross | xmod | 3d | blend',
    })
    valid = false
  } else {
    valid = validateVisualizationMode(obj.visualizationMode, errors) && valid
  }

  return {
    valid,
    errors,
    warnings,
  }
}
