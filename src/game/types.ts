// 游戏核心类型定义

// 难度等级
export type DifficultyLevel = 'easy' | 'medium' | 'hard'

// 难度配置
export interface DifficultyConfig {
  minNumber: number
  maxNumber: number
  patternComplexity: number
  hintDuration: number
}

// 图案主题
export type PatternTheme = 'icecream' | 'cookie' | 'star' | 'balloon' | 'animal'

// 图案
export interface Pattern {
  id: string
  type: PatternTheme
  variant: number
  hasDetails: boolean
  animationType: string
  position: { x: number; y: number }
}

// 图案复杂度定义
export interface PatternComplexity {
  level: 1 | 2 | 3
  description: string
  characteristics: {
    maxVariants: number
    hasDetails: boolean
    animationComplexity: number
    arrangement: 'simple' | 'grid' | 'cluster'
  }
}

// 游戏状态
export interface GameState {
  currentNumber: number
  patterns: Pattern[]
  options: number[]
  correctAnswer: number
  selectedAnswer: number | null
  isCorrect: boolean | null
  score: number
  level: number
  difficulty: DifficultyLevel
  consecutiveCorrect: number
  consecutiveWrong: number
  lastAnswerWasWrong: boolean
  showHint: boolean
}

// 游戏动作类型
export type GameAction =
  | { type: 'GENERATE_NEW_ROUND' }
  | { type: 'SELECT_ANSWER'; payload: number }
  | { type: 'HIDE_HINT' }
  | { type: 'RESET_DIFFICULTY' }
  | { type: 'SET_DIFFICULTY'; payload: DifficultyLevel }