/**
 * R-OSSE Waveguide Mathematics Library
 * =====================================
 *
 * Barrel export for all mathematical functions used in waveguide design.
 */

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
// R-OSSE parametric equations
export { computeROSSE, lookupX, lookupY } from './rosse'
// Superellipse cross-sections
export { computeSuperellipseN, superellipsePoints } from './superellipse'
// X-shape polar modulation
export { generateXModPreview, xModRaw, xModulation } from './xModulation'
