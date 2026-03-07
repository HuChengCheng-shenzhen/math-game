import { describe, it, expect } from 'vitest'
import { gameReducer, initialGameState, adjustDifficultyUp, adjustDifficultyDown } from './engine'
import type { GameState, GameAction } from './types'

describe('gameReducer', () => {
  it('should handle SELECT_ANSWER correctly', () => {
    const state: GameState = {
      ...initialGameState,
      currentNumber: 7,
      correctAnswer: 7,
      options: [6, 7, 8],
    }

    // 测试正确答案
    const action: GameAction = { type: 'SELECT_ANSWER', payload: 7 }
    const newState = gameReducer(state, action)

    expect(newState.selectedAnswer).toBe(7)
    expect(newState.isCorrect).toBe(true)
    expect(newState.score).toBe(10) // SCORE_PER_CORRECT 应该是10
    expect(newState.lastAnswerWasWrong).toBe(false)
    expect(newState.showHint).toBe(false)

    // 测试错误答案
    const state2: GameState = {
      ...initialGameState,
      currentNumber: 7,
      correctAnswer: 7,
      options: [6, 7, 8],
    }
    const action2: GameAction = { type: 'SELECT_ANSWER', payload: 6 }
    const newState2 = gameReducer(state2, action2)

    expect(newState2.selectedAnswer).toBe(6)
    expect(newState2.isCorrect).toBe(false)
    expect(newState2.score).toBe(0)
    expect(newState2.lastAnswerWasWrong).toBe(true)
    expect(newState2.showHint).toBe(true)
  })

  it('should handle GENERATE_NEW_ROUND', () => {
    const state: GameState = {
      ...initialGameState,
      currentNumber: 7,
      correctAnswer: 7,
      selectedAnswer: 7,
      isCorrect: true,
      consecutiveCorrect: 2,
      level: 5,
    }

    const action: GameAction = { type: 'GENERATE_NEW_ROUND' }
    const newState = gameReducer(state, action)

    expect(newState.selectedAnswer).toBeNull()
    expect(newState.isCorrect).toBeNull()
    expect(newState.level).toBe(6)
    expect(newState.showHint).toBe(false)
    // 连续正确次数达到3时会被重置为0，难度提升
    expect(newState.consecutiveCorrect).toBe(0)
    expect(newState.difficulty).toBe('hard') // 从medium提升到hard
  })

  it('should handle HIDE_HINT', () => {
    const state: GameState = {
      ...initialGameState,
      showHint: true,
    }

    const action: GameAction = { type: 'HIDE_HINT' }
    const newState = gameReducer(state, action)

    expect(newState.showHint).toBe(false)
  })

  it('should handle RESET_DIFFICULTY', () => {
    const state: GameState = {
      ...initialGameState,
      difficulty: 'hard',
      consecutiveCorrect: 5,
      consecutiveWrong: 2,
      lastAnswerWasWrong: true,
    }

    const action: GameAction = { type: 'RESET_DIFFICULTY' }
    const newState = gameReducer(state, action)

    expect(newState.difficulty).toBe('medium')
    expect(newState.consecutiveCorrect).toBe(0)
    expect(newState.consecutiveWrong).toBe(0)
    expect(newState.lastAnswerWasWrong).toBe(false)
  })

  it('should handle SET_DIFFICULTY', () => {
    const state: GameState = initialGameState

    const action: GameAction = { type: 'SET_DIFFICULTY', payload: 'hard' }
    const newState = gameReducer(state, action)

    expect(newState.difficulty).toBe('hard')
    expect(newState.consecutiveCorrect).toBe(0)
    expect(newState.consecutiveWrong).toBe(0)
    expect(newState.lastAnswerWasWrong).toBe(false)
  })
})

describe('difficulty adjustment', () => {
  it('adjustDifficultyUp should increase difficulty', () => {
    expect(adjustDifficultyUp('easy')).toBe('medium')
    expect(adjustDifficultyUp('medium')).toBe('hard')
    expect(adjustDifficultyUp('hard')).toBe('hard') // 已经是最高难度
  })

  it('adjustDifficultyDown should decrease difficulty', () => {
    expect(adjustDifficultyDown('easy')).toBe('easy') // 已经是最低难度
    expect(adjustDifficultyDown('medium')).toBe('easy')
    expect(adjustDifficultyDown('hard')).toBe('medium')
  })
})

describe('difficulty progression in game', () => {
  it('should increase difficulty after 3 consecutive correct answers', () => {
    let state: GameState = {
      ...initialGameState,
      difficulty: 'easy',
      consecutiveCorrect: 2,
      isCorrect: true,
    }

    // 第三次正确回答
    const action: GameAction = { type: 'GENERATE_NEW_ROUND' }
    const newState = gameReducer(state, action)

    // 连续正确次数达到3，难度应该提升到medium
    expect(newState.difficulty).toBe('medium')
    expect(newState.consecutiveCorrect).toBe(0) // 重置
  })

  it('should decrease difficulty after wrong answer', () => {
    let state: GameState = {
      ...initialGameState,
      difficulty: 'medium',
      lastAnswerWasWrong: true,
    }

    const action: GameAction = { type: 'GENERATE_NEW_ROUND' }
    const newState = gameReducer(state, action)

    // 上次错误，难度应该降低到easy
    expect(newState.difficulty).toBe('easy')
    expect(newState.consecutiveCorrect).toBe(0)
    expect(newState.consecutiveWrong).toBe(0)
  })
})