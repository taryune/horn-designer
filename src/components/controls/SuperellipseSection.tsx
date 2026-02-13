import { useWaveguide } from '../../context/WaveguideContext'
import { ParameterSection } from './ParameterSection'
import { ParameterSlider } from './ParameterSlider'

export function SuperellipseSection() {
  const { state, dispatch } = useWaveguide()
  const s = state.superellipse

  return (
    <ParameterSection title="SUPERELLIPSE" color="super-ellipse">
      <ParameterSlider
        label="n rectangularity"
        value={s.nMouth}
        min={2}
        max={10}
        step={0.1}
        onChange={(value) => dispatch({ type: 'UPDATE_SUPERELLIPSE', param: 'nMouth', value })}
        color="super-ellipse"
      />
      <ParameterSlider
        label="transition start"
        value={s.transStart}
        min={0}
        max={0.5}
        step={0.02}
        onChange={(value) => dispatch({ type: 'UPDATE_SUPERELLIPSE', param: 'transStart', value })}
        color="super-ellipse"
      />
      <ParameterSlider
        label="shape power"
        value={s.shapePow}
        min={0.3}
        max={4}
        step={0.1}
        onChange={(value) => dispatch({ type: 'UPDATE_SUPERELLIPSE', param: 'shapePow', value })}
        color="super-ellipse"
      />
    </ParameterSection>
  )
}
