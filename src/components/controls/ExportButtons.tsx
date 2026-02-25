/**
 * Export Buttons Component
 * ========================
 *
 * CSV and OBJ export action buttons.
 */

import { useExport } from '../../hooks/useExport'
import { colors } from '../../lib/design-tokens'

export function ExportButtons() {
  const { exportCSV, exportOBJ, exportSTL, hasData } = useExport()

  return (
    <div className="space-y-[4px] mb-[7px]">
      {/* Top row: CSV and OBJ */}
      <div className="flex gap-[4px]">
        <button
          onClick={exportCSV}
          disabled={!hasData}
          className="flex-1 rounded-[4px] text-xxs font-bold tracking-[1px] cursor-pointer"
          style={{
            padding: '9px',
            background: colors.panelHeaderBg,
            border: `1px solid ${colors.panelBorderMedium}`,
            color: colors.primary,
            fontFamily: 'inherit',
          }}
        >
          ▼ CSV
        </button>
        <button
          onClick={exportOBJ}
          disabled={!hasData}
          className="flex-1 rounded-[4px] text-xxs font-bold tracking-[1px] cursor-pointer"
          style={{
            padding: '9px',
            background: colors.panelHeaderBg,
            border: `1px solid ${colors.panelBorderMedium}`,
            color: colors.primary,
            fontFamily: 'inherit',
          }}
        >
          ▼ OBJ
        </button>
      </div>

      {/* Bottom row: STL */}
      <button
        onClick={exportSTL}
        disabled={!hasData}
        className="w-full rounded-[4px] text-xxs font-bold tracking-[1px] cursor-pointer"
        style={{
          padding: '9px',
          background: colors.panelHeaderBg,
          border: `1px solid ${colors.panelBorderMedium}`,
          color: colors.primary,
          fontFamily: 'inherit',
        }}
      >
        ▼ STL (3D Printing / CAD)
      </button>
    </div>
  )
}
