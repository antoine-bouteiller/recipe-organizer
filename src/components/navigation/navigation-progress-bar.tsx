import { useIsFetching } from '@tanstack/react-query'
import { useRouterState } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

export const NavigationProgressBar = () => {
  const isLoading = useRouterState({ select: (state) => state.isLoading })
  const pendingMatches = useRouterState({
    select: (state) => state.pendingMatches?.length ?? 0,
  })
  const resolvedMatches = useRouterState({
    select: (state) => state.matches.length,
  })
  const fetchingCount = useIsFetching()

  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialCountsRef = useRef({ matches: 0, queries: 0 })

  useEffect(() => {
    if (isLoading) {
      setProgress(0)
      initialCountsRef.current = {
        matches: pendingMatches + resolvedMatches,
        queries: Math.max(fetchingCount, 1),
      }

      showTimeoutRef.current = setTimeout(() => {
        setVisible(true)
      }, 1000)

      return () => {
        if (showTimeoutRef.current) {
          clearTimeout(showTimeoutRef.current)
          showTimeoutRef.current = null
        }
      }
    } else if (visible) {
      setProgress(100)

      hideTimeoutRef.current = setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 300)

      return () => {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current)
          hideTimeoutRef.current = null
        }
      }
    } else {
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current)
        showTimeoutRef.current = null
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

  return <div className="h-0.5 bg-primary transition-all duration-200 ease-out" style={{ width: `${progress}%` }} />
}
