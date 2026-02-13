import { useWaveguide } from '../../context/WaveguideContext'
import { useCanvas } from '../../hooks/useCanvas'
import { useDragRotation } from '../../hooks/useDragRotation'
import { useMeshData } from '../../hooks/useMeshData'
import { canvasColors } from '../../lib/design-tokens'
import { rot3 } from '../../lib/math/geometry'

export function Canvas3DView() {
  const { meshData } = useMeshData()
  const { state } = useWaveguide()
  const { rotationX, rotationY, handlers } = useDragRotation()

  const canvasRef = useCanvas(
    (ctx, canvas) => {
      const w = canvas.width / (window.devicePixelRatio || 1)
      const h = canvas.height / (window.devicePixelRatio || 1)

      ctx.fillStyle = canvasColors.background
      ctx.fillRect(0, 0, w, h)

      if (!meshData) {
        ctx.fillStyle = canvasColors.text
        ctx.font = '14px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('No mesh data', w / 2, h / 2)
        return
      }

      const { rings, numSlices } = meshData

      // Calculate bounding box
      let minX = Infinity,
        minY = Infinity,
        minZ = Infinity
      let maxX = -Infinity,
        maxY = -Infinity,
        maxZ = -Infinity

      for (const { ring } of rings) {
        for (const [px, py, pz] of ring) {
          minX = Math.min(minX, px)
          minY = Math.min(minY, py)
          minZ = Math.min(minZ, pz)
          maxX = Math.max(maxX, px)
          maxY = Math.max(maxY, py)
          maxZ = Math.max(maxZ, pz)
        }
      }

      const centerX = (minX + maxX) / 2
      const centerY = (minY + maxY) / 2
      const centerZ = (minZ + maxZ) / 2
      const extent = Math.max(maxX - minX, maxY - minY, maxZ - minZ)
      const scale = (Math.min(w, h) - 80) / extent

      // Projection function
      const project = (px: number, py: number, pz: number): [number, number, number] => {
        const [x, y, z] = rot3(px - centerX, py - centerY, pz - centerZ, rotationX, rotationY)
        return [w / 2 + x * scale, h / 2 - y * scale, z]
      }

      // Draw rings (cross-sectional contours)
      for (const [ri, { ring }] of rings.entries()) {
        const f = ri / (rings.length - 1)
        const rr = Math.round(70 + f * 162)
        const gg = Math.round(150 - f * 30 + f * 60)
        const bb = Math.round(210 - f * 150)
        const alpha = ri === 0 || ri === rings.length - 1 ? 0.95 : 0.18 + f * 0.22
        ctx.strokeStyle = `rgba(${rr},${gg},${bb},${alpha})`
        ctx.lineWidth = ri === 0 || ri === rings.length - 1 ? 2 : 0.55

        ctx.beginPath()
        for (const [i, [px, py, pz]] of ring.entries()) {
          const [sx, sy] = project(px, py, pz)
          if (i === 0) ctx.moveTo(sx, sy)
          else ctx.lineTo(sx, sy)
        }
        ctx.closePath()
        ctx.stroke()
      }

      // Draw longitudinal lines
      const step = Math.max(1, Math.floor(numSlices / 18))
      for (let si = 0; si <= numSlices; si += step) {
        ctx.strokeStyle = canvasColors.primaryGrid
        ctx.lineWidth = 0.4
        ctx.beginPath()
        for (const [ri, { ring }] of rings.entries()) {
          const [sx, sy] = project(ring[si][0], ring[si][1], ring[si][2])
          if (ri === 0) ctx.moveTo(sx, sy)
          else ctx.lineTo(sx, sy)
        }
        ctx.stroke()
      }

      // Draw H guide (θ=0° and θ=180°)
      const halfSlice = Math.round(numSlices / 2)
      ctx.strokeStyle = canvasColors.hGuide90
      ctx.lineWidth = 2

      // θ=0° (positive X-axis)
      ctx.beginPath()
      for (const [ri, { ring }] of rings.entries()) {
        const [sx, sy] = project(ring[0][0], ring[0][1], ring[0][2])
        if (ri === 0) ctx.moveTo(sx, sy)
        else ctx.lineTo(sx, sy)
      }
      ctx.stroke()

      // θ=180° (negative X-axis)
      ctx.beginPath()
      for (const [ri, { ring }] of rings.entries()) {
        const [sx, sy] = project(ring[halfSlice][0], ring[halfSlice][1], ring[halfSlice][2])
        if (ri === 0) ctx.moveTo(sx, sy)
        else ctx.lineTo(sx, sy)
      }
      ctx.stroke()

      // Draw V guide (θ=90° and θ=270°)
      const quarterSlice = Math.round(numSlices / 4)
      const threeQuarterSlice = Math.round((3 * numSlices) / 4)
      ctx.strokeStyle = canvasColors.vGuide90
      ctx.lineWidth = 2

      // θ=90° (positive Y-axis)
      ctx.beginPath()
      for (const [ri, { ring }] of rings.entries()) {
        const [sx, sy] = project(
          ring[quarterSlice][0],
          ring[quarterSlice][1],
          ring[quarterSlice][2],
        )
        if (ri === 0) ctx.moveTo(sx, sy)
        else ctx.lineTo(sx, sy)
      }
      ctx.stroke()

      // θ=270° (negative Y-axis)
      ctx.beginPath()
      for (const [ri, { ring }] of rings.entries()) {
        const [sx, sy] = project(
          ring[threeQuarterSlice][0],
          ring[threeQuarterSlice][1],
          ring[threeQuarterSlice][2],
        )
        if (ri === 0) ctx.moveTo(sx, sy)
        else ctx.lineTo(sx, sy)
      }
      ctx.stroke()

      // Draw diagonal guides (when X-mod enabled)
      if (state.xMod.enabled) {
        const d1 = Math.round(numSlices / 8) // 45°
        const d3 = Math.round((3 * numSlices) / 8) // 135°
        const d5 = Math.round((5 * numSlices) / 8) // 225°
        const d7 = Math.round((7 * numSlices) / 8) // 315°

        ctx.strokeStyle = canvasColors.xMod70
        ctx.lineWidth = 1.5

        for (const si of [d1, d3, d5, d7]) {
          ctx.beginPath()
          for (const [ri, { ring }] of rings.entries()) {
            const [sx, sy] = project(ring[si][0], ring[si][1], ring[si][2])
            if (ri === 0) ctx.moveTo(sx, sy)
            else ctx.lineTo(sx, sy)
          }
          ctx.stroke()
        }
      }

      // Draw legend
      ctx.font = '12px monospace'
      ctx.textAlign = 'left'
      ctx.fillStyle = canvasColors.hGuide
      ctx.fillText('▬ H guide', 14, h - 42)
      ctx.fillStyle = canvasColors.vGuide
      ctx.fillText('▬ V guide', 14, h - 26)
      if (state.xMod.enabled) {
        ctx.fillStyle = canvasColors.xMod
        ctx.fillText('▬ Diagonal', 14, h - 10)
      }

      // Instructions
      ctx.fillStyle = canvasColors.text
      ctx.font = '12px monospace'
      ctx.textAlign = 'right'
      ctx.fillText('Drag to rotate', w - 14, h - 10)
    },
    [meshData, rotationX, rotationY, state.xMod.enabled],
  )

  return <canvas ref={canvasRef} className="w-full h-full" {...handlers} />
}
