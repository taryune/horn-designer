/**
 * Export Buttons Component
 * ========================
 *
 * CSV and OBJ export action buttons.
 */

import { useExport } from '../../hooks/useExport'

export function ExportButtons() {
  const { exportCSV, exportOBJ, hasData } = useExport()

  return (
    <div className="flex gap-[4px] mb-[7px]">
      <button
        onClick={exportCSV}
        disabled={!hasData}
        className="flex-1 rounded-[4px] text-[10px] font-bold tracking-[1px] cursor-pointer"
        style={{
          padding: '9px',
          background: '#201c14',
          border: '1px solid #3a3420',
          color: '#c8a84e',
          fontFamily: 'inherit',
        }}
      >
        ▼ CSV
      </button>
      <button
        onClick={exportOBJ}
        disabled={!hasData}
        className="flex-1 rounded-[4px] text-[10px] font-bold tracking-[1px] cursor-pointer"
        style={{
          padding: '9px',
          background: '#201c14',
          border: '1px solid #3a3420',
          color: '#c8a84e',
          fontFamily: 'inherit',
        }}
      >
        ▼ OBJ
      </button>
    </div>
  )
}
