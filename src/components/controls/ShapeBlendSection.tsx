import { useWaveguide } from '../../context/WaveguideContext'
import { ParameterSection } from './ParameterSection'
import { ParameterSlider } from './ParameterSlider'

export function ShapeBlendSection() {
  const { state, dispatch } = useWaveguide()
  const s = state.shapeBlend

  return (
    <ParameterSection title="CROSS-SECTION" color="super-ellipse">
      <ParameterSlider
        label="n rectangularity"
        value={s.nMouth}
        min={2}
        max={10}
        step={0.1}
        onChange={(value) => dispatch({ type: 'UPDATE_SHAPE_BLEND', param: 'nMouth', value })}
        color="super-ellipse"
      />
      <div className="flex items-center gap-2 mt-3">
        <span className="text-[0.625rem] text-text-subtle-dark min-w-[60px]">shape blend</span>
        <div className="flex items-center gap-1 flex-1">
          <ParameterSlider
            label=""
            value={s.shapeStart}
            min={0}
            max={0.6}
            step={0.01}
            onChange={(value) =>
              dispatch({ type: 'UPDATE_SHAPE_BLEND', param: 'shapeStart', value })
            }
            color="super-ellipse"
            compact
          />
          <span className="text-[0.5rem] text-text-subtle mx-1">→</span>
          <ParameterSlider
            label=""
            value={s.shapeEnd}
            min={0.2}
            max={1.0}
            step={0.01}
            onChange={(value) => dispatch({ type: 'UPDATE_SHAPE_BLEND', param: 'shapeEnd', value })}
            color="super-ellipse"
            compact
          />
        </div>
      </div>
      <ParameterSlider
        label="shape power"
        value={s.shapePow}
        min={0.3}
        max={4}
        step={0.1}
        onChange={(value) => dispatch({ type: 'UPDATE_SHAPE_BLEND', param: 'shapePow', value })}
        color="super-ellipse"
      />
    </ParameterSection>
  )
}
