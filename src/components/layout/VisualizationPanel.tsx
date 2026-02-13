/**
 * Visualization Panel Component
 * ==============================
 *
 * Right panel containing tabbed canvas visualizations.
 */

import { useWaveguide } from '../../context/WaveguideContext'
import { Canvas3DView } from '../visualizations/Canvas3DView'
import { CanvasCrossSectionView } from '../visualizations/CanvasCrossSectionView'
import { CanvasGuidesView } from '../visualizations/CanvasGuidesView'
import { CanvasXModView } from '../visualizations/CanvasXModView'

export function VisualizationPanel() {
  const { state, dispatch } = useWaveguide()

  const tabs = [
    { id: '3d' as const, label: '3D VIEW' },
    { id: 'guides' as const, label: 'GUIDES' },
    { id: 'cross' as const, label: 'CROSS-SECTIONS' },
    { id: 'xmod' as const, label: 'X-MOD POLAR' },
  ]

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex" style={{ borderBottom: '1px solid #201c16', background: '#13110d' }}>
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => dispatch({ type: 'SET_VISUALIZATION_MODE', mode: id })}
            className="text-[9px] font-bold tracking-[1.2px] cursor-pointer"
            style={{
              padding: '9px 16px',
              background: state.visualizationMode === id ? '#1c1a14' : 'transparent',
              border: 'none',
              borderBottom: `2px solid ${state.visualizationMode === id ? '#c8a84e' : 'transparent'}`,
              color: state.visualizationMode === id ? '#c8a84e' : '#4a4430',
              fontFamily: 'inherit',
            }}
          >
            {label}
          </button>
        ))}
        {state.visualizationMode === '3d' && (
          <span className="ml-auto self-center text-[8px] pr-[14px]" style={{ color: '#302c20' }}>
            drag to orbit
          </span>
        )}
      </div>
      <div className="flex-1 relative">
        {state.visualizationMode === '3d' && <Canvas3DView />}
        {state.visualizationMode === 'guides' && <CanvasGuidesView />}
        {state.visualizationMode === 'cross' && <CanvasCrossSectionView />}
        {state.visualizationMode === 'xmod' && <CanvasXModView />}
      </div>
    </div>
  )
}
