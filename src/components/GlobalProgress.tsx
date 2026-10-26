import { useEffect, useRef, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'

/**
 * Thin top-of-page progress bar that animates on every navigation.
 * - Rushes to ~80 % while the router is pending
 * - Completes to 100 % and fades out once navigation settles
 */
export default function GlobalProgress() {
  const isPending = useRouterState({ select: (s) => s.status === 'pending' })

  const [width, setWidth] = useState(0)
  const [visible, setVisible] = useState(false)
  const rafRef = useRef<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clear = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  useEffect(() => {
    if (isPending) {
      // Start a new bar
      clear()
      setWidth(0)
      setVisible(true)

      // Let the 0 % paint first, then animate to ~72 %
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => setWidth(72))
      })
    } else {
      // Navigation done — complete the bar then fade out
      setWidth(100)
      timerRef.current = setTimeout(() => setVisible(false), 400)
    }

    return clear
  }, [isPending])

  if (!visible) return null

  return (
    <div
      role="progressbar"
      aria-label="Page loading"
      aria-valuenow={width}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: 3,
        pointerEvents: 'none',
      }}
    >
      {/* Track (subtle background) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(99,102,241,0.15)',
        }}
      />

      {/* Bar */}
      <div
        style={{
          height: '100%',
          width: `${width}%`,
          backgroundColor: 'rgb(99,102,241)', // indigo-500 — swap to your brand color
          borderRadius: '0 2px 2px 0',
          boxShadow: '0 0 8px 1px rgba(99,102,241,0.6)',
          transition:
            width === 100
              ? 'width 0.2s ease-out, opacity 0.3s ease 0.15s'
              : 'width 8s cubic-bezier(0.1, 0.05, 0, 1)', // slow crawl while pending
          opacity: width === 100 ? 0 : 1,
        }}
      />
    </div>
  )
}
