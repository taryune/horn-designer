/**
 * YAML Export/Import for Waveguide Designer
 * =========================================
 * Handles YAML serialization with rich comments and metadata.
 */

import * as yaml from 'js-yaml'
import type { WaveguideExport, WaveguideState } from '../types/waveguide'
import type { ValidationResult } from '../validation/waveguideValidator'
import { validateWaveguideState } from '../validation/waveguideValidator'

/** Maximum YAML file size (100KB) */
const MAX_YAML_SIZE = 100 * 1024

/** Application version */
const APP_VERSION = '1.0.0'

/**
 * Result of YAML import operation.
 */
export interface YAMLImportResult {
  /** Whether import was successful */
  success: boolean

  /** Validated state (only if success = true) */
  state?: WaveguideState

  /** Error message (only if success = false) */
  error?: string

  /** Validation result with detailed errors */
  validation?: ValidationResult
}

/**
 * Generate YAML comment header.
 */
function generateHeader(): string {
  return `# ═══════════════════════════════════════════════════════════════════
# Horn Designer Configuration
# Generated: ${new Date().toISOString()}
# App Version: ${APP_VERSION}
# R-OSSE Dual Modulated Waveguide for Compression Driver
# ═══════════════════════════════════════════════════════════════════

`
}

/**
 * Export waveguide state to YAML string with comments and metadata.
 *
 * @param state - Complete waveguide state to export
 * @returns YAML string with comments and metadata
 */
export function exportToYAML(state: WaveguideState): string {
  const exportData: WaveguideExport = {
    metadata: {
      version: APP_VERSION,
      created: new Date().toISOString(),
      appName: 'Horn Designer',
      description: 'R-OSSE Dual Modulated Waveguide',
    },
    state: state,
  }

  // Generate YAML with custom options
  const yamlContent = yaml.dump(exportData, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
    sortKeys: false,
  })

  // Add header comments
  const header = generateHeader()

  // Add inline comments for better documentation
  const commented = addInlineComments(yamlContent)

  return header + commented
}

/**
 * Add helpful inline comments to YAML content.
 */
function addInlineComments(yamlContent: string): string {
  const lines = yamlContent.split('\n')
  const commented: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Add section headers
    if (line.includes('  horizontal:')) {
      commented.push('')
      commented.push('  # Horizontal R-OSSE Guide (H-plane expansion)')
    } else if (line.includes('  vertical:')) {
      commented.push('')
      commented.push('  # Vertical R-OSSE Guide (V-plane expansion)')
    } else if (line.includes('  shapeBlend:')) {
      commented.push('')
      commented.push('  # Shape Blend Zone (circular throat → rectangular mouth)')
    } else if (line.includes('  modBlend:')) {
      commented.push('')
      commented.push('  # Modulation Blend Zone')
    } else if (line.includes('  diagonalMod:')) {
      commented.push('')
      commented.push('  # Diagonal Polar Modulation (X-pattern reinforcement)')
    } else if (line.includes('  cardinalMod:')) {
      commented.push('')
      commented.push('  # Cardinal Polar Modulation (+-pattern reinforcement)')
    } else if (line.includes('  meshResolution:')) {
      commented.push('')
      commented.push('  # Mesh Resolution for 3D Export')
    } else if (line.includes('  shellParams:')) {
      commented.push('')
      commented.push('  # Shell Thickness for CAD Export')
    }

    // Add parameter comments
    const commentedLine = addParameterComment(line)
    commented.push(commentedLine)
  }

  return commented.join('\n')
}

/**
 * Add inline comments for specific parameters.
 */
function addParameterComment(line: string): string {
  // R-OSSE parameters
  if (line.includes('R:') && line.includes('    R:')) {
    return line.replace(/R: (.+)/, 'R: $1  # Outer radius [mm] (40-350)')
  }
  if (line.includes('r0:')) {
    return line.replace(/r0: (.+)/, 'r0: $1  # Throat radius [mm] - 12.7mm = 1" driver (6-36)')
  }
  if (line.includes('a0_deg:')) {
    return line.replace(/a0_deg: (.+)/, 'a0_deg: $1  # Throat opening half-angle [deg] (0-20)')
  }
  if (line.includes('a_deg:')) {
    return line.replace(/a_deg: (.+)/, 'a_deg: $1  # Coverage half-angle [deg] (10-60)')
  }
  if (line.includes('k:') && line.includes('    k:')) {
    return line.replace(/k: (.+)/, 'k: $1  # Throat expansion factor (0.3-5)')
  }
  if (line.includes('rho:')) {
    return line.replace(/rho: (.+)/, 'rho: $1  # Apex radius factor (0.05-0.9)')
  }
  if (line.includes('b:') && line.includes('    b:')) {
    return line.replace(/b: (.+)/, 'b: $1  # Bending factor (0-0.8)')
  }
  if (line.includes('m:') && line.includes('    m:')) {
    return line.replace(/m: (.+)/, 'm: $1  # Apex shift factor (0.5-1.0)')
  }
  if (line.includes('q:') && line.includes('    q:')) {
    return line.replace(/q: (.+)/, 'q: $1  # Throat shape factor (1-10)')
  }

  // Shape blend
  if (line.includes('nMouth:')) {
    return line.replace(
      /nMouth: (.+)/,
      'nMouth: $1  # Superellipse exponent (2=ellipse, 10≈rectangle)',
    )
  }
  if (line.includes('shapeStart:')) {
    return line.replace(/shapeStart: (.+)/, 'shapeStart: $1  # Blend start [0..1] (0-0.6)')
  }
  if (line.includes('shapeEnd:')) {
    return line.replace(/shapeEnd: (.+)/, 'shapeEnd: $1  # Blend end [0..1] (0.2-1.0)')
  }
  if (line.includes('shapePow:')) {
    return line.replace(/shapePow: (.+)/, 'shapePow: $1  # Blend curve power (0.3-4)')
  }

  // Modulation blend
  if (line.includes('modStart:')) {
    return line.replace(/modStart: (.+)/, 'modStart: $1  # Modulation start [0..1] (0-0.6)')
  }
  if (line.includes('modEnd:')) {
    return line.replace(/modEnd: (.+)/, 'modEnd: $1  # Modulation end [0..1] (0.2-1.0)')
  }
  if (line.includes('modPow:')) {
    return line.replace(/modPow: (.+)/, 'modPow: $1  # Modulation power (0.5-5)')
  }

  // Modulation parameters
  if (line.includes('enabled:')) {
    return line.replace(/enabled: (.+)/, 'enabled: $1  # Enable/disable this modulation')
  }
  if (line.includes('base:')) {
    return line.replace(/base: (.+)/, 'base: $1  # Base value (0.05-1.0)')
  }
  if (line.includes('amp:')) {
    return line.replace(/amp: (.+)/, 'amp: $1  # Amplitude (0-1.5)')
  }
  if (line.includes('freq:')) {
    return line.replace(/freq: (.+)/, 'freq: $1  # Frequency (0.5-6.0)')
  }
  if (line.includes('exp:')) {
    return line.replace(/exp: (.+)/, 'exp: $1  # Exponent/sharpness (1-12)')
  }

  // Mesh resolution
  if (line.includes('rings:')) {
    return line.replace(/rings: (.+)/, 'rings: $1  # Axial divisions (20-200)')
  }
  if (line.includes('slices:')) {
    return line.replace(/slices: (.+)/, 'slices: $1  # Angular divisions (36-256)')
  }

  // Shell params
  if (line.includes('thickness:')) {
    return line.replace(/thickness: (.+)/, 'thickness: $1  # Wall thickness [mm] (0.5-20)')
  }
  if (line.includes('throatCap:')) {
    return line.replace(/throatCap: (.+)/, 'throatCap: $1  # Close throat end')
  }
  if (line.includes('mouthCap:')) {
    return line.replace(/mouthCap: (.+)/, 'mouthCap: $1  # Close mouth end')
  }

  // Visualization mode
  if (line.includes('visualizationMode:')) {
    return line.replace(
      /visualizationMode: (.+)/,
      'visualizationMode: $1  # guides | cross | xmod | 3d | blend',
    )
  }

  return line
}

/**
 * Import waveguide state from YAML string.
 * Performs comprehensive validation and returns detailed error information.
 *
 * @param yamlString - YAML content to parse
 * @returns Import result with state or error details
 */
export function importFromYAML(yamlString: string): YAMLImportResult {
  // Check file size
  if (yamlString.length > MAX_YAML_SIZE) {
    const sizeMB = (yamlString.length / 1024).toFixed(1)
    return {
      success: false,
      error: `File too large (${sizeMB}KB). Maximum is 100KB.`,
    }
  }

  // Parse YAML
  let parsed: unknown
  try {
    parsed = yaml.load(yamlString)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown parse error'
    return {
      success: false,
      error: `YAML syntax error: ${message}`,
    }
  }

  // Handle both formats: with metadata wrapper or direct state
  let stateData: unknown
  if (parsed && typeof parsed === 'object' && 'state' in parsed && 'metadata' in parsed) {
    // New format with metadata
    stateData = (parsed as WaveguideExport).state
  } else {
    // Legacy format: direct state object
    stateData = parsed
  }

  // Validate state structure and values
  const validation = validateWaveguideState(stateData)

  if (!validation.valid) {
    return {
      success: false,
      error: 'Validation failed',
      validation,
    }
  }

  return {
    success: true,
    state: stateData as WaveguideState,
  }
}

/**
 * Format validation errors for user display.
 *
 * @param validation - Validation result
 * @returns Formatted error message
 */
export function formatValidationErrors(validation: ValidationResult): string {
  if (validation.valid) {
    return ''
  }

  const errorLines = validation.errors.map(
    (err) => `  • ${err.path}: ${err.message} (got: ${JSON.stringify(err.value)})`,
  )

  return `Validation errors:\n${errorLines.join('\n')}`
}
