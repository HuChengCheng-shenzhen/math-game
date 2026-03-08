import type { DifficultyConfig, DifficultyLevel, PatternComplexity } from './types'

// 难度配置
export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  easy: { minNumber: 5, maxNumber: 10, patternComplexity: 1, hintDuration: 3000 },
  medium: { minNumber: 5, maxNumber: 15, patternComplexity: 2, hintDuration: 2000 },
  hard: { minNumber: 5, maxNumber: 20, patternComplexity: 3, hintDuration: 1000 },
}

// 图案复杂度定义
export const PATTERN_COMPLEXITIES: Record<1 | 2 | 3, PatternComplexity> = {
  1: {
    level: 1,
    description: '简单图案',
    characteristics: {
      maxVariants: 5,
      hasDetails: false,
      animationComplexity: 1,
      arrangement: 'grid',
    },
  },
  2: {
    level: 2,
    description: '中等图案',
    characteristics: {
      maxVariants: 10,
      hasDetails: true,
      animationComplexity: 2,
      arrangement: 'grid',
    },
  },
  3: {
    level: 3,
    description: '复杂图案',
    characteristics: {
      maxVariants: 15,
      hasDetails: true,
      animationComplexity: 3,
      arrangement: 'grid',
    },
  },
}

// 图案主题
export const PATTERN_THEMES = ['icecream', 'cookie', 'star', 'balloon', 'animal'] as const

// 动画类型
export const ANIMATION_TYPES = ['bounce', 'float', 'spin', 'pulse', 'wave'] as const

// 游戏常量
export const INITIAL_SCORE = 0
export const INITIAL_LEVEL = 1
export const SCORE_PER_CORRECT = 10
export const CONSECUTIVE_CORRECT_FOR_UPGRADE = 3