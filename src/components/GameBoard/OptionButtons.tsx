import React from 'react'
import { motion } from 'framer-motion'
import Button from '../UI/Button'
import styles from './OptionButtons.module.css'

interface OptionButtonsProps {
  options: number[]
  correctAnswer: number
  selectedAnswer: number | null
  isCorrect: boolean | null
  onSelect: (option: number) => void
  disabled?: boolean
}

const OptionButtons: React.FC<OptionButtonsProps> = ({
  options,
  correctAnswer,
  selectedAnswer,
  isCorrect,
  onSelect,
  disabled = false,
}) => {
  // 获取按钮变体
  const getButtonVariant = (option: number) => {
    if (selectedAnswer === null) return 'primary'

    if (option === correctAnswer) {
      return 'success' // 正确答案总是显示成功
    } else if (option === selectedAnswer) {
      return 'warning' // 选择的错误答案显示警告
    }

    return 'secondary'
  }

  // 获取按钮禁用状态
  const isButtonDisabled = (_option: number) => {
    if (disabled) return true
    return selectedAnswer !== null // 一旦选择，所有按钮禁用
  }

  // 获取动画延迟
  const getAnimationDelay = (index: number) => {
    return index * 0.1
  }

  return (
    <div className={styles.optionsContainer}>
      <div className={styles.optionsLabel}>选择正确的数字：</div>
      <div className={styles.optionsGrid}>
        {options.map((option, index) => (
          <motion.div
            key={option}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: getAnimationDelay(index),
              duration: 0.3,
              type: 'spring',
              stiffness: 200,
            }}
            whileHover={!isButtonDisabled(option) ? { scale: 1.05 } : {}}
            className={styles.optionWrapper}
          >
            <Button
              variant={getButtonVariant(option)}
              size="large"
              onClick={() => !isButtonDisabled(option) && onSelect(option)}
              disabled={isButtonDisabled(option)}
              fullWidth
            >
              <div className={styles.optionContent}>
                <span className={styles.optionNumber}>{option}</span>
                {option === correctAnswer && selectedAnswer !== null && (
                  <motion.span
                    className={styles.correctIndicator}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                  >
                    ✓
                  </motion.span>
                )}
                {option === selectedAnswer && option !== correctAnswer && (
                  <motion.span
                    className={styles.incorrectIndicator}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                  >
                    ✗
                  </motion.span>
                )}
              </div>
            </Button>

            {/* 数字顺序提示（仅在选择前显示） */}
            {selectedAnswer === null && (
              <div className={styles.optionHint}>{index + 1}</div>
            )}
          </motion.div>
        ))}
      </div>

      {/* 反馈信息 */}
      {selectedAnswer !== null && (
        <motion.div
          className={styles.feedback}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {isCorrect ? (
            <div className={styles.correctFeedback}>
              <span className={styles.feedbackEmoji}>🎉</span>
              太棒了！答对了！
            </div>
          ) : (
            <div className={styles.incorrectFeedback}>
              <span className={styles.feedbackEmoji}>💡</span>
              正确答案是：<span className={styles.correctNumber}>{correctAnswer}</span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default OptionButtons