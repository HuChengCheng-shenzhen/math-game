import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './FeedbackOverlay.module.css'

interface FeedbackOverlayProps {
  show: boolean
  type: 'success' | 'error'
  message?: string
  onClose?: () => void
  autoHide?: boolean
  duration?: number
}

const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({
  show,
  type,
  message,
  onClose,
  autoHide = true,
  duration = 2000,
}) => {
  // 自动隐藏
  React.useEffect(() => {
    if (!show || !autoHide || !onClose) return

    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [show, autoHide, duration, onClose])

  // 默认消息
  const defaultMessages = {
    success: {
      emoji: '🎉',
      title: '太棒了！',
      subtitle: '答对了！继续加油！',
    },
    error: {
      emoji: '💡',
      title: '再试一次！',
      subtitle: '你已经很棒了！',
    },
  }[type]

  const displayMessage = message || defaultMessages.subtitle

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`${styles.feedbackOverlay} ${styles[`feedback--${type}`]}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          {/* 背景效果 */}
          <div className={styles.backgroundEffects}>
            <div className={styles.confetti}></div>
            <div className={styles.confetti}></div>
            <div className={styles.confetti}></div>
            <div className={styles.confetti}></div>
            <div className={styles.confetti}></div>
          </div>

          {/* 主要内容 */}
          <div className={styles.feedbackContent}>
            <motion.div
              className={styles.emoji}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              {defaultMessages.emoji}
            </motion.div>

            <div className={styles.textContent}>
              <h3 className={styles.title}>{defaultMessages.title}</h3>
              <p className={styles.subtitle}>{displayMessage}</p>
            </div>

            {/* 进度条（用于自动隐藏） */}
            {autoHide && (
              <motion.div
                className={styles.progressBar}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
              />
            )}

            {/* 关闭按钮（如果提供了onClose） */}
            {onClose && !autoHide && (
              <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close feedback"
              >
                继续
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default FeedbackOverlay