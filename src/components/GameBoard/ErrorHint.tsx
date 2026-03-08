import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './ErrorHint.module.css'

interface ErrorHintProps {
  show: boolean
  onHide: () => void
  autoHideDuration?: number
  language?: 'zh-CN' | 'en-US'
}

const ErrorHint: React.FC<ErrorHintProps> = ({
  show,
  onHide,
  autoHideDuration = 3000,
  language = 'zh-CN',
}) => {
  // 自动隐藏提示
  useEffect(() => {
    if (!show) return

    const timer = setTimeout(() => {
      onHide()
    }, autoHideDuration)

    return () => clearTimeout(timer)
  }, [show, autoHideDuration, onHide])

  // 提示文本
  const hintText = {
    'zh-CN': {
      main: '再数一数！',
      tip: '仔细看看图案的数量',
      genericHint: '数一数图案的数量，然后选择对应的数字',
    },
    'en-US': {
      main: 'Count again!',
      tip: 'Look carefully at the patterns',
      genericHint: 'Count the patterns and choose the matching number',
    },
  }[language]

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={styles.errorHint}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          {/* 提示图标 */}
          <div className={styles.hintIconContainer}>
            <motion.div
              className={styles.hintIcon}
              animate={{
                rotate: [0, 10, -10, 0],
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              💡
            </motion.div>
            <div className={styles.hintGlow}></div>
          </div>

          {/* 提示内容 */}
          <div className={styles.hintContent}>
            <div className={styles.hintHeader}>
              <span className={styles.hintMainText}>{hintText.main}</span>
            </div>

            <div className={styles.hintBody}>
              <span className={styles.hintCountText}>
                {hintText.genericHint}
              </span>
            </div>

            <div className={styles.hintFooter}>
              <span className={styles.hintTip}>{hintText.tip}</span>
              <motion.div
                className={styles.countingAnimation}
                animate={{
                  width: ['0%', '100%'],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                <div className={styles.countingDot}></div>
                <div className={styles.countingDot}></div>
                <div className={styles.countingDot}></div>
              </motion.div>
            </div>
          </div>

          {/* 关闭按钮 */}
          <button className={styles.closeButton} onClick={onHide} aria-label="Close hint">
            ×
          </button>

          {/* 箭头指示器（指向数字） */}
          <motion.div
            className={styles.arrowIndicator}
            animate={{
              x: [0, 10, 0],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <div className={styles.arrowBody}></div>
            <div className={styles.arrowHead}></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ErrorHint