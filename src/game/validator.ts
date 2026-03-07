import type { Pattern } from './types'

// 验证答案
export function validateAnswer(selected: number, correct: number): boolean {
  return selected === correct
}

// 获取错误提示信息
export function getHintMessage(
  _selectedNumber: number,
  correctNumber: number,
  language: 'zh-CN' | 'en-US' = 'zh-CN'
): string {
  if (language === 'zh-CN') {
    return `再数一数！总共有 <span class="highlight">${correctNumber}</span> 个哦！`
  } else {
    return `Count again! There are <span class="highlight">${correctNumber}</span> in total!`
  }
}

// 计算选择答案与正确答案的差距
export function getAnswerDifference(selected: number, correct: number): number {
  return Math.abs(selected - correct)
}

// 获取难度调整建议
export function getDifficultySuggestion(
  consecutiveCorrect: number,
  consecutiveWrong: number
): 'increase' | 'decrease' | 'maintain' {
  if (consecutiveWrong >= 2) {
    return 'decrease'
  } else if (consecutiveCorrect >= 3) {
    return 'increase'
  } else {
    return 'maintain'
  }
}

// 高亮正确数量的图案（模拟函数）
export function highlightCorrectPatterns(_patterns: Pattern[], count: number): void {
  // 在实际实现中，这里会返回需要高亮的图案ID
  // 现在只是一个模拟函数
  console.log(`Highlighting first ${count} patterns`)
}

// 显示计数动画（模拟函数）
export function showCountAnimation(count: number): void {
  // 在实际实现中，这里会触发计数动画
  console.log(`Showing count animation for ${count}`)
}