import React from 'react'
import { motion } from 'framer-motion'
import styles from './NumberDisplay.module.css'

interface NumberDisplayProps {
  number: number
  isCorrect?: boolean | null
  showHint?: boolean
}

const NumberDisplay: React.FC<NumberDisplayProps> = ({
  number,
  isCorrect = null,
  showHint = false,
}) => {
  // 根据答案正确性确定动画和样式
  const getAnimationProps = () => {
    if (isCorrect === true) {
      return {
        animate: {
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0],
        },
        transition: {
          duration: 0.5,
          times: [0, 0.3, 0.7, 1],
        },
      }
    } else if (isCorrect === false) {
      return {
        animate: {
          x: [0, -10, 10, -10, 10, 0],
        },
        transition: {
          duration: 0.4,
          times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        },
      }
    }
    return {}
  }

  const containerClasses = [
    styles.numberContainer,
    isCorrect === true ? styles.correct : '',
    isCorrect === false ? styles.incorrect : '',
    showHint ? styles.showHint : '',
  ].join(' ')

  return (
    <div className={containerClasses}>
      <motion.div
        className={styles.numberDisplay}
        {...getAnimationProps()}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className={styles.number}>{number}</span>
        <div className={styles.numberLabel}>数字</div>
      </motion.div>

      {showHint && (
        <motion.div
          className={styles.hintBubble}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <span className={styles.hintIcon}>💡</span>
          <span className={styles.hintText}>数一数有几个？</span>
        </motion.div>
      )}
    </div>
  )
}

export default NumberDisplay