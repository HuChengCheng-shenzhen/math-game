import React from 'react'
import { motion } from 'framer-motion'
import Button from '../UI/Button'
import styles from './OptionButtons.module.css'

interface OptionButtonsProps {
  options: number[]
  correctAnswer: number
  selectedAnswer: number | null
  isCorrect: boolean | null
  hintLevel: number
  onSelect: (option: number) => void
  disabled?: boolean
}

const OptionButtons: React.FC<OptionButtonsProps> = ({
  options,
  correctAnswer,
  selectedAnswer,
  isCorrect,
  hintLevel,
  onSelect,
  disabled = false,
}) => {
  // 获取按钮变体
  const getButtonVariant = (option: number) => {
    if (selectedAnswer === null) return 'primary'

    if (option === selectedAnswer) {
      return isCorrect ? 'success' : 'warning' // 选择的答案：正确则成功，错误则警告
    }

    return 'secondary'
  }

  // 获取按钮禁用状态
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isButtonDisabled = (_option: number) => {
    if (disabled) return true
    return selectedAnswer !== null // 一旦选择，所有按钮禁用
  }

  // 获取动画延迟
  const getAnimationDelay = (index: number) => {
    return index * 0.1
  }

  // 获取渐进式提示信息
  const getHintMessage = () => {
    if (hintLevel === 0) {
      return ''
    } else if (hintLevel === 1) {
      return '再试一次！'
    } else if (hintLevel === 2) {
      return '数一数图案的数量'
    } else if (hintLevel === 3) {
      // 找出正确答案所在的范围
      const sortedOptions = [...options].sort((a, b) => a - b)
      const minOption = sortedOptions[0]
      const maxOption = sortedOptions[sortedOptions.length - 1]
      if (correctAnswer === minOption) {
        return `正确答案是最小的数字`
      } else if (correctAnswer === maxOption) {
        return `正确答案是最大的数字`
      } else {
        return `正确答案在${minOption}和${maxOption}之间`
      }
    }
    return ''
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
              <div className={styles.hintMessage}>{getHintMessage()}</div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default OptionButtons