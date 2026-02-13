import { useWaveguide } from '../../context/WaveguideContext'
import { ParameterSection } from './ParameterSection'
import { ParameterSlider } from './ParameterSlider'

export function ProfileShapeSection() {
  const { state, dispatch } = useWaveguide()
  const h = state.horizontal

  return (
    <ParameterSection title="PROFILE SHAPE">
      <ParameterSlider
        label="ρ apex"
        value={h.rho}
        min={0.05}
        max={0.9}
        step={0.05}
        onChange={(value) => {
          dispatch({ type: 'UPDATE_H_PARAM', param: 'rho', value })
          dispatch({ type: 'UPDATE_V_PARAM', param: 'rho', value })
        }}
      />
      <ParameterSlider
        label="m shift"
        value={h.m}
        min={0.5}
        max={1.0}
        step={0.05}
        onChange={(value) => {
          dispatch({ type: 'UPDATE_H_PARAM', param: 'm', value })
          dispatch({ type: 'UPDATE_V_PARAM', param: 'm', value })
        }}
      />
      <ParameterSlider
        label="b bending"
        value={h.b}
        min={0}
        max={0.8}
        step={0.05}
        onChange={(value) => {
          dispatch({ type: 'UPDATE_H_PARAM', param: 'b', value })
          dispatch({ type: 'UPDATE_V_PARAM', param: 'b', value })
        }}
      />
      <ParameterSlider
        label="q shape"
        value={h.q}
        min={1}
        max={10}
        step={0.1}
        onChange={(value) => {
          dispatch({ type: 'UPDATE_H_PARAM', param: 'q', value })
          dispatch({ type: 'UPDATE_V_PARAM', param: 'q', value })
        }}
      />
    </ParameterSection>
  )
}
