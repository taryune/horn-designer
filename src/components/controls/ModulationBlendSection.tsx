import { useWaveguide } from '../../context/WaveguideContext'
import { MODULATION_BLEND_PARAMS } from '../../lib/config/parameterConfig'
import { ParameterSection } from './ParameterSection'
import { ParameterSlider } from './ParameterSlider'

export function ModulationBlendSection() {
  const { state, dispatch } = useWaveguide()
  const m = state.modBlend

  return (
    <ParameterSection title="MODULATION BLEND" color="diagonal-mod">
      <div className="flex items-center gap-2">
        <span className="text-[0.625rem] text-text-subtle-dark min-w-[60px]">mod blend</span>
        <div className="flex items-center gap-1 flex-1">
          <ParameterSlider
            label=""
            value={m.modStart}
            {...MODULATION_BLEND_PARAMS.modStart}
            onChange={(value) => dispatch({ type: 'UPDATE_MOD_BLEND', param: 'modStart', value })}
            color="diagonal-mod"
            compact
          />
          <span className="text-[0.5rem] text-text-subtle mx-1">→</span>
          <ParameterSlider
            label=""
            value={m.modEnd}
            {...MODULATION_BLEND_PARAMS.modEnd}
            onChange={(value) => dispatch({ type: 'UPDATE_MOD_BLEND', param: 'modEnd', value })}
            color="diagonal-mod"
            compact
          />
        </div>
      </div>
      <ParameterSlider
        label="mod power"
        value={m.modPow}
        {...MODULATION_BLEND_PARAMS.modPow}
        onChange={(value) => dispatch({ type: 'UPDATE_MOD_BLEND', param: 'modPow', value })}
        color="diagonal-mod"
      />
    </ParameterSection>
  )
}
