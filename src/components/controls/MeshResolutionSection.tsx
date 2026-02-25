/**
 * Mesh Resolution Controls
 * =========================
 *
 * Controls for adjusting 3D mesh tessellation density.
 */

import { useWaveguide } from '../../context/WaveguideContext'
import { MESH_RESOLUTION_PARAMS } from '../../lib/config/parameterConfig'
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
        {...MESH_RESOLUTION_PARAMS.rings}
        onChange={(value) => dispatch({ type: 'UPDATE_MESH_RESOLUTION', param: 'rings', value })}
      />
      <ParameterSlider
        label="slices (angular)"
        value={slices}
        {...MESH_RESOLUTION_PARAMS.slices}
        onChange={(value) => dispatch({ type: 'UPDATE_MESH_RESOLUTION', param: 'slices', value })}
      />
      <div className="text-[0.625rem] text-text-subtle-dark mt-1">
        {totalVertices.toLocaleString()} vertices · {totalFaces.toLocaleString()} faces
      </div>
    </ParameterSection>
  )
}
