// 本地存储工具函数

const STORAGE_PREFIX = 'math-game-'

// 获取存储键名
function getStorageKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`
}

// 保存数据到localStorage
export function saveToStorage<T>(key: string, data: T): void {
  try {
    const storageKey = getStorageKey(key)
    const serializedData = JSON.stringify(data)
    localStorage.setItem(storageKey, serializedData)
  } catch (error) {
    console.warn('Failed to save to localStorage:', error)
  }
}

// 从localStorage加载数据
export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const storageKey = getStorageKey(key)
    const serializedData = localStorage.getItem(storageKey)
    if (serializedData === null) {
      return fallback
    }
    return JSON.parse(serializedData) as T
  } catch (error) {
    console.warn('Failed to load from localStorage:', error)
    return fallback
  }
}

// 从localStorage移除数据
export function removeFromStorage(key: string): void {
  try {
    const storageKey = getStorageKey(key)
    localStorage.removeItem(storageKey)
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error)
  }
}

// 清除所有游戏相关存储
export function clearGameStorage(): void {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => localStorage.removeItem(key))
  } catch (error) {
    console.warn('Failed to clear game storage:', error)
  }
}

// 存储键名常量
export const STORAGE_KEYS = {
  SETTINGS: 'settings',
  GAME_STATE: 'game-state',
  HIGH_SCORES: 'high-scores',
  USER_PROGRESS: 'user-progress',
  LANGUAGE: 'language',
  SOUND_SETTINGS: 'sound-settings',
} as const

// 游戏设置存储
export interface GameSettings {
  language: 'zh-CN' | 'en-US'
  soundEnabled: boolean
  musicEnabled: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  autoAdvance: boolean
  hintDuration: number
  animationSpeed: 'slow' | 'normal' | 'fast'
}

// 默认设置
export const DEFAULT_SETTINGS: GameSettings = {
  language: 'zh-CN',
  soundEnabled: true,
  musicEnabled: true,
  difficulty: 'medium',
  autoAdvance: true,
  hintDuration: 3000,
  animationSpeed: 'normal',
}

// 保存游戏设置
export function saveGameSettings(settings: GameSettings): void {
  saveToStorage(STORAGE_KEYS.SETTINGS, settings)
}

// 加载游戏设置
export function loadGameSettings(): GameSettings {
  return loadFromStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
}

// 游戏状态存储
export interface StoredGameState {
  score: number
  level: number
  difficulty: 'easy' | 'medium' | 'hard'
  consecutiveCorrect: number
  consecutiveWrong: number
  lastPlayed: string
}

// 保存游戏状态
export function saveGameState(state: StoredGameState): void {
  const stateWithTimestamp = {
    ...state,
    lastPlayed: new Date().toISOString(),
  }
  saveToStorage(STORAGE_KEYS.GAME_STATE, stateWithTimestamp)
}

// 加载游戏状态
export function loadGameState(): StoredGameState | null {
  return loadFromStorage<StoredGameState | null>(STORAGE_KEYS.GAME_STATE, null)
}

// 高分记录
export interface HighScore {
  score: number
  level: number
  difficulty: 'easy' | 'medium' | 'hard'
  date: string
  playerName?: string
}

// 保存高分
export function saveHighScore(highScore: HighScore): void {
  const highScores = loadHighScores()
  highScores.push({
    ...highScore,
    date: new Date().toISOString(),
  })
  // 按分数降序排序，只保留前10名
  highScores.sort((a, b) => b.score - a.score)
  const top10 = highScores.slice(0, 10)
  saveToStorage(STORAGE_KEYS.HIGH_SCORES, top10)
}

// 加载高分记录
export function loadHighScores(): HighScore[] {
  return loadFromStorage<HighScore[]>(STORAGE_KEYS.HIGH_SCORES, [])
}

// 用户进度
export interface UserProgress {
  totalGamesPlayed: number
  totalCorrectAnswers: number
  totalWrongAnswers: number
  bestScore: number
  bestLevel: number
  playTime: number // 秒
  achievements: string[]
}

// 默认用户进度
export const DEFAULT_USER_PROGRESS: UserProgress = {
  totalGamesPlayed: 0,
  totalCorrectAnswers: 0,
  totalWrongAnswers: 0,
  bestScore: 0,
  bestLevel: 1,
  playTime: 0,
  achievements: [],
}

// 更新用户进度
export function updateUserProgress(updates: Partial<UserProgress>): void {
  const currentProgress = loadUserProgress()
  const updatedProgress = { ...currentProgress, ...updates }
  saveToStorage(STORAGE_KEYS.USER_PROGRESS, updatedProgress)
}

// 加载用户进度
export function loadUserProgress(): UserProgress {
  return loadFromStorage(STORAGE_KEYS.USER_PROGRESS, DEFAULT_USER_PROGRESS)
}

// 保存语言设置
export function saveLanguage(language: 'zh-CN' | 'en-US'): void {
  saveToStorage(STORAGE_KEYS.LANGUAGE, language)
}

// 加载语言设置
export function loadLanguage(): 'zh-CN' | 'en-US' {
  return loadFromStorage(STORAGE_KEYS.LANGUAGE, 'zh-CN')
}

// 检查localStorage是否可用
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__test__'
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

// 获取存储使用情况（近似值）
export function getStorageUsage(): number {
  try {
    let total = 0
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length * 2 // UTF-16字符占2字节
      }
    }
    return total // 字节数
  } catch {
    return 0
  }
}