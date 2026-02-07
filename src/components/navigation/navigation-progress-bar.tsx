import { useRouterState } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

export const NavigationProgressBar = () => {
  const isLoading = useRouterState({ select: (s) => s.isLoading })
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isLoading) {
      setProgress(0)
      setVisible(true)

      // Simulate progress that slows down as it approaches 90%
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            return prev
          }
          const remaining = 90 - prev
          return prev + remaining * 0.1
        })
      }, 200)
    } else if (visible) {
      // Navigation complete: jump to 100% then fade out
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setProgress(100)

      const timeout = setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 300)

      return () => clearTimeout(timeout)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isLoading, visible])

  if (!visible) {
    return null
  }

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5">
      <div
        className="h-full bg-primary transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
