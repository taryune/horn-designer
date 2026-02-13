/**
 * Parameter Section Component
 * ===========================
 *
 * Grouped section of related parameter controls with colored accent.
 */

import type { ReactNode } from 'react'

interface ParameterSectionProps {
  title: string
  color?: 'h-guide' | 'v-guide' | 'super-ellipse' | 'x-mod'
  children: ReactNode
}

export function ParameterSection({ title, color, children }: ParameterSectionProps) {
  const borderColors = {
    'h-guide': '#3a2c14',
    'v-guide': '#1a2c44',
    'super-ellipse': '#382848',
    'x-mod': '#44286a',
  }

  const textColors = {
    'h-guide': '#e8943a',
    'v-guide': '#4a9de8',
    'super-ellipse': '#b898d0',
    'x-mod': '#a06cf0',
  }

  return (
    <div
      className="rounded-[5px] mb-[7px]"
      style={{
        background: '#1c1a14',
        border: '1px solid',
        borderColor: color ? borderColors[color] : '#302c22',
        padding: '9px 11px',
      }}
    >
      <div
        className="text-[9.5px] font-extrabold uppercase tracking-[1.8px] mb-[7px]"
        style={{ color: color ? textColors[color] : '#c8a84e' }}
      >
        {title}
      </div>
      {children}
    </div>
  )
}
