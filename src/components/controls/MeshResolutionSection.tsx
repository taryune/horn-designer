/**
 * Mesh Resolution Controls
 * =========================
 *
 * Controls for adjusting 3D mesh tessellation density.
 */

import { useWaveguide } from '../../context/WaveguideContext'
import { ParameterSection } from './ParameterSection'
import { ParameterSlider } from './ParameterSlider'

export function MeshResolutionSection() {
  const { state, dispatch } = useWaveguide()
  const { rings, slices } = state.meshResolution

  // Calculate total vertices for info display
  const totalVertices = (rings + 1) * (slices + 1)
  const totalFaces = rings * slices

  return (
    <ParameterSection title="MESH RESOLUTION">
      <ParameterSlider
        label="rings (axial)"
        value={rings}
        min={20}
        max={200}
        step={5}
        onChange={(value) => dispatch({ type: 'UPDATE_MESH_RESOLUTION', param: 'rings', value })}
        decimals={0}
      />
      <ParameterSlider
        label="slices (angular)"
        value={slices}
        min={36}
        max={256}
        step={4}
        onChange={(value) => dispatch({ type: 'UPDATE_MESH_RESOLUTION', param: 'slices', value })}
        decimals={0}
      />
      <div className="text-[0.625rem] text-text-subtle-dark mt-1">
        {totalVertices.toLocaleString()} vertices · {totalFaces.toLocaleString()} faces
      </div>
    </ParameterSection>
  )
}
