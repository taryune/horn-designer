import { useWaveguide } from '../../context/WaveguideContext'
import { useCanvas } from '../../hooks/useCanvas'
import { canvasColors } from '../../lib/design-tokens'
import { generateModulationPreview } from '../../lib/math/modulation'

export function CanvasModView() {
  const { state } = useWaveguide()
  const { diagonalMod, cardinalMod } = state

  const canvasRef = useCanvas(
    (ctx, canvas) => {
      const w = canvas.width / (window.devicePixelRatio || 1)
      const h = canvas.height / (window.devicePixelRatio || 1)

      ctx.fillStyle = canvasColors.background
      ctx.fillRect(0, 0, w, h)

      const cx = w / 2
      const cy = h / 2
      const maxR = Math.min(w, h) * 0.35

      // Grid circles
      ctx.strokeStyle = canvasColors.grid
      ctx.lineWidth = 0.5
      for (let r = 0.25; r <= 1; r += 0.25) {
        ctx.beginPath()
        ctx.arc(cx, cy, maxR * r, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Axes
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(cx - maxR * 1.1, cy)
      ctx.lineTo(cx + maxR * 1.1, cy)
      ctx.moveTo(cx, cy - maxR * 1.1)
      ctx.lineTo(cx, cy + maxR * 1.1)
      ctx.stroke()
      ctx.setLineDash([])

      if (!diagonalMod.enabled && !cardinalMod.enabled) {
        ctx.fillStyle = canvasColors.text
        ctx.font = '14px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('Modulation Disabled', cx, cy)
        return
      }

      // Generate modulation previews
      const modData = generateModulationPreview(diagonalMod, cardinalMod, 360)

      // Find max value for scaling
      let maxVal = 1.5
      if (diagonalMod.enabled && modData.diagonalPoints.length > 0) {
        maxVal = Math.max(maxVal, ...modData.diagonalPoints.map(([r]) => r))
      }
      if (cardinalMod.enabled && modData.cardinalPoints.length > 0) {
        maxVal = Math.max(maxVal, ...modData.cardinalPoints.map(([r]) => r))
      }
      const scale = maxR / maxVal

      // Draw reference circle (multiplier = 1)
      ctx.strokeStyle = canvasColors.grid
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.arc(cx, cy, scale, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])

      // Plot diagonal modulation if enabled
      if (diagonalMod.enabled) {
        ctx.strokeStyle = canvasColors.diagonalMod70
        ctx.lineWidth = 2
        ctx.beginPath()
        let first = true
        for (const [r, theta] of modData.diagonalPoints) {
          const x = cx + r * scale * Math.cos(theta)
          const y = cy + r * scale * Math.sin(theta)
          if (first) {
            ctx.moveTo(x, y)
            first = false
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.closePath()
        ctx.stroke()
      }

      // Plot Cardinal modulation if enabled
      if (cardinalMod.enabled) {
        ctx.strokeStyle = canvasColors.cardinalMod70
        ctx.lineWidth = 2
        ctx.beginPath()
        let first = true
        for (const [r, theta] of modData.cardinalPoints) {
          const x = cx + r * scale * Math.cos(theta)
          const y = cy + r * scale * Math.sin(theta)
          if (first) {
            ctx.moveTo(x, y)
            first = false
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.closePath()
        ctx.stroke()
      }

      // Plot combined normalized multiplier
      if (diagonalMod.enabled || cardinalMod.enabled) {
        ctx.strokeStyle = '#d0c8a8' // Use foreground color for combined
        ctx.lineWidth = 3
        ctx.beginPath()
        let first = true
        for (const [mult, theta] of modData.combinedPoints) {
          const x = cx + mult * scale * Math.cos(theta)
          const y = cy + mult * scale * Math.sin(theta)
          if (first) {
            ctx.moveTo(x, y)
            first = false
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.closePath()
        ctx.stroke()
      }

      // Info legend
      ctx.font = '11px monospace'
      ctx.textAlign = 'left'
      let yPos = 20

      if (diagonalMod.enabled) {
        ctx.fillStyle = canvasColors.diagonalMod
        ctx.fillText(
          `Diag: f=${diagonalMod.freq.toFixed(1)} a=${diagonalMod.amp.toFixed(2)} e=${diagonalMod.exp.toFixed(1)}`,
          10,
          yPos,
        )
        yPos += 15
      }

      if (cardinalMod.enabled) {
        ctx.fillStyle = canvasColors.cardinalMod
        ctx.fillText(
          `Card: f=${cardinalMod.freq.toFixed(1)} a=${cardinalMod.amp.toFixed(2)} e=${cardinalMod.exp.toFixed(1)}`,
          10,
          yPos,
        )
      }
    },
    [diagonalMod, cardinalMod],
  )

  return <canvas ref={canvasRef} className="w-full h-full" />
}
