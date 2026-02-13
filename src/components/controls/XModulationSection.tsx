import { useWaveguide } from '../../context/WaveguideContext'
import { colors } from '../../lib/design-tokens'
import { ParameterSlider } from './ParameterSlider'

export function XModulationSection() {
  const { state, dispatch } = useWaveguide()
  const x = state.xMod

  return (
    <div
      className="rounded-[5px] mb-[7px] transition-all duration-300"
      style={{
        background: colors.card,
        border: '1px solid',
        borderColor: x.enabled ? colors.xModBorder : colors.panelBorderLight,
        padding: '9px 11px',
      }}
    >
      <div className="flex justify-between items-center mb-[6px]">
        <div
          className="text-micro font-extrabold uppercase tracking-[1.8px]"
          style={{ color: colors.xMod }}
        >
          X-Shape Modulation
        </div>
        <button
          onClick={() => dispatch({ type: 'UPDATE_XMOD_ENABLED', value: !x.enabled })}
          className="rounded-[3px] text-micro font-bold cursor-pointer"
          style={{
            background: x.enabled ? colors.xMod30 : colors.secondary,
            border: `1px solid ${x.enabled ? colors.xMod : colors.border}`,
            padding: '2px 8px',
            color: x.enabled ? colors.xMod : colors.textDisabled,
            fontFamily: 'inherit',
          }}
        >
          {x.enabled ? 'ON' : 'OFF'}
        </button>
      </div>
      <div className="text-micro mb-[8px] italic" style={{ color: colors.mutedForeground }}>
        r(θ) = base + amp·|sin(freq·θ)|^exp
      </div>
      {x.enabled && (
        <>
          <ParameterSlider
            label="base"
            value={x.base}
            min={0.05}
            max={1}
            step={0.05}
            onChange={(value) => dispatch({ type: 'UPDATE_XMOD_NUMBER', param: 'base', value })}
            color="x-mod"
          />
          <ParameterSlider
            label="amplitude"
            value={x.amp}
            min={0}
            max={1.5}
            step={0.05}
            onChange={(value) => dispatch({ type: 'UPDATE_XMOD_NUMBER', param: 'amp', value })}
            color="x-mod"
          />
          <ParameterSlider
            label="frequency"
            value={x.freq}
            min={1}
            max={6}
            step={1}
            onChange={(value) => dispatch({ type: 'UPDATE_XMOD_NUMBER', param: 'freq', value })}
            decimals={0}
            color="x-mod"
          />
          <ParameterSlider
            label="exponent"
            value={x.exp}
            min={1}
            max={12}
            step={1}
            onChange={(value) => dispatch({ type: 'UPDATE_XMOD_NUMBER', param: 'exp', value })}
            decimals={0}
            color="x-mod"
          />
          <div
            className="mt-[4px] pt-[6px]"
            style={{ borderTop: `1px solid ${colors.panelBorderLight}` }}
          >
            <ParameterSlider
              label="blend start (t)"
              value={x.blendStart}
              min={0}
              max={0.6}
              step={0.02}
              onChange={(value) =>
                dispatch({ type: 'UPDATE_XMOD_NUMBER', param: 'blendStart', value })
              }
              color="x-mod"
            />
            <ParameterSlider
              label="blend power"
              value={x.blendPow}
              min={0.5}
              max={5}
              step={0.1}
              onChange={(value) =>
                dispatch({ type: 'UPDATE_XMOD_NUMBER', param: 'blendPow', value })
              }
              color="x-mod"
            />
          </div>
        </>
      )}
    </div>
  )
}
