import { useIsFetching } from '@tanstack/react-query'
import { useRouterState } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

export const NavigationProgressBar = () => {
  const isLoading = useRouterState({ select: (s) => s.isLoading })
  const pendingMatches = useRouterState({
    select: (s) => s.pendingMatches?.length ?? 0,
  })
  const resolvedMatches = useRouterState({
    select: (s) => s.matches.length,
  })
  const fetchingCount = useIsFetching()

  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialCountsRef = useRef({ matches: 0, queries: 0 })

  useEffect(() => {
    if (isLoading) {
      setProgress(0)
      setVisible(true)
      initialCountsRef.current = {
        matches: pendingMatches + resolvedMatches,
        queries: Math.max(fetchingCount, 1),
      }
    } else if (visible) {
      setProgress(100)

      timeoutRef.current = setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 300)

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
      }
    }
  }, [isLoading, visible, pendingMatches, resolvedMatches, fetchingCount])

  useEffect(() => {
    if (!isLoading || !visible) {
      return
    }

    const totalSteps = initialCountsRef.current.matches + initialCountsRef.current.queries

    if (totalSteps === 0) {
      return
    }

    const resolvedSteps = resolvedMatches + Math.max(0, initialCountsRef.current.queries - fetchingCount)
    const realProgress = Math.min((resolvedSteps / totalSteps) * 90, 90)

    setProgress((prev) => Math.max(prev, realProgress))
  }, [isLoading, visible, pendingMatches, resolvedMatches, fetchingCount])

  if (!visible) {
    return null
  }

  return (
    <div className="fixed inset-x-0 top-0 z-60 h-0.5">
      <div className="h-full bg-primary transition-all duration-200 ease-out" style={{ width: `${progress}%` }} />
    </div>
  )
}
