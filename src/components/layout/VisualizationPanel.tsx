/**
 * Visualization Panel Component
 * ==============================
 *
 * Right panel containing tabbed canvas visualizations.
 */

import { useWaveguide } from '../../context/WaveguideContext'
import { colors } from '../../lib/design-tokens'
import { Canvas3DView } from '../visualizations/Canvas3DView'
import { CanvasBlendCurvesView } from '../visualizations/CanvasBlendCurvesView'
import { CanvasCrossSectionView } from '../visualizations/CanvasCrossSectionView'
import { CanvasGuidesView } from '../visualizations/CanvasGuidesView'
import { CanvasModView } from '../visualizations/CanvasModView'

export function VisualizationPanel() {
  const { state, dispatch } = useWaveguide()

  const tabs = [
    { id: '3d' as const, label: '3D VIEW' },
    { id: 'guides' as const, label: 'GUIDES' },
    { id: 'cross' as const, label: 'CROSS-SECTIONS' },
    { id: 'xmod' as const, label: 'MOD POLAR' },
    { id: 'blend' as const, label: 'BLEND CURVES' },
  ]

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div
        className="flex"
        style={{ borderBottom: `1px solid ${colors.panelBorder}`, background: colors.panelBg }}
      >
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => dispatch({ type: 'SET_VISUALIZATION_MODE', mode: id })}
            className="text-micro font-bold tracking-[1.2px] cursor-pointer"
            style={{
              padding: '9px 16px',
              background: state.visualizationMode === id ? colors.card : 'transparent',
              border: 'none',
              borderBottom: `2px solid ${state.visualizationMode === id ? colors.primary : 'transparent'}`,
              color: state.visualizationMode === id ? colors.primary : colors.textSubtle,
              fontFamily: 'inherit',
            }}
          >
            {label}
          </button>
        ))}
        {state.visualizationMode === '3d' && (
          <span
            className="ml-auto self-center text-tiny pr-[14px]"
            style={{ color: colors.textSubtleDark }}
          >
            drag to orbit
          </span>
        )}
      </div>
      <div className="flex-1 relative">
        {state.visualizationMode === '3d' && <Canvas3DView />}
        {state.visualizationMode === 'guides' && <CanvasGuidesView />}
        {state.visualizationMode === 'cross' && <CanvasCrossSectionView />}
        {state.visualizationMode === 'xmod' && <CanvasModView />}
        {state.visualizationMode === 'blend' && <CanvasBlendCurvesView />}
      </div>
    </div>
  )
}
