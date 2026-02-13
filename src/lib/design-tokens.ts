/**
 * Design Tokens
 *
 * Centralized design system constants for colors, typography, and spacing.
 *
 * Usage:
 * - For React components: Use colors.* and fontSize.*
 * - For Canvas contexts: Use canvasColors.* (actual hex values)
 * - For CSS: Use CSS custom properties directly (var(--color-name))
 */

/**
 * Colors for React components (uses CSS custom properties)
 * These will automatically update if the theme changes
 */
export const colors = {
  // Base colors
  background: 'var(--background)',
  foreground: 'var(--foreground)',
  card: 'var(--card)',
  cardForeground: 'var(--card-foreground)',
  primary: 'var(--primary)',
  primaryForeground: 'var(--primary-foreground)',
  secondary: 'var(--secondary)',
  secondaryForeground: 'var(--secondary-foreground)',
  muted: 'var(--muted)',
  mutedForeground: 'var(--muted-foreground)',
  border: 'var(--border)',
  input: 'var(--input)',

  // Panel colors
  panelBg: 'var(--panel-bg)',
  panelBorder: 'var(--panel-border)',
  panelBorderLight: 'var(--panel-border-light)',
  panelBorderMedium: 'var(--panel-border-medium)',
  panelHeaderBg: 'var(--panel-header-bg)',

  // Canvas colors
  canvasBg: 'var(--canvas-bg)',
  canvasText: 'var(--canvas-text)',
  canvasGrid: 'var(--canvas-grid)',

  // Waveguide colors
  hGuide: 'var(--h-guide)',
  vGuide: 'var(--v-guide)',
  superEllipse: 'var(--super-ellipse)',
  xMod: 'var(--x-mod)',

  // Waveguide borders
  hGuideBorder: 'var(--h-guide-border)',
  vGuideBorder: 'var(--v-guide-border)',
  superEllipseBorder: 'var(--super-ellipse-border)',
  xModBorder: 'var(--x-mod-border)',

  // Waveguide with opacity
  hGuide30: 'var(--h-guide-30)',
  hGuide70: 'var(--h-guide-70)',
  hGuide90: 'var(--h-guide-90)',
  vGuide30: 'var(--v-guide-30)',
  vGuide70: 'var(--v-guide-70)',
  vGuide90: 'var(--v-guide-90)',
  xMod30: 'var(--x-mod-30)',
  xMod70: 'var(--x-mod-70)',

  // Primary with opacity
  primary08: 'var(--primary-08)',

  // Text variations
  textSubtle: 'var(--text-subtle)',
  textSubtleDark: 'var(--text-subtle-dark)',
  textDisabled: 'var(--text-disabled)',
} as const

/**
 * Canvas colors (actual hex values for Canvas 2D context)
 * Canvas context doesn't support CSS variables, so we need actual values
 */
export const canvasColors = {
  background: '#0a0a0a',
  text: '#605840',
  grid: '#1a1816',

  // Waveguide colors
  hGuide: '#e8943a',
  vGuide: '#4a9de8',
  superEllipse: '#b898d0',
  xMod: '#a06cf0',

  // With opacity (for canvas contexts)
  hGuide90: '#e8943a90',
  hGuide70: '#e8943a70',
  vGuide90: '#4a9de890',
  vGuide70: '#4a9de870',
  xMod70: '#a06cf070',

  // Primary color with opacity
  primaryGrid: 'rgba(200,168,78,0.08)',
} as const

/**
 * Font sizes (in rem units)
 */
export const fontSize = {
  footer: '0.4375rem', // 7px
  tiny: '0.5rem', // 8px
  micro: '0.5625rem', // 9px
  xxs: '0.625rem', // 10px
  xs: '0.75rem', // 12px
  sm: '0.875rem', // 14px
  base: '0.9375rem', // 15px
  lg: '1rem', // 16px
} as const

/**
 * Type-safe waveguide type
 */
export type WaveguideType = 'h-guide' | 'v-guide' | 'super-ellipse' | 'x-mod'

/**
 * Helper to get color by waveguide type
 */
export const getWaveguideColor = (type: WaveguideType): string => {
  const colorMap: Record<WaveguideType, string> = {
    'h-guide': colors.hGuide,
    'v-guide': colors.vGuide,
    'super-ellipse': colors.superEllipse,
    'x-mod': colors.xMod,
  }
  return colorMap[type]
}

/**
 * Helper to get border color by waveguide type
 */
export const getWaveguideBorderColor = (type: WaveguideType): string => {
  const borderMap: Record<WaveguideType, string> = {
    'h-guide': colors.hGuideBorder,
    'v-guide': colors.vGuideBorder,
    'super-ellipse': colors.superEllipseBorder,
    'x-mod': colors.xModBorder,
  }
  return borderMap[type]
}

/**
 * Helper to get canvas color by waveguide type
 */
export const getCanvasWaveguideColor = (type: WaveguideType): string => {
  const canvasColorMap: Record<WaveguideType, string> = {
    'h-guide': canvasColors.hGuide,
    'v-guide': canvasColors.vGuide,
    'super-ellipse': canvasColors.superEllipse,
    'x-mod': canvasColors.xMod,
  }
  return canvasColorMap[type]
}
