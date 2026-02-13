import { useWaveguide } from '../../context/WaveguideContext'
import { useCanvas } from '../../hooks/useCanvas'
import { generateXModPreview } from '../../lib/math/xModulation'

export function CanvasXModView() {
  const { state } = useWaveguide()
  const { xMod } = state

  const canvasRef = useCanvas(
    (ctx, canvas) => {
      const w = canvas.width / (window.devicePixelRatio || 1)
      const h = canvas.height / (window.devicePixelRatio || 1)

      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, w, h)

      const cx = w / 2
      const cy = h / 2
      const maxR = Math.min(w, h) * 0.35

      // Grid circles
      ctx.strokeStyle = '#1a1816'
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

      if (!xMod.enabled) {
        ctx.fillStyle = '#605840'
        ctx.font = '14px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('X-Modulation Disabled', cx, cy)
        return
      }

      // Plot X-mod function
      const points = generateXModPreview(xMod, 360)
      const maxVal = Math.max(...points.map(([r]) => r))
      const scale = maxR / maxVal

      ctx.strokeStyle = '#a06cf0'
      ctx.lineWidth = 2
      ctx.beginPath()
      let first = true
      for (const [r, theta] of points) {
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

      // Info
      ctx.fillStyle = '#a06cf0'
      ctx.font = '11px monospace'
      ctx.textAlign = 'left'
      ctx.fillText(
        `freq=${xMod.freq} amp=${xMod.amp.toFixed(2)} exp=${xMod.exp.toFixed(1)}`,
        10,
        20,
      )
    },
    [xMod],
  )

  return <canvas ref={canvasRef} className="w-full h-full" />
}
