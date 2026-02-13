import { useWaveguide } from '../../context/WaveguideContext'
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
        min={40}
        max={350}
        step={5}
        onChange={(value) => dispatch({ type: 'UPDATE_H_PARAM', param: 'R', value })}
        unit="mm"
        decimals={0}
        color="h-guide"
      />
      <ParameterSlider
        label="α_h half-angle"
        value={h.a_deg}
        min={15}
        max={60}
        step={1}
        onChange={(value) => dispatch({ type: 'UPDATE_H_PARAM', param: 'a_deg', value })}
        unit="°"
        decimals={0}
        color="h-guide"
      />
    </ParameterSection>
  )
}
