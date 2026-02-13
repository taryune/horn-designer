import { useCanvas } from '../../hooks/useCanvas'
import { useMeshData } from '../../hooks/useMeshData'

export function CanvasCrossSectionView() {
  const { meshData } = useMeshData()

  const canvasRef = useCanvas(
    (ctx, canvas) => {
      const w = canvas.width / (window.devicePixelRatio || 1)
      const h = canvas.height / (window.devicePixelRatio || 1)

      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, w, h)

      if (!meshData) {
        ctx.fillStyle = '#605840'
        ctx.font = '14px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('No mesh data', w / 2, h / 2)
        return
      }

      const { rings } = meshData
      const lastRing = rings[rings.length - 1]
      const mxD = Math.max(lastRing.yH, lastRing.yV) * 1.1
      const pad = 45
      const sc = (Math.min(w, h) - pad * 2) / (mxD * 2.2)
      const cx = w / 2
      const cy = h / 2

      const tValues = [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1.0]
      for (const [ti, tv] of tValues.entries()) {
        const ri = Math.round(tv * (rings.length - 1))
        const { ring } = rings[ri]
        const f = ti / (tValues.length - 1)
        const rr = Math.round(74 + f * 158)
        const gg = Math.round(157 - f * 57)
        const bb = Math.round(232 - f * 172)
        ctx.strokeStyle = `rgba(${rr},${gg},${bb},${ti === 0 || ti === tValues.length - 1 ? 1 : 0.5})`
        ctx.lineWidth = ti === 0 || ti === tValues.length - 1 ? 2.5 : 0.9
        ctx.beginPath()
        for (const [i, [px, py]] of ring.entries()) {
          if (i === 0) ctx.moveTo(cx + px * sc, cy - py * sc)
          else ctx.lineTo(cx + px * sc, cy - py * sc)
        }
        ctx.closePath()
        ctx.stroke()
      }

      // Legend
      ctx.font = '9px monospace'
      ctx.textAlign = 'left'
      for (const [ti, tv] of tValues.entries()) {
        const f = ti / (tValues.length - 1)
        ctx.fillStyle = `rgb(${Math.round(74 + f * 158)},${Math.round(157 - f * 57)},${Math.round(232 - f * 172)})`
        ctx.fillRect(w - 75, 12 + ti * 14, 7, 7)
        ctx.fillStyle = '#605840'
        ctx.fillText(`t=${tv.toFixed(2)}`, w - 64, 19 + ti * 14)
      }
    },
    [meshData],
  )

  return <canvas ref={canvasRef} className="w-full h-full" />
}
