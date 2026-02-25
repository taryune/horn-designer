import { useWaveguide } from '../../context/WaveguideContext'
import { MODULATION_PARAMS } from '../../lib/config/parameterConfig'
import { colors } from '../../lib/design-tokens'
import { ParameterSlider } from './ParameterSlider'

export function CardinalModSection() {
  const { state, dispatch } = useWaveguide()
  const c = state.cardinalMod

  return (
    <div
      className="rounded-[5px] mb-[7px] transition-all duration-300"
      style={{
        background: colors.card,
        border: '1px solid',
        borderColor: c.enabled ? colors.cardinalModBorder : colors.panelBorderLight,
        padding: '9px 11px',
      }}
    >
      <div className="flex justify-between items-center mb-[6px]">
        <div
          className="text-micro font-extrabold uppercase tracking-[1.8px]"
          style={{ color: colors.cardinalMod }}
        >
          CARDINAL MODULATION
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: 'UPDATE_CARDMOD_ENABLED', value: !c.enabled })}
          className="rounded-[3px] text-micro font-bold cursor-pointer"
          style={{
            background: c.enabled ? colors.cardinalMod30 : colors.secondary,
            border: `1px solid ${c.enabled ? colors.cardinalMod : colors.border}`,
            padding: '2px 8px',
            color: c.enabled ? colors.cardinalMod : colors.textDisabled,
            fontFamily: 'inherit',
          }}
        >
          {c.enabled ? 'ON' : 'OFF'}
        </button>
      </div>
      <div className="text-micro mb-[8px] italic" style={{ color: colors.mutedForeground }}>
        r(θ) = base + amp·|cos(freq·θ)|^exp
      </div>
      {c.enabled && (
        <>
          <ParameterSlider
            label="base"
            value={c.base}
            {...MODULATION_PARAMS.base}
            onChange={(value) => dispatch({ type: 'UPDATE_CARDMOD_NUMBER', param: 'base', value })}
            color="cardinal-mod"
          />
          <ParameterSlider
            label="amplitude"
            value={c.amp}
            {...MODULATION_PARAMS.amp}
            onChange={(value) => dispatch({ type: 'UPDATE_CARDMOD_NUMBER', param: 'amp', value })}
            color="cardinal-mod"
          />
          <ParameterSlider
            label="frequency"
            value={c.freq}
            {...MODULATION_PARAMS.freq}
            onChange={(value) => dispatch({ type: 'UPDATE_CARDMOD_NUMBER', param: 'freq', value })}
            color="cardinal-mod"
          />
          <ParameterSlider
            label="exponent"
            value={c.exp}
            {...MODULATION_PARAMS.exp}
            onChange={(value) => dispatch({ type: 'UPDATE_CARDMOD_NUMBER', param: 'exp', value })}
            color="cardinal-mod"
          />
        </>
      )}
    </div>
  )
}
