import type { Pattern, DifficultyConfig, PatternTheme } from './types'
import { PATTERN_COMPLEXITIES, PATTERN_THEMES, ANIMATION_TYPES } from './constants'

// 生成随机数（包含最小值和最大值）
export function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 根据难度选择主题
function selectThemeBasedOnDifficulty(complexityLevel: number): PatternTheme {
  // 低难度使用更简单的主题
  if (complexityLevel === 1) {
    return PATTERN_THEMES[Math.floor(Math.random() * 2)] // icecream或cookie
  } else if (complexityLevel === 2) {
    return PATTERN_THEMES[Math.floor(Math.random() * 4)] // 前四种
  } else {
    return PATTERN_THEMES[Math.floor(Math.random() * PATTERN_THEMES.length)] // 所有主题
  }
}

// 选择变体
function selectVariant(_theme: PatternTheme, maxVariants: number): number {
  return Math.floor(Math.random() * maxVariants) + 1
}

// 选择动画类型
function selectAnimationType(animationComplexity: number): string {
  // 动画复杂度越高，可选的动画类型越多
  const availableAnimations = ANIMATION_TYPES.slice(0, animationComplexity)
  return availableAnimations[Math.floor(Math.random() * availableAnimations.length)]
}

// 计算图案位置（支持不同排列方式）
function calculatePosition(
  index: number,
  total: number,
  arrangement: 'simple' | 'grid' | 'cluster'
): { x: number; y: number } {
  switch (arrangement) {
    case 'simple':
      // 简单线性排列
      return { x: index * 80, y: 0 }

    case 'grid':
      // 网格排列（每行最多5个）
      const cols = Math.min(5, Math.ceil(Math.sqrt(total)))
      const row = Math.floor(index / cols)
      const col = index % cols
      return { x: col * 70, y: row * 70 }

    case 'cluster':
      // 簇状排列，更自然
      const angle = (index / total) * Math.PI * 2
      const radius = 50 + total * 2
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      }
  }
}

// 生成图案数组
export function generatePatterns(count: number, complexityLevel: number): Pattern[] {
  const complexity = PATTERN_COMPLEXITIES[complexityLevel as 1 | 2 | 3]
  const theme = selectThemeBasedOnDifficulty(complexityLevel)

  const patterns: Pattern[] = []

  for (let i = 0; i < count; i++) {
    const pattern: Pattern = {
      id: `pattern-${i}`,
      type: theme,
      variant: selectVariant(theme, complexity.characteristics.maxVariants),
      hasDetails: complexity.characteristics.hasDetails,
      animationType: selectAnimationType(complexity.characteristics.animationComplexity),
      position: calculatePosition(i, count, complexity.characteristics.arrangement),
    }
    patterns.push(pattern)
  }

  return patterns
}

// 生成选项数组
export function generateOptions(correctNumber: number, config: DifficultyConfig): number[] {
  const { minNumber, maxNumber } = config

  // 确保选项是3个连续数字，正确答案在其中
  const start = Math.max(minNumber, correctNumber - 1) // 确保不小于最小数字
  // 计算end但不使用，仅用于边界检查概念
  Math.min(maxNumber, correctNumber + 1) // 确保不大于最大数字

  // 如果靠近边界，调整起始位置
  let optionsStart = start
  if (correctNumber === minNumber) optionsStart = minNumber
  if (correctNumber === maxNumber) optionsStart = Math.max(minNumber, maxNumber - 2)

  return [optionsStart, optionsStart + 1, optionsStart + 2]
}