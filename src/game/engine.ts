import type { GameState, GameAction, DifficultyLevel } from './types'
import { DIFFICULTY_CONFIGS, SCORE_PER_CORRECT } from './constants'
import { generateRandomNumber, generatePatterns, generateOptions } from './generator'

// 初始游戏状态
export const initialGameState: GameState = {
  currentNumber: 5,
  patterns: [],
  options: [4, 5, 6],
  correctAnswer: 5,
  selectedAnswer: null,
  isCorrect: null,
  score: 0,
  level: 1,
  difficulty: 'medium',
  consecutiveCorrect: 0,
  consecutiveWrong: 0,
  lastAnswerWasWrong: false,
  showHint: false,
}

// 难度调整函数
export function adjustDifficultyUp(current: DifficultyLevel): DifficultyLevel {
  switch (current) {
    case 'easy':
      return 'medium'
    case 'medium':
      return 'hard'
    case 'hard':
      return 'hard' // 已经是最高难度
  }
}

export function adjustDifficultyDown(current: DifficultyLevel): DifficultyLevel {
  switch (current) {
    case 'easy':
      return 'easy' // 已经是最低难度
    case 'medium':
      return 'easy'
    case 'hard':
      return 'medium'
  }
}

// 游戏reducer
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'GENERATE_NEW_ROUND': {
      const config = DIFFICULTY_CONFIGS[state.difficulty]
      const newNumber = generateRandomNumber(config.minNumber, config.maxNumber)
      const newPatterns = generatePatterns(newNumber, config.patternComplexity)
      const newOptions = generateOptions(newNumber, config)

      // 根据上一次回答结果调整难度
      let newDifficulty = state.difficulty
      let newConsecutiveCorrect = state.consecutiveCorrect
      let newConsecutiveWrong = state.consecutiveWrong

      if (state.lastAnswerWasWrong) {
        // 上次错误，降低难度
        newDifficulty = adjustDifficultyDown(state.difficulty)
        newConsecutiveCorrect = 0
        newConsecutiveWrong = 0
      } else if (state.isCorrect === true) {
        // 上次正确，检查是否需要提高难度
        newConsecutiveCorrect = state.consecutiveCorrect + 1
        newConsecutiveWrong = 0
        if (newConsecutiveCorrect >= 3) {
          newDifficulty = adjustDifficultyUp(state.difficulty)
          newConsecutiveCorrect = 0 // 重置连续正确计数
        }
      } else if (state.isCorrect === false) {
        // 上次错误
        newConsecutiveCorrect = 0
        newConsecutiveWrong = state.consecutiveWrong + 1
      }

      return {
        ...state,
        currentNumber: newNumber,
        patterns: newPatterns,
        options: newOptions,
        correctAnswer: newNumber,
        selectedAnswer: null,
        isCorrect: null,
        level: state.level + 1,
        difficulty: newDifficulty,
        consecutiveCorrect: newConsecutiveCorrect,
        consecutiveWrong: newConsecutiveWrong,
        lastAnswerWasWrong: false,
        showHint: false,
      }
    }

    case 'SELECT_ANSWER': {
      const isCorrect = action.payload === state.correctAnswer

      return {
        ...state,
        selectedAnswer: action.payload,
        isCorrect,
        score: isCorrect ? state.score + SCORE_PER_CORRECT : state.score,
        lastAnswerWasWrong: !isCorrect,
        showHint: !isCorrect, // 错误时显示提示
      }
    }

    case 'HIDE_HINT':
      return {
        ...state,
        showHint: false,
      }

    case 'RESET_DIFFICULTY':
      return {
        ...state,
        difficulty: 'medium',
        consecutiveCorrect: 0,
        consecutiveWrong: 0,
        lastAnswerWasWrong: false,
      }

    case 'SET_DIFFICULTY':
      return {
        ...state,
        difficulty: action.payload,
        consecutiveCorrect: 0,
        consecutiveWrong: 0,
        lastAnswerWasWrong: false,
      }

    default:
      return state
  }
}

// 工具函数：检查游戏是否结束（可选功能）
export function isGameComplete(state: GameState): boolean {
  // 例如：达到一定分数或关卡数
  return state.level > 20
}