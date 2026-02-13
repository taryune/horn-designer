/**
 * Drag Rotation Hook
 * ==================
 *
 * Manages 3D view rotation state via mouse/touch drag interactions.
 */

import { type MouseEvent, type TouchEvent, useCallback, useRef, useState } from 'react'

interface DragState {
  isDragging: boolean
  lastX: number
  lastY: number
}

/**
 * Hook for managing 3D rotation via drag gestures.
 */
export function useDragRotation(sensitivity: number = 0.005) {
  const [rotationX, setRotationX] = useState(0.3)
  const [rotationY, setRotationY] = useState(0.5)
  const dragStateRef = useRef<DragState>({
    isDragging: false,
    lastX: 0,
    lastY: 0,
  })

  const onMouseDown = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
    dragStateRef.current = {
      isDragging: true,
      lastX: e.clientX,
      lastY: e.clientY,
    }
  }, [])

  const onMouseMove = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      if (!dragStateRef.current.isDragging) return

      const dx = e.clientX - dragStateRef.current.lastX
      const dy = e.clientY - dragStateRef.current.lastY

      setRotationX((prev) => prev + dy * sensitivity)
      setRotationY((prev) => prev + dx * sensitivity)

      dragStateRef.current.lastX = e.clientX
      dragStateRef.current.lastY = e.clientY
    },
    [sensitivity],
  )

  const onMouseUp = useCallback(() => {
    dragStateRef.current.isDragging = false
  }, [])

  const onTouchStart = useCallback((e: TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      dragStateRef.current = {
        isDragging: true,
        lastX: touch.clientX,
        lastY: touch.clientY,
      }
    }
  }, [])

  const onTouchMove = useCallback(
    (e: TouchEvent<HTMLCanvasElement>) => {
      if (!dragStateRef.current.isDragging || e.touches.length !== 1) return

      const touch = e.touches[0]
      const dx = touch.clientX - dragStateRef.current.lastX
      const dy = touch.clientY - dragStateRef.current.lastY

      setRotationX((prev) => prev + dy * sensitivity)
      setRotationY((prev) => prev + dx * sensitivity)

      dragStateRef.current.lastX = touch.clientX
      dragStateRef.current.lastY = touch.clientY
    },
    [sensitivity],
  )

  const onTouchEnd = useCallback(() => {
    dragStateRef.current.isDragging = false
  }, [])

  return {
    rotationX,
    rotationY,
    handlers: {
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave: onMouseUp,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  }
}
