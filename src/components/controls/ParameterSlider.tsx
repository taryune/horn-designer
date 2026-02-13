/**
 * Parameter Slider Component
 * ==========================
 *
 * Reusable slider control for numeric parameters matching original styling.
 */

interface ParameterSliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  color?: 'h-guide' | 'v-guide' | 'super-ellipse' | 'x-mod'
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
  const accentColors = {
    'h-guide': '#e8943a',
    'v-guide': '#4a9de8',
    'super-ellipse': '#b898d0',
    'x-mod': '#a06cf0',
  }

  const accentColor = color ? accentColors[color] : '#c8a84e'

  return (
    <div className="mb-[7px]">
      <div
        className="flex justify-between text-[10px] mb-[1px]"
        style={{ color: '#a09880', fontFamily: 'inherit' }}
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
