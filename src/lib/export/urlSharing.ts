/**
 * URL Sharing for Waveguide Designer
 * ==================================
 * Compresses waveguide state for shareable URLs using LZ-string.
 */

import * as LZString from 'lz-string'
import type { WaveguideState } from '../types/waveguide'
import { validateWaveguideState } from '../validation/waveguideValidator'

/**
 * Compress waveguide state to URL-safe string.
 *
 * @param state - Complete waveguide state
 * @returns Compressed, URL-encoded string
 */
export function compressStateToURL(state: WaveguideState): string {
  const json = JSON.stringify(state)
  return LZString.compressToEncodedURIComponent(json)
}

/**
 * Decompress state from URL parameter.
 * Returns null if decompression or validation fails.
 *
 * @param compressed - Compressed URL parameter
 * @returns Validated state or null
 */
export function decompressStateFromURL(compressed: string): WaveguideState | null {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(compressed)
    if (!decompressed) {
      return null
    }

    const parsed = JSON.parse(decompressed)
    const validation = validateWaveguideState(parsed)

    if (!validation.valid) {
      console.error('Invalid state from URL:', validation.errors)
      return null
    }

    return parsed as WaveguideState
  } catch (error) {
    console.error('Failed to decompress URL state:', error)
    return null
  }
}

/**
 * Generate shareable URL for current design.
 * Adds compressed state as 'design' query parameter.
 *
 * @param state - Complete waveguide state
 * @returns Full URL with compressed state parameter
 */
export function generateShareableURL(state: WaveguideState): string {
  const compressed = compressStateToURL(state)
  const url = new URL(window.location.href)

  // Clear existing design parameter and set new one
  url.searchParams.set('design', compressed)

  return url.toString()
}
