import { useWaveguide } from '../../context/WaveguideContext'
import { ROSSE_PARAMS } from '../../lib/config/parameterConfig'
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
        {...ROSSE_PARAMS.rho}
        onChange={(value) => {
          dispatch({ type: 'UPDATE_H_PARAM', param: 'rho', value })
          dispatch({ type: 'UPDATE_V_PARAM', param: 'rho', value })
        }}
      />
      <ParameterSlider
        label="m shift"
        value={h.m}
        {...ROSSE_PARAMS.m}
        onChange={(value) => {
          dispatch({ type: 'UPDATE_H_PARAM', param: 'm', value })
          dispatch({ type: 'UPDATE_V_PARAM', param: 'm', value })
        }}
      />
      <ParameterSlider
        label="b bending"
        value={h.b}
        {...ROSSE_PARAMS.b}
        onChange={(value) => {
          dispatch({ type: 'UPDATE_H_PARAM', param: 'b', value })
          dispatch({ type: 'UPDATE_V_PARAM', param: 'b', value })
        }}
      />
      <ParameterSlider
        label="q shape"
        value={h.q}
        {...ROSSE_PARAMS.q}
        onChange={(value) => {
          dispatch({ type: 'UPDATE_H_PARAM', param: 'q', value })
          dispatch({ type: 'UPDATE_V_PARAM', param: 'q', value })
        }}
      />
    </ParameterSection>
  )
}
