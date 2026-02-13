/**
 * Parameter Section Component
 * ===========================
 *
 * Grouped section of related parameter controls with colored accent.
 */

import type { ReactNode } from 'react'
import {
  colors,
  getWaveguideBorderColor,
  getWaveguideColor,
  type WaveguideType,
} from '../../lib/design-tokens'

interface ParameterSectionProps {
  title: string
  color?: WaveguideType
  children: ReactNode
}

export function ParameterSection({ title, color, children }: ParameterSectionProps) {
  return (
    <div
      className="rounded-[5px] mb-[7px]"
      style={{
        background: colors.card,
        border: '1px solid',
        borderColor: color ? getWaveguideBorderColor(color) : colors.border,
        padding: '9px 11px',
      }}
    >
      <div
        className="text-micro font-extrabold uppercase tracking-[1.8px] mb-[7px]"
        style={{ color: color ? getWaveguideColor(color) : colors.primary }}
      >
        {title}
      </div>
      {children}
    </div>
  )
}
