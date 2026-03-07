import React from 'react'
import { motion } from 'framer-motion'
import styles from './Header.module.css'

interface HeaderProps {
  score: number
  level: number
  difficulty: string
  onSettingsClick?: () => void
  onHelpClick?: () => void
}

const Header: React.FC<HeaderProps> = ({
  score,
  level,
  difficulty,
  onSettingsClick,
  onHelpClick,
}) => {
  // 难度颜色映射
  const difficultyColors: Record<string, string> = {
    easy: '#4CAF50',
    medium: '#FF9800',
    hard: '#F44336',
  }

  // 难度文本映射
  const difficultyText: Record<string, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难',
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {/* Logo和标题 */}
        <div className={styles.logoSection}>
          <motion.div
            className={styles.logo}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
          >
            🧮
          </motion.div>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>数感乐园</h1>
            <p className={styles.subtitle}>Math Fun Land</p>
          </div>
        </div>

        {/* 游戏信息 */}
        <div className={styles.gameInfo}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>分数</span>
            <motion.span
              className={styles.infoValue}
              key={score}
              initial={{ scale: 1.2, color: '#FF9800' }}
              animate={{ scale: 1, color: '#333' }}
              transition={{ duration: 0.3 }}
            >
              {score}
            </motion.span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>关卡</span>
            <span className={styles.infoValue}>{level}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>难度</span>
            <motion.span
              className={styles.infoValue}
              style={{ color: difficultyColors[difficulty] }}
              animate={{
                boxShadow: [
                  `0 0 0 0 ${difficultyColors[difficulty]}40`,
                  `0 0 0 6px ${difficultyColors[difficulty]}40`,
                  `0 0 0 0 ${difficultyColors[difficulty]}40`,
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {difficultyText[difficulty]}
            </motion.span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className={styles.actionButtons}>
          <button
            className={styles.iconButton}
            onClick={onHelpClick}
            aria-label="帮助"
          >
            <span className={styles.icon}>❓</span>
            <span className={styles.iconLabel}>帮助</span>
          </button>
          <button
            className={styles.iconButton}
            onClick={onSettingsClick}
            aria-label="设置"
          >
            <span className={styles.icon}>⚙️</span>
            <span className={styles.iconLabel}>设置</span>
          </button>
        </div>
      </div>

      {/* 进度条 */}
      <div className={styles.progressBar}>
        <motion.div
          className={styles.progressFill}
          style={{
            width: `${((level - 1) % 10) * 10}%`,
            background: difficultyColors[difficulty],
          }}
          initial={{ width: 0 }}
          animate={{ width: `${((level - 1) % 10) * 10}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </header>
  )
}

export default Header