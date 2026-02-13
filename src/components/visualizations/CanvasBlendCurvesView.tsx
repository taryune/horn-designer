import { useWaveguide } from '../../context/WaveguideContext'
import { useCanvas } from '../../hooks/useCanvas'
import { canvasColors } from '../../lib/design-tokens'
import { poweredSmoothstep, smoothLerp } from '../../lib/math/blending'

export function CanvasBlendCurvesView() {
  const { state } = useWaveguide()
  const { shapeBlend, modBlend } = state

  const canvasRef = useCanvas(
    (ctx, canvas) => {
      const w = canvas.width / (window.devicePixelRatio || 1)
      const h = canvas.height / (window.devicePixelRatio || 1)

      ctx.fillStyle = canvasColors.background
      ctx.fillRect(0, 0, w, h)

      // Graph dimensions
      const margin = 40
      const graphW = w - margin * 2
      const graphH = h - margin * 2 - 20

      // Draw axes
      ctx.strokeStyle = canvasColors.grid
      ctx.lineWidth = 1

      // X-axis (t parameter from 0 to 1)
      ctx.beginPath()
      ctx.moveTo(margin, h - margin)
      ctx.lineTo(margin + graphW, h - margin)
      ctx.stroke()

      // Y-axis (blend factor from 0 to 1)
      ctx.beginPath()
      ctx.moveTo(margin, margin)
      ctx.lineTo(margin, h - margin)
      ctx.stroke()

      // Grid lines
      ctx.strokeStyle = canvasColors.grid
      ctx.lineWidth = 0.5
      ctx.setLineDash([2, 4])

      // Horizontal grid lines (0.25, 0.5, 0.75)
      for (let i = 1; i <= 3; i++) {
        const y = h - margin - (i * graphH) / 4
        ctx.beginPath()
        ctx.moveTo(margin, y)
        ctx.lineTo(margin + graphW, y)
        ctx.stroke()
      }

      // Vertical grid lines (0.25, 0.5, 0.75)
      for (let i = 1; i <= 3; i++) {
        const x = margin + (i * graphW) / 4
        ctx.beginPath()
        ctx.moveTo(x, margin)
        ctx.lineTo(x, h - margin)
        ctx.stroke()
      }
      ctx.setLineDash([])

      // Draw blend zones as shaded regions
      ctx.globalAlpha = 0.1

      // Shape blend zone
      const shapeStartX = margin + shapeBlend.shapeStart * graphW
      const shapeEndX = margin + shapeBlend.shapeEnd * graphW
      ctx.fillStyle = canvasColors.superEllipse
      ctx.fillRect(shapeStartX, margin, shapeEndX - shapeStartX, graphH)

      // Modulation blend zone
      const modStartX = margin + modBlend.modStart * graphW
      const modEndX = margin + modBlend.modEnd * graphW
      ctx.fillStyle = canvasColors.diagonalMod
      ctx.fillRect(modStartX, margin, modEndX - modStartX, graphH)

      ctx.globalAlpha = 1.0

      // Plot shape blend curve
      ctx.strokeStyle = canvasColors.superEllipse
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let i = 0; i <= 100; i++) {
        const t = i / 100
        const sf = poweredSmoothstep(
          t,
          shapeBlend.shapeStart,
          shapeBlend.shapeEnd,
          shapeBlend.shapePow,
        )
        const x = margin + t * graphW
        const y = h - margin - sf * graphH
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()

      // Plot modulation blend curve
      ctx.strokeStyle = canvasColors.diagonalMod
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let i = 0; i <= 100; i++) {
        const t = i / 100
        const mf = poweredSmoothstep(t, modBlend.modStart, modBlend.modEnd, modBlend.modPow)
        const x = margin + t * graphW
        const y = h - margin - mf * graphH
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()

      // Plot superellipse n value on secondary axis (scaled)
      ctx.strokeStyle = canvasColors.superEllipse + '60'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      for (let i = 0; i <= 100; i++) {
        const t = i / 100
        const n = smoothLerp(
          2,
          shapeBlend.nMouth,
          t,
          shapeBlend.shapeStart,
          shapeBlend.shapeEnd,
          shapeBlend.shapePow,
        )
        const nNorm = (n - 2) / (shapeBlend.nMouth - 2) // Normalize n to 0-1 range
        const x = margin + t * graphW
        const y = h - margin - nNorm * graphH
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()
      ctx.setLineDash([])

      // Labels
      ctx.fillStyle = canvasColors.text
      ctx.font = '11px monospace'

      // X-axis labels
      ctx.textAlign = 'center'
      ctx.fillText('0', margin, h - margin + 15)
      ctx.fillText('0.5', margin + graphW / 2, h - margin + 15)
      ctx.fillText('1', margin + graphW, h - margin + 15)
      ctx.fillText('t (throat → mouth)', margin + graphW / 2, h - margin + 30)

      // Y-axis labels
      ctx.textAlign = 'right'
      ctx.fillText('0', margin - 5, h - margin)
      ctx.fillText('1', margin - 5, margin)

      // Legend
      const legendY = margin + 20
      ctx.textAlign = 'left'

      ctx.fillStyle = canvasColors.superEllipse
      ctx.fillRect(margin + 10, legendY, 15, 2)
      ctx.fillStyle = canvasColors.text
      ctx.fillText('shape blend', margin + 30, legendY + 4)

      ctx.fillStyle = canvasColors.diagonalMod
      ctx.fillRect(margin + 10, legendY + 15, 15, 2)
      ctx.fillStyle = canvasColors.text
      ctx.fillText('mod blend', margin + 30, legendY + 19)

      ctx.strokeStyle = canvasColors.superEllipse + '60'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(margin + 10, legendY + 30)
      ctx.lineTo(margin + 25, legendY + 30)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = canvasColors.text
      ctx.fillText(`n: 2→${shapeBlend.nMouth}`, margin + 30, legendY + 34)

      // Current values display
      ctx.fillStyle = canvasColors.text
      ctx.font = '10px monospace'
      ctx.textAlign = 'right'
      const infoX = w - 15
      let infoY = margin + 15

      ctx.fillText(
        `shape: ${shapeBlend.shapeStart.toFixed(2)}→${shapeBlend.shapeEnd.toFixed(2)} pow=${shapeBlend.shapePow.toFixed(1)}`,
        infoX,
        infoY,
      )
      infoY += 15
      ctx.fillText(
        `mod: ${modBlend.modStart.toFixed(2)}→${modBlend.modEnd.toFixed(2)} pow=${modBlend.modPow.toFixed(1)}`,
        infoX,
        infoY,
      )
    },
    [shapeBlend, modBlend],
  )

  return <canvas ref={canvasRef} className="w-full h-full" />
}
