/**
 * Throat Section Component
 * ========================
 *
 * Controls for throat radius parameter.
 */

import { useWaveguide } from '../../context/WaveguideContext'
import { ROSSE_PARAMS } from '../../lib/config/parameterConfig'
import { ParameterSection } from './ParameterSection'
import { ParameterSlider } from './ParameterSlider'

export function ThroatSection() {
  const { state, dispatch } = useWaveguide()

  return (
    <ParameterSection title="THROAT">
      <ParameterSlider
        label="r₀ radius"
        value={state.horizontal.r0}
        {...ROSSE_PARAMS.r0}
        onChange={(value) => {
          dispatch({ type: 'UPDATE_H_PARAM', param: 'r0', value })
          dispatch({ type: 'UPDATE_V_PARAM', param: 'r0', value })
        }}
      />
      <ParameterSlider
        label="α₀ angle"
        value={state.horizontal.a0_deg}
        {...ROSSE_PARAMS.a0_deg}
        onChange={(value) => {
          dispatch({ type: 'UPDATE_H_PARAM', param: 'a0_deg', value })
          dispatch({ type: 'UPDATE_V_PARAM', param: 'a0_deg', value })
        }}
      />
      <ParameterSlider
        label="k expansion"
        value={state.horizontal.k}
        {...ROSSE_PARAMS.k}
        onChange={(value) => {
          dispatch({ type: 'UPDATE_H_PARAM', param: 'k', value })
          dispatch({ type: 'UPDATE_V_PARAM', param: 'k', value })
        }}
      />
    </ParameterSection>
  )
}
