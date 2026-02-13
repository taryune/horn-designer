import { useCanvas } from '../../hooks/useCanvas'
import { useMeshData } from '../../hooks/useMeshData'

export function CanvasGuidesView() {
  const { hData, vData } = useMeshData()

  const canvasRef = useCanvas(
    (ctx, canvas) => {
      const w = canvas.width / (window.devicePixelRatio || 1)
      const h = canvas.height / (window.devicePixelRatio || 1)

      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, w, h)

      if (!hData || !vData) {
        ctx.fillStyle = '#605840'
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
      ctx.strokeStyle = '#e8943a'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      for (const [i, p] of hData.points.entries()) {
        if (i === 0) ctx.moveTo(ox + p.x * sc, oy - p.y * sc)
        else ctx.lineTo(ox + p.x * sc, oy - p.y * sc)
      }
      ctx.stroke()

      // V curve
      ctx.strokeStyle = '#4a9de8'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      for (const [i, p] of vData.points.entries()) {
        if (i === 0) ctx.moveTo(ox + p.x * sc, oy - p.y * sc)
        else ctx.lineTo(ox + p.x * sc, oy - p.y * sc)
      }
      ctx.stroke()

      // Legend
      ctx.font = '11px monospace'
      ctx.fillStyle = '#e8943a'
      ctx.textAlign = 'left'
      ctx.fillText('▬ Horizontal Guide', ox + 8, pad + 18)
      ctx.fillStyle = '#4a9de8'
      ctx.fillText('▬ Vertical Guide', ox + 8, pad + 34)
    },
    [hData, vData],
  )

  return <canvas ref={canvasRef} className="w-full h-full" />
}
