import { useWaveguide } from '../../context/WaveguideContext'
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
            min={0}
            max={0.6}
            step={0.01}
            onChange={(value) => dispatch({ type: 'UPDATE_MOD_BLEND', param: 'modStart', value })}
            color="diagonal-mod"
            compact
          />
          <span className="text-[0.5rem] text-text-subtle mx-1">→</span>
          <ParameterSlider
            label=""
            value={m.modEnd}
            min={0.3}
            max={1.0}
            step={0.01}
            onChange={(value) => dispatch({ type: 'UPDATE_MOD_BLEND', param: 'modEnd', value })}
            color="diagonal-mod"
            compact
          />
        </div>
      </div>
      <ParameterSlider
        label="mod power"
        value={m.modPow}
        min={0.3}
        max={4}
        step={0.1}
        onChange={(value) => dispatch({ type: 'UPDATE_MOD_BLEND', param: 'modPow', value })}
        color="diagonal-mod"
      />
    </ParameterSection>
  )
}
