/**
 * Export Hook
 * ===========
 *
 * Provides export functions for mesh data.
 */

import { useCallback } from 'react'
import { downloadCSV, downloadOBJ } from '../lib/export'
import { useMeshData } from './useMeshData'

/**
 * Hook to get mesh export functions.
 */
export function useExport() {
  const { meshData } = useMeshData()

  const exportCSV = useCallback(() => {
    downloadCSV(meshData, 'horn-designer.csv')
  }, [meshData])

  const exportOBJ = useCallback(() => {
    downloadOBJ(meshData, 'horn-designer.obj')
  }, [meshData])

  return {
    exportCSV,
    exportOBJ,
    hasData: meshData !== null,
  }
}
