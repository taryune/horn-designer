import { useWaveguide } from '../../context/WaveguideContext'
import { MODULATION_PARAMS } from '../../lib/config/parameterConfig'
import { colors } from '../../lib/design-tokens'
import { ParameterSlider } from './ParameterSlider'

export function DiagonalModSection() {
  const { state, dispatch } = useWaveguide()
  const d = state.diagonalMod

  return (
    <div
      className="rounded-[5px] mb-[7px] transition-all duration-300"
      style={{
        background: colors.card,
        border: '1px solid',
        borderColor: d.enabled ? colors.diagonalModBorder : colors.panelBorderLight,
        padding: '9px 11px',
      }}
    >
      <div className="flex justify-between items-center mb-[6px]">
        <div
          className="text-micro font-extrabold uppercase tracking-[1.8px]"
          style={{ color: colors.diagonalMod }}
        >
          DIAGONAL MODULATION
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: 'UPDATE_DIAGONAL_ENABLED', value: !d.enabled })}
          className="rounded-[3px] text-micro font-bold cursor-pointer"
          style={{
            background: d.enabled ? colors.diagonalMod30 : colors.secondary,
            border: `1px solid ${d.enabled ? colors.diagonalMod : colors.border}`,
            padding: '2px 8px',
            color: d.enabled ? colors.diagonalMod : colors.textDisabled,
            fontFamily: 'inherit',
          }}
        >
          {d.enabled ? 'ON' : 'OFF'}
        </button>
      </div>
      <div className="text-micro mb-[8px] italic" style={{ color: colors.mutedForeground }}>
        r(θ) = base + amp·|sin(freq·θ)|^exp
      </div>
      {d.enabled && (
        <>
          <ParameterSlider
            label="base"
            value={d.base}
            {...MODULATION_PARAMS.base}
            onChange={(value) => dispatch({ type: 'UPDATE_DIAGONAL_NUMBER', param: 'base', value })}
            color="diagonal-mod"
          />
          <ParameterSlider
            label="amplitude"
            value={d.amp}
            {...MODULATION_PARAMS.amp}
            onChange={(value) => dispatch({ type: 'UPDATE_DIAGONAL_NUMBER', param: 'amp', value })}
            color="diagonal-mod"
          />
          <ParameterSlider
            label="frequency"
            value={d.freq}
            {...MODULATION_PARAMS.freq}
            onChange={(value) => dispatch({ type: 'UPDATE_DIAGONAL_NUMBER', param: 'freq', value })}
            color="diagonal-mod"
          />
          <ParameterSlider
            label="exponent"
            value={d.exp}
            {...MODULATION_PARAMS.exp}
            onChange={(value) => dispatch({ type: 'UPDATE_DIAGONAL_NUMBER', param: 'exp', value })}
            color="diagonal-mod"
          />
        </>
      )}
    </div>
  )
}
