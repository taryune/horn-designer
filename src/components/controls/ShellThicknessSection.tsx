/**
 * Shell Thickness Controls
 * =========================
 *
 * Controls for shell thickness and cap configuration for CAD export.
 *
 * Thickness is added to the BACKSIDE (exterior) of the waveguide.
 * This preserves the exact R-OSSE acoustic design while adding
 * structural wall thickness on the outside.
 */

import { useWaveguide } from '../../context/WaveguideContext'
import { SHELL_PARAMS } from '../../lib/config/parameterConfig'
import { colors } from '../../lib/design-tokens'
import { ParameterSection } from './ParameterSection'
import { ParameterSlider } from './ParameterSlider'

export function ShellThicknessSection() {
  const { state, dispatch } = useWaveguide()
  const { enabled, thickness } = state.shellParams

  return (
    <ParameterSection title="SHELL THICKNESS">
      {/* Enable/Disable Toggle */}
      <div className="flex items-center gap-2 mb-[7px]">
        <input
          type="checkbox"
          id="shell-enabled"
          checked={enabled}
          onChange={(e) => dispatch({ type: 'UPDATE_SHELL_ENABLED', value: e.target.checked })}
          className="cursor-pointer"
          style={{ accentColor: colors.primary }}
        />
        <label
          htmlFor="shell-enabled"
          className="text-xs cursor-pointer"
          style={{ color: colors.mutedForeground }}
        >
          Enable wall thickness (for CAD/3D printing)
        </label>
      </div>

      {/* Thickness Slider */}
      {enabled && (
        <>
          <ParameterSlider
            label="wall thickness"
            value={thickness}
            {...SHELL_PARAMS.thickness}
            onChange={(value) =>
              dispatch({ type: 'UPDATE_SHELL_NUMBER', param: 'thickness', value })
            }
          />

          <div className="text-[0.625rem] text-text-subtle-dark mt-2">
            {thickness}mm walls · Edge strips always included for watertight shell
          </div>
        </>
      )}

      {!enabled && (
        <div className="text-[0.625rem] text-text-subtle-dark mt-1">
          Surface only (no thickness)
        </div>
      )}
    </ParameterSection>
  )
}
