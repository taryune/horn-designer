import { useWaveguide } from '../../context/WaveguideContext'
import { VERTICAL_GUIDE_PARAMS } from '../../lib/config/parameterConfig'
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
        {...VERTICAL_GUIDE_PARAMS.R}
        onChange={(value) => dispatch({ type: 'UPDATE_V_PARAM', param: 'R', value })}
        color="v-guide"
      />
      <ParameterSlider
        label="α_v half-angle"
        value={v.a_deg}
        {...VERTICAL_GUIDE_PARAMS.a_deg}
        onChange={(value) => dispatch({ type: 'UPDATE_V_PARAM', param: 'a_deg', value })}
        color="v-guide"
      />
    </ParameterSection>
  )
}
