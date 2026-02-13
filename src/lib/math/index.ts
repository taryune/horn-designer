/**
 * R-OSSE Waveguide Mathematics Library
 * =====================================
 *
 * Barrel export for all mathematical functions used in waveguide design.
 */

// Blending functions
export {
  poweredSmoothstep,
  smoothLerp,
  smoothstep,
  smoothstep5,
} from './blending'
// Geometry utilities
export {
  cartesianToPolar,
  clamp,
  distance2D,
  distance3D,
  lerp,
  polarToCartesian,
  rot3,
} from './geometry'
// 3D mesh generation
export { buildMesh, computeMeshMetrics } from './mesh'
// Dual modulation system
export {
  combinedModulation,
  generateModulationPreview,
  modRawCardinal,
  modRawDiagonal,
  prepModParams,
} from './modulation'
// R-OSSE parametric equations
export { computeROSSE, lookupX, lookupY } from './rosse'
// Superellipse cross-sections
export { computeSuperellipseN, superellipsePoints } from './superellipse'
