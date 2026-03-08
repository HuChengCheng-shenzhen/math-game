import React from 'react'
import { motion } from 'framer-motion'
import type { Pattern } from '../../game/types'
import styles from './PatternGrid.module.css'

interface AnimationVariant {
  animate: Record<string, unknown>
  transition: Record<string, unknown>
}

interface PatternGridProps {
  patterns: Pattern[]
  selectedCount?: number | null
  showCount?: boolean
  onPatternClick?: (index: number) => void
}

const PatternGrid: React.FC<PatternGridProps> = ({
  patterns,
  selectedCount = null,
  showCount = false,
  onPatternClick,
}) => {
  // 获取图案的SVG或图片（暂时使用emoji代替）
  const getPatternContent = (pattern: Pattern) => {
    const emojis: Record<string, string> = {
      icecream: '🍦',
      cookie: '🍪',
      star: '⭐',
      balloon: '🎈',
      animal: '🐱',
    }

    const baseEmoji = emojis[pattern.type] || '✨'
    return baseEmoji
  }

  // 获取动画变体
  const getAnimationVariant = (animationType: string) => {
    const variants: Record<string, AnimationVariant> = {
      bounce: {
        animate: {
          y: [0, -8, 0], // 减小幅度，防止重叠
        },
        transition: {
          duration: 0.8,
          repeat: Infinity,
          repeatType: 'reverse' as const,
        },
      },
      float: {
        animate: {
          y: [0, -6, 0], // 减小幅度
          rotate: [0, 3, -3, 0], // 减小旋转
        },
        transition: {
          duration: 2.5,
          repeat: Infinity,
          repeatType: 'reverse' as const,
        },
      },
      spin: {
        animate: {
          rotate: 360,
        },
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        },
      },
      pulse: {
        animate: {
          scale: [1, 1.05, 1], // 减小缩放，防止重叠
        },
        transition: {
          duration: 1.2,
          repeat: Infinity,
          repeatType: 'reverse' as const,
        },
      },
      wave: {
        animate: {
          y: [0, -4, 0], // 减小幅度
          rotate: [0, 6, -6, 0], // 减小旋转
        },
        transition: {
          duration: 1.8,
          repeat: Infinity,
          repeatType: 'reverse' as const,
        },
      },
    }

    return variants[animationType] || variants.bounce
  }

  return (
    <div className={styles.patternGrid}>
      <div className={styles.patternContainer}>
        {patterns.map((pattern, index) => {
          const isSelected = selectedCount !== null && index < selectedCount
          const isHighlighted = showCount && index < patterns.length

          const patternClasses = [
            styles.pattern,
            isSelected ? styles.patternSelected : '',
            isHighlighted ? styles.patternHighlighted : '',
            pattern.hasDetails ? styles.patternWithDetails : '',
          ].join(' ')

          const animationProps = getAnimationVariant(pattern.animationType)

          return (
            <motion.div
              key={pattern.id}
              className={patternClasses}
              style={{
                transform: `translate(${pattern.position.x}px, ${pattern.position.y}px)`,
              }}
              onClick={() => onPatternClick?.(index)}
              {...animationProps}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: index * 0.05,
                duration: 0.3,
                type: 'spring',
                stiffness: 200,
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className={styles.patternContent}>
                <span className={styles.patternEmoji}>{getPatternContent(pattern)}</span>
                {pattern.hasDetails && (
                  <div className={styles.patternDetails}>
                    <span className={styles.detailDot}></span>
                    <span className={styles.detailDot}></span>
                    <span className={styles.detailDot}></span>
                  </div>
                )}
              </div>
              {showCount && (
                <div className={styles.countBadge}>{index + 1}</div>
              )}
            </motion.div>
          )
        })}
      </div>

      {showCount && (
        <div className={styles.countOverlay}>
          <div className={styles.countText}>
            数一数：<span className={styles.countNumber}>{patterns.length}</span> 个
          </div>
        </div>
      )}
    </div>
  )
}

export default PatternGrid