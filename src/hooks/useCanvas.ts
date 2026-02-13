/**
 * Canvas Hook
 * ===========
 *
 * Manages canvas rendering with automatic updates.
 */

import { useEffect, useRef } from 'react'

/**
 * Hook for managing canvas rendering.
 *
 * @param renderFn - Function to render on the canvas
 * @param dependencies - Array of dependencies that trigger re-render
 * @returns Canvas ref to attach to canvas element
 */
export function useCanvas(
  renderFn: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void,
  dependencies: unknown[],
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to match display size
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Render
    renderFn(ctx, canvas)
  }, dependencies)

  return canvasRef
}
