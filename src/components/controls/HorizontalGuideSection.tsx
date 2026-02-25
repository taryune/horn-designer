import { useWaveguide } from '../../context/WaveguideContext'
import { HORIZONTAL_GUIDE_PARAMS } from '../../lib/config/parameterConfig'
import { ParameterSection } from './ParameterSection'
import { ParameterSlider } from './ParameterSlider'

export function HorizontalGuideSection() {
  const { state, dispatch } = useWaveguide()
  const h = state.horizontal

  return (
    <ParameterSection title="H GUIDE" color="h-guide">
      <ParameterSlider
        label="R_h radius"
        value={h.R}
        {...HORIZONTAL_GUIDE_PARAMS.R}
        onChange={(value) => dispatch({ type: 'UPDATE_H_PARAM', param: 'R', value })}
        color="h-guide"
      />
      <ParameterSlider
        label="α_h half-angle"
        value={h.a_deg}
        {...HORIZONTAL_GUIDE_PARAMS.a_deg}
        onChange={(value) => dispatch({ type: 'UPDATE_H_PARAM', param: 'a_deg', value })}
        color="h-guide"
      />
    </ParameterSection>
  )
}
