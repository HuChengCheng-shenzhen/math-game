import { useReducer, useCallback } from 'react'
import type { GameState, GameAction } from '../game/types'
import { gameReducer, initialGameState } from '../game/engine'

export const useGameState = () => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState)

  const generateNewRound = useCallback(() => {
    dispatch({ type: 'GENERATE_NEW_ROUND' })
  }, [])

  const selectAnswer = useCallback((answer: number) => {
    dispatch({ type: 'SELECT_ANSWER', payload: answer })
  }, [])

  const hideHint = useCallback(() => {
    dispatch({ type: 'HIDE_HINT' })
  }, [])

  const resetDifficulty = useCallback(() => {
    dispatch({ type: 'RESET_DIFFICULTY' })
  }, [])

  const setDifficulty = useCallback((difficulty: 'easy' | 'medium' | 'hard') => {
    dispatch({ type: 'SET_DIFFICULTY', payload: difficulty })
  }, [])

  return {
    state,
    actions: {
      generateNewRound,
      selectAnswer,
      hideHint,
      resetDifficulty,
      setDifficulty,
    },
  }
}

export type { GameState, GameAction }