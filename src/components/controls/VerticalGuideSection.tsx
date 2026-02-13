import { useWaveguide } from '../../context/WaveguideContext'
import { ParameterSection } from './ParameterSection'
import { ParameterSlider } from './ParameterSlider'

export function VerticalGuideSection() {
  const { state, dispatch } = useWaveguide()
  const v = state.vertical

  return (
    <ParameterSection title="V GUIDE" color="v-guide">
      <ParameterSlider
        label="R_v radius"
        value={v.R}
        min={30}
        max={300}
        step={5}
        onChange={(value) => dispatch({ type: 'UPDATE_V_PARAM', param: 'R', value })}
        unit="mm"
        decimals={0}
        color="v-guide"
      />
      <ParameterSlider
        label="α_v half-angle"
        value={v.a_deg}
        min={10}
        max={55}
        step={1}
        onChange={(value) => dispatch({ type: 'UPDATE_V_PARAM', param: 'a_deg', value })}
        unit="°"
        decimals={0}
        color="v-guide"
      />
    </ParameterSection>
  )
}
