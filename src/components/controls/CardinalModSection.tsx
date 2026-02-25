import { useWaveguide } from '../../context/WaveguideContext'
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
            min={0.05}
            max={1}
            step={0.05}
            onChange={(value) => dispatch({ type: 'UPDATE_CARDMOD_NUMBER', param: 'base', value })}
            color="cardinal-mod"
          />
          <ParameterSlider
            label="amplitude"
            value={c.amp}
            min={0}
            max={1.5}
            step={0.05}
            onChange={(value) => dispatch({ type: 'UPDATE_CARDMOD_NUMBER', param: 'amp', value })}
            color="cardinal-mod"
          />
          <ParameterSlider
            label="frequency"
            value={c.freq}
            min={0.5}
            max={6}
            step={0.1}
            onChange={(value) => dispatch({ type: 'UPDATE_CARDMOD_NUMBER', param: 'freq', value })}
            decimals={1}
            color="cardinal-mod"
          />
          <ParameterSlider
            label="exponent"
            value={c.exp}
            min={1}
            max={12}
            step={0.5}
            onChange={(value) => dispatch({ type: 'UPDATE_CARDMOD_NUMBER', param: 'exp', value })}
            decimals={1}
            color="cardinal-mod"
          />
        </>
      )}
    </div>
  )
}
