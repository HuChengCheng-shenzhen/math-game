// 通用工具函数

// 生成范围内的随机整数
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 生成随机浮点数
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

// 从数组中随机选择一个元素
export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

// 打乱数组（Fisher-Yates洗牌算法）
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// 限制数字在范围内
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

// 线性插值
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

// 映射值从一个范围到另一个范围
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

// 格式化时间（秒转换为MM:SS）
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 格式化数字（添加千位分隔符）
export function formatNumber(num: number): string {
  return num.toLocaleString()
}

// 计算百分比
export function calculatePercentage(part: number, total: number): number {
  return total === 0 ? 0 : Math.round((part / total) * 100)
}

// 防抖函数
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// 节流函数
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// 深拷贝简单对象（不处理函数、循环引用等）
export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

// 检查是否在移动设备上
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

// 检查是否支持触摸
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// 生成唯一ID
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// 异步延迟
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// 安全解析JSON
export function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString) as T
  } catch {
    return fallback
  }
}

// 检查对象是否为空
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEmptyObject(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0
}

// 合并多个类名
export function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}