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
    case 'simple': {
      // 简单线性排列，整体水平居中，增加间距确保图案分开
      const totalWidth = (total - 1) * 120  // 增加间距从100px到120px
      const startX = -totalWidth / 2
      return { x: startX + index * 120, y: 0 }
    }

    case 'grid': {
      // 网格排列（每行最多5个），整体居中，增加间距确保图案分开
      const cols = Math.min(5, Math.ceil(Math.sqrt(total)))
      const rows = Math.ceil(total / cols)
      const gridWidth = (cols - 1) * 100  // 增加间距从90px到100px
      const gridHeight = (rows - 1) * 100  // 增加间距从90px到100px
      const gridStartX = -gridWidth / 2
      const gridStartY = -gridHeight / 2
      const row = Math.floor(index / cols)
      const col = index % cols
      return { x: gridStartX + col * 100, y: gridStartY + row * 100 }  // 增加间距从90px到100px
    }

    case 'cluster': {
      // 簇状排列，更自然（已经围绕原点），增加半径确保图案分开
      const angle = (index / total) * Math.PI * 2
      const radius = 100 + total * 4  // 增加半径提供更多空间
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      }
    }
  }
}

// 生成图案数组
export function generatePatterns(count: number, complexityLevel: number): Pattern[] {
  const complexity = PATTERN_COMPLEXITIES[complexityLevel as 1 | 2 | 3]

  const patterns: Pattern[] = []

  for (let i = 0; i < count; i++) {
    // 为每个图案随机选择主题，增加图案多样性
    const theme = selectThemeBasedOnDifficulty(complexityLevel)

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
  let optionsStart = Math.max(minNumber, correctNumber - 1) // 确保不小于最小数字

  // 确保选项不超过最大数字
  if (optionsStart + 2 > maxNumber) {
    optionsStart = Math.max(minNumber, maxNumber - 2)
  }

  // 如果正确答案在最小边界，确保选项从最小数字开始
  if (correctNumber === minNumber) {
    optionsStart = minNumber
  }

  return [optionsStart, optionsStart + 1, optionsStart + 2]
}