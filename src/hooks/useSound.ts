import { useEffect, useRef, useState } from 'react'

// 音效类型
export type SoundType =
  | 'correct'
  | 'incorrect'
  | 'click'
  | 'level_up'
  | 'hint'
  | 'celebration'
  | 'background'

// 音效配置
interface SoundConfig {
  volume: number
  enabled: boolean
}

// 默认音效URL（使用公共领域音效或自行添加）
const SOUND_URLS: Record<SoundType, string> = {
  correct: '/sounds/correct.mp3',
  incorrect: '/sounds/incorrect.mp3',
  click: '/sounds/click.mp3',
  level_up: '/sounds/level_up.mp3',
  hint: '/sounds/hint.mp3',
  celebration: '/sounds/celebration.mp3',
  background: '/sounds/background.mp3',
}

// 默认配置
const DEFAULT_CONFIG: SoundConfig = {
  volume: 0.7,
  enabled: true,
}

export const useSound = (initialConfig: Partial<SoundConfig> = {}) => {
  const [config, setConfig] = useState<SoundConfig>({
    ...DEFAULT_CONFIG,
    ...initialConfig,
  })
  const audioRefs = useRef<Map<SoundType, HTMLAudioElement>>(new Map())

  // 初始化音频元素
  useEffect(() => {
    if (typeof window === 'undefined') return

    const currentAudioRefs = audioRefs.current
    Object.entries(SOUND_URLS).forEach(([type, url]) => {
      const audio = new Audio(url)
      audio.volume = config.volume
      currentAudioRefs.set(type as SoundType, audio)
    })

    return () => {
      currentAudioRefs.forEach((audio) => {
        audio.pause()
        audio.src = ''
      })
      currentAudioRefs.clear()
    }
  }, [config.volume])

  // 播放音效
  const play = useCallback((type: SoundType) => {
    if (!config.enabled) return

    const audio = audioRefs.current.get(type)
    if (audio) {
      audio.currentTime = 0
      audio.play().catch((error) => {
        console.warn(`Failed to play sound ${type}:`, error)
      })
    }
  }, [config.enabled])

  // 停止音效
  const stop = useCallback((type: SoundType) => {
    const audio = audioRefs.current.get(type)
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  // 停止所有音效
  const stopAll = useCallback(() => {
    audioRefs.current.forEach((audio) => {
      audio.pause()
      audio.currentTime = 0
    })
  }, [])

  // 更新配置
  const updateConfig = useCallback((newConfig: Partial<SoundConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }))

    // 更新所有音频元素的音量
    if (newConfig.volume !== undefined) {
      audioRefs.current.forEach((audio) => {
        audio.volume = newConfig.volume!
      })
    }
  }, [])

  return {
    play,
    stop,
    stopAll,
    config,
    updateConfig,
  }
}

// 简化版本：如果不需要完整功能，可以使用这个简化hook
export const useSimpleSound = () => {
  const [enabled, setEnabled] = useState(true)

  const play = useCallback((type: SoundType) => {
    if (!enabled || typeof window === 'undefined') return

    // 使用Web Audio API创建简单音效
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    // 根据类型设置频率
    let frequency = 440
    switch (type) {
      case 'correct':
        frequency = 523.25 // C5
        break
      case 'incorrect':
        frequency = 392.00 // G4
        break
      case 'click':
        frequency = 659.25 // E5
        break
      default:
        frequency = 440.00 // A4
    }

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
    oscillator.type = 'sine'
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.5)

    // 清理
    setTimeout(() => {
      oscillator.disconnect()
      gainNode.disconnect()
    }, 600)
  }, [enabled])

  return {
    play,
    enabled,
    setEnabled,
  }
}

import { useCallback } from 'react'