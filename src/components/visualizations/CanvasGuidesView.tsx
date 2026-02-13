import { useCanvas } from '../../hooks/useCanvas'
import { useMeshData } from '../../hooks/useMeshData'
import { canvasColors } from '../../lib/design-tokens'

export function CanvasGuidesView() {
  const { hData, vData } = useMeshData()

  const canvasRef = useCanvas(
    (ctx, canvas) => {
      const w = canvas.width / (window.devicePixelRatio || 1)
      const h = canvas.height / (window.devicePixelRatio || 1)

      ctx.fillStyle = canvasColors.background
      ctx.fillRect(0, 0, w, h)

      if (!hData || !vData) {
        ctx.fillStyle = canvasColors.text
        ctx.font = '14px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('No guide data', w / 2, h / 2)
        return
      }

      const allP = [...hData.points, ...vData.points]
      const mxX = Math.max(...allP.map((p) => p.x))
      const mxY = Math.max(...allP.map((p) => p.y))
      const pad = 50
      const sc = Math.min((w - pad * 2) / (mxX * 1.08), (h - pad * 2) / (mxY * 1.2))
      const ox = pad + 10
      const oy = h - pad

      // H curve
      ctx.strokeStyle = canvasColors.hGuide
      ctx.lineWidth = 2.5
      ctx.beginPath()
      for (const [i, p] of hData.points.entries()) {
        if (i === 0) ctx.moveTo(ox + p.x * sc, oy - p.y * sc)
        else ctx.lineTo(ox + p.x * sc, oy - p.y * sc)
      }
      ctx.stroke()

      // V curve
      ctx.strokeStyle = canvasColors.vGuide
      ctx.lineWidth = 2.5
      ctx.beginPath()
      for (const [i, p] of vData.points.entries()) {
        if (i === 0) ctx.moveTo(ox + p.x * sc, oy - p.y * sc)
        else ctx.lineTo(ox + p.x * sc, oy - p.y * sc)
      }
      ctx.stroke()

      // Legend
      ctx.font = '12px monospace'
      ctx.fillStyle = canvasColors.hGuide
      ctx.textAlign = 'left'
      ctx.fillText('▬ Horizontal Guide', ox + 8, pad + 18)
      ctx.fillStyle = canvasColors.vGuide
      ctx.fillText('▬ Vertical Guide', ox + 8, pad + 34)
    },
    [hData, vData],
  )

  return <canvas ref={canvasRef} className="w-full h-full" />
}
