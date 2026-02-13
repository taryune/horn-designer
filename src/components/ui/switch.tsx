import { type ComponentPropsWithoutRef, forwardRef } from 'react'

interface SwitchProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'onChange'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ checked = false, onCheckedChange, className = '', ...props }, ref) => {
    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          {...props}
        />
        <div
          className={`
          w-9 h-5 
          bg-[var(--muted)]
          rounded-full 
          peer-checked:bg-[var(--primary)]
          after:content-[''] 
          after:absolute 
          after:top-[2px] 
          after:left-[2px] 
          after:bg-[var(--background)]
          after:rounded-full 
          after:h-4 
          after:w-4 
          after:transition-all 
          peer-checked:after:translate-x-4
          ${className}
        `}
        />
      </label>
    )
  },
)

Switch.displayName = 'Switch'
