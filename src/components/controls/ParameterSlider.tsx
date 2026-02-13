/**
 * Parameter Slider Component
 * ==========================
 *
 * Reusable slider control for numeric parameters matching original styling.
 */

import { colors, getWaveguideColor, type WaveguideType } from '../../lib/design-tokens'

interface ParameterSliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  color?: WaveguideType
  unit?: string
  decimals?: number
}

export function ParameterSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  color,
  unit = '',
  decimals = 2,
}: ParameterSliderProps) {
  const accentColor = color ? getWaveguideColor(color) : colors.primary

  return (
    <div className="mb-[7px]">
      <div
        className="flex justify-between text-xs mb-[1px]"
        style={{ color: colors.mutedForeground, fontFamily: 'inherit' }}
      >
        <span>{label}</span>
        <span style={{ color: accentColor }}>
          {step < 0.1 ? value.toFixed(decimals) : step < 1 ? value.toFixed(1) : Math.round(value)}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
        style={{ accentColor, height: '3px' }}
      />
    </div>
  )
}
