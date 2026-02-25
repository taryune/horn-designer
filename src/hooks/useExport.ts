/**
 * Export Hook
 * ===========
 *
 * Provides export functions for mesh data.
 */

import { useCallback } from 'react'
import { useWaveguide } from '../context/WaveguideContext'
import { downloadCSV, downloadOBJ, downloadSTL } from '../lib/export'
import { useMeshData } from './useMeshData'

/**
 * Hook to get mesh export functions.
 */
export function useExport() {
  const { meshData } = useMeshData()
  const { state } = useWaveguide()

  const exportCSV = useCallback(() => {
    downloadCSV(meshData, 'horn-designer.csv')
  }, [meshData])

  const exportOBJ = useCallback(() => {
    downloadOBJ(meshData, 'horn-designer.obj')
  }, [meshData])

  const exportSTL = useCallback(() => {
    downloadSTL(meshData, state.shellParams, 'horn-designer.stl')
  }, [meshData, state.shellParams])

  return {
    exportCSV,
    exportOBJ,
    exportSTL,
    hasData: meshData !== null,
  }
}
