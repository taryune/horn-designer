import { useWaveguide } from '../../context/WaveguideContext'
import { SHAPE_BLEND_PARAMS } from '../../lib/config/parameterConfig'
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
        {...SHAPE_BLEND_PARAMS.nMouth}
        onChange={(value) => dispatch({ type: 'UPDATE_SHAPE_BLEND', param: 'nMouth', value })}
        color="super-ellipse"
      />
      <div className="flex items-center gap-2 mt-3">
        <span className="text-[0.625rem] text-text-subtle-dark min-w-[60px]">shape blend</span>
        <div className="flex items-center gap-1 flex-1">
          <ParameterSlider
            label=""
            value={s.shapeStart}
            {...SHAPE_BLEND_PARAMS.shapeStart}
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
            {...SHAPE_BLEND_PARAMS.shapeEnd}
            onChange={(value) => dispatch({ type: 'UPDATE_SHAPE_BLEND', param: 'shapeEnd', value })}
            color="super-ellipse"
            compact
          />
        </div>
      </div>
      <ParameterSlider
        label="shape power"
        value={s.shapePow}
        {...SHAPE_BLEND_PARAMS.shapePow}
        onChange={(value) => dispatch({ type: 'UPDATE_SHAPE_BLEND', param: 'shapePow', value })}
        color="super-ellipse"
      />
    </ParameterSection>
  )
}
