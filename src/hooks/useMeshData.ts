/**
 * Mesh Data Hook
 * ==============
 *
 * Computes and memoizes 3D mesh data from waveguide state.
 */

import { useMemo } from 'react'
import { useWaveguide } from '../context/WaveguideContext'
import { buildMesh, computeMeshMetrics } from '../lib/math/mesh'
import { computeROSSE } from '../lib/math/rosse'
import type { MeshData, ROSSEResult } from '../lib/types/waveguide'

/**
 * Hook to get computed mesh data and metrics.
 *
 * Memoizes expensive calculations and only recomputes when parameters change.
 * React Compiler will automatically optimize this further.
 */
export function useMeshData() {
  const { state } = useWaveguide()

  // Compute horizontal R-OSSE guide
  const hData: ROSSEResult | null = useMemo(
    () => computeROSSE(state.horizontal),
    [state.horizontal],
  )

  // Compute vertical R-OSSE guide
  const vData: ROSSEResult | null = useMemo(() => computeROSSE(state.vertical), [state.vertical])

  // Build complete 3D mesh with v2 dual modulation
  const meshData: MeshData | null = useMemo(
    () =>
      buildMesh(
        hData,
        vData,
        state.shapeBlend,
        state.modBlend,
        state.diagonalMod,
        state.cardinalMod,
        state.meshResolution.rings,
        state.meshResolution.slices,
      ),
    [
      hData,
      vData,
      state.shapeBlend,
      state.modBlend,
      state.diagonalMod,
      state.cardinalMod,
      state.meshResolution.rings,
      state.meshResolution.slices,
    ],
  )

  // Compute metrics for display
  const metrics = useMemo(() => computeMeshMetrics(meshData), [meshData])

  return {
    hData,
    vData,
    meshData,
    metrics,
  }
}
