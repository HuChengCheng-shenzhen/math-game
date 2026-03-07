import { describe, it, expect } from 'vitest'
import { generateRandomNumber, generatePatterns, generateOptions } from './generator'
import type { DifficultyConfig } from './types'

describe('generateRandomNumber', () => {
  it('should generate number within range', () => {
    const min = 5
    const max = 20

    for (let i = 0; i < 100; i++) {
      const num = generateRandomNumber(min, max)
      expect(num).toBeGreaterThanOrEqual(min)
      expect(num).toBeLessThanOrEqual(max)
    }
  })

  it('should handle same min and max', () => {
    expect(generateRandomNumber(10, 10)).toBe(10)
  })
})

describe('generatePatterns', () => {
  it('should generate correct number of patterns', () => {
    const patterns = generatePatterns(7, 1)
    expect(patterns).toHaveLength(7)
  })

  it('should generate patterns with valid structure', () => {
    const patterns = generatePatterns(3, 2)

    patterns.forEach((pattern, index) => {
      expect(pattern.id).toBe(`pattern-${index}`)
      expect(pattern.type).toBeDefined()
      expect(pattern.variant).toBeGreaterThanOrEqual(1)
      expect(typeof pattern.animationType).toBe('string')
      expect(pattern.position).toHaveProperty('x')
      expect(pattern.position).toHaveProperty('y')
    })
  })

  it('should respect complexity level', () => {
    // 复杂度1：简单图案
    const patterns1 = generatePatterns(5, 1)
    patterns1.forEach(pattern => {
      expect(pattern.hasDetails).toBe(false)
    })

    // 复杂度2和3：应该有细节
    const patterns2 = generatePatterns(5, 2)
    patterns2.forEach(pattern => {
      expect(pattern.hasDetails).toBe(true)
    })

    const patterns3 = generatePatterns(5, 3)
    patterns3.forEach(pattern => {
      expect(pattern.hasDetails).toBe(true)
    })
  })
})

describe('generateOptions', () => {
  it('should generate 3 consecutive numbers', () => {
    const config: DifficultyConfig = {
      minNumber: 5,
      maxNumber: 20,
      patternComplexity: 1,
      hintDuration: 3000,
    }

    // 测试中间值
    const options1 = generateOptions(10, config)
    expect(options1).toEqual([9, 10, 11])
    expect(options1).toHaveLength(3)

    // 测试下边界
    const options2 = generateOptions(5, config)
    expect(options2).toEqual([5, 6, 7])

    // 测试上边界
    const options3 = generateOptions(20, config)
    expect(options3).toEqual([18, 19, 20])
  })

  it('should handle narrow ranges', () => {
    const config: DifficultyConfig = {
      minNumber: 5,
      maxNumber: 7, // 只有3个数字
      patternComplexity: 1,
      hintDuration: 3000,
    }

    // 当范围很窄时，选项应该调整
    const options = generateOptions(6, config)
    expect(options).toEqual([5, 6, 7])
  })
})