/**
 * Throat Section Component
 * ========================
 *
 * Controls for throat radius parameter.
 */

import { useWaveguide } from '../../context/WaveguideContext'
import { ParameterSection } from './ParameterSection'
import { ParameterSlider } from './ParameterSlider'

export function ThroatSection() {
  const { state, dispatch } = useWaveguide()

  return (
    <ParameterSection title="THROAT">
      <ParameterSlider
        label="r₀ radius"
        value={state.horizontal.r0}
        min={6}
        max={36}
        step={0.5}
        onChange={(value) => {
          dispatch({ type: 'UPDATE_H_PARAM', param: 'r0', value })
          dispatch({ type: 'UPDATE_V_PARAM', param: 'r0', value })
        }}
        unit="mm"
        decimals={1}
      />
      <ParameterSlider
        label="α₀ angle"
        value={state.horizontal.a0_deg}
        min={0}
        max={20}
        step={0.5}
        onChange={(value) => {
          dispatch({ type: 'UPDATE_H_PARAM', param: 'a0_deg', value })
          dispatch({ type: 'UPDATE_V_PARAM', param: 'a0_deg', value })
        }}
        unit="°"
        decimals={1}
      />
      <ParameterSlider
        label="k expansion"
        value={state.horizontal.k}
        min={0.3}
        max={5}
        step={0.1}
        onChange={(value) => {
          dispatch({ type: 'UPDATE_H_PARAM', param: 'k', value })
          dispatch({ type: 'UPDATE_V_PARAM', param: 'k', value })
        }}
        decimals={1}
      />
    </ParameterSection>
  )
}
