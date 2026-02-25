/**
 * Parameter Slider Component
 * ==========================
 *
 * Reusable slider control for numeric parameters matching original styling.
 * Supports click-to-edit for precise value input.
 */

import { useEffect, useRef, useState } from 'react'
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
  compact?: boolean
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
  compact = false,
}: ParameterSliderProps) {
  const accentColor = color ? getWaveguideColor(color) : colors.primary
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus and select text when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleStartEdit = () => {
    setEditValue(value.toString())
    setIsEditing(true)
  }

  const handleFinishEdit = () => {
    const numValue = parseFloat(editValue)

    // If valid number, clamp to range and apply
    if (!Number.isNaN(numValue) && Number.isFinite(numValue)) {
      const clampedValue = Math.max(min, Math.min(max, numValue))
      onChange(clampedValue)
    }
    // If invalid, value stays unchanged

    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleFinishEdit()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }

  const formatValue = (val: number) => {
    return step < 0.1 ? val.toFixed(decimals) : step < 1 ? val.toFixed(1) : Math.round(val)
  }

  if (compact) {
    return (
      <div className="flex-1">
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
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleFinishEdit}
            onKeyDown={handleKeyDown}
            className="w-full text-[0.5rem] text-center mt-[1px] px-1 rounded border"
            style={{
              color: accentColor,
              borderColor: accentColor,
              background: colors.background,
            }}
          />
        ) : (
          <button
            type="button"
            className="text-[0.5rem] text-center mt-[1px] cursor-pointer hover:underline w-full bg-transparent border-0 p-0"
            style={{ color: accentColor, fontFamily: 'inherit' }}
            onClick={handleStartEdit}
          >
            {formatValue(value)}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="mb-[7px]">
      <div
        className="flex justify-between text-xs mb-[1px]"
        style={{ color: colors.mutedForeground, fontFamily: 'inherit' }}
      >
        <span>{label}</span>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleFinishEdit}
            onKeyDown={handleKeyDown}
            className="px-1 py-0 text-xs text-right rounded border outline-none"
            style={{
              color: accentColor,
              borderColor: accentColor,
              background: colors.background,
              width: '80px',
              fontFamily: 'inherit',
            }}
          />
        ) : (
          <button
            type="button"
            className="cursor-pointer hover:underline bg-transparent border-0 p-0"
            style={{ color: accentColor, fontFamily: 'inherit' }}
            onClick={handleStartEdit}
          >
            {formatValue(value)}
            {unit}
          </button>
        )}
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
