"use client"

import * as React from "react"

interface HistoryState<T> {
  past: T[]
  present: T
  future: T[]
}

export interface HistoryControls {
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

/**
 * Undo/redo state container. Every `set` pushes the previous value onto the
 * past stack and clears the redo future — the standard editor history model,
 * kept generic so any builder surface can reuse it.
 */
export function useHistoryState<T>(
  initial: T
): [T, (updater: T | ((prev: T) => T)) => void, HistoryControls & { commit: (next: T) => void }] {
  const [state, setState] = React.useState<HistoryState<T>>({
    past: [],
    present: initial,
    future: [],
  })

  const set = React.useCallback((updater: T | ((prev: T) => T)) => {
    setState((cur) => {
      const next =
        typeof updater === "function"
          ? (updater as (prev: T) => T)(cur.present)
          : updater
      if (Object.is(next, cur.present)) return cur
      return { past: [...cur.past, cur.present], present: next, future: [] }
    })
  }, [])

  const undo = React.useCallback(() => {
    setState((cur) => {
      if (cur.past.length === 0) return cur
      const previous = cur.past[cur.past.length - 1]
      return {
        past: cur.past.slice(0, -1),
        present: previous,
        future: [cur.present, ...cur.future],
      }
    })
  }, [])

  const redo = React.useCallback(() => {
    setState((cur) => {
      if (cur.future.length === 0) return cur
      const [next, ...rest] = cur.future
      return {
        past: [...cur.past, cur.present],
        present: next,
        future: rest,
      }
    })
  }, [])

  const commit = React.useCallback((next: T) => {
    setState({ past: [], present: next, future: [] })
  }, [])

  return [
    state.present,
    set,
    {
      undo,
      redo,
      canUndo: state.past.length > 0,
      canRedo: state.future.length > 0,
      commit,
    },
  ]
}
