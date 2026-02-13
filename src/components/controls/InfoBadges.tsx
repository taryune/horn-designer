/**
 * Info Badges Component
 * =====================
 *
 * Displays computed metrics (throat, depth, mouth dimensions, coverage).
 */

import { useWaveguide } from '../../context/WaveguideContext'
import { useMeshData } from '../../hooks/useMeshData'
import { colors } from '../../lib/design-tokens'

export function InfoBadges() {
  const { metrics } = useMeshData()
  const { state } = useWaveguide()

  if (!metrics) {
    return null
  }

  const info = [
    ['Throat', `${(metrics.throat * 2).toFixed(1)}mm`],
    ['Depth', `${metrics.depth.toFixed(1)}mm`],
    ['Mouth', `${Math.round(metrics.mouthWidth)}×${Math.round(metrics.mouthHeight)}`],
    [
      'Coverage',
      `${Math.round(state.horizontal.a_deg * 2)}°×${Math.round(state.vertical.a_deg * 2)}°`,
    ],
  ]

  return (
    <div className="grid grid-cols-2 gap-[3px] mb-[7px]">
      {info.map(([label, value]) => (
        <div
          key={label}
          className="rounded-[4px] text-xs"
          style={{
            background: colors.secondary,
            border: `1px solid ${colors.panelBorderLight}`,
            padding: '4px 7px',
          }}
        >
          <div className="text-xxs uppercase tracking-[1px]" style={{ color: colors.textSubtle }}>
            {label}
          </div>
          <div className="font-bold mt-[1px]" style={{ color: colors.secondaryForeground }}>
            {value}
          </div>
        </div>
      ))}
    </div>
  )
}
