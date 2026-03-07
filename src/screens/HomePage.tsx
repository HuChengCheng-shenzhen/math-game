import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Button from '../components/UI/Button'
import Card from '../components/UI/Card'
import styles from './HomePage.module.css'

const HomePage: React.FC = () => {
  const navigate = useNavigate()

  const handleStartGame = () => {
    navigate('/game')
  }

  const handleOpenSettings = () => {
    navigate('/settings')
  }

  return (
    <div className={styles.homePage}>
      {/* 背景装饰 */}
      <div className={styles.backgroundDecorations}>
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className={styles.floatingShape}
            style={{
              left: `${(i * 10) % 100}%`,
              top: `${(i * 7) % 100}%`,
              background: i % 3 === 0 ? '#4CAF50' : i % 3 === 1 ? '#2196F3' : '#FF9800',
              width: `${20 + (i * 5) % 30}px`,
              height: `${20 + (i * 5) % 30}px`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      <div className={styles.container}>
        {/* 标题部分 */}
        <motion.div
          className={styles.heroSection}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.heroLogo}>
            <motion.div
              className={styles.logoEmoji}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              🧮
            </motion.div>
          </div>
          <h1 className={styles.title}>数感乐园</h1>
          <h2 className={styles.subtitle}>Math Fun Land</h2>
          <p className={styles.description}>
            专为3-6岁儿童设计的数学启蒙游戏
            <br />
            通过有趣的图案和互动，培养孩子的数感能力
          </p>
        </motion.div>

        {/* 游戏卡片 */}
        <div className={styles.cardsSection}>
          <Card elevation="high" className={styles.featureCard}>
            <div className={styles.cardIcon}>🎯</div>
            <h3 className={styles.cardTitle}>游戏目标</h3>
            <ul className={styles.cardList}>
              <li>认识数字5-20</li>
              <li>建立数量对应关系</li>
              <li>培养观察力和注意力</li>
              <li>在错误中学习成长</li>
            </ul>
          </Card>

          <Card elevation="high" className={styles.featureCard}>
            <div className={styles.cardIcon}>🌟</div>
            <h3 className={styles.cardTitle}>游戏特色</h3>
            <ul className={styles.cardList}>
              <li>可爱的冰淇淋、饼干图案</li>
              <li>智能难度调整系统</li>
              <li>友好的错误提示</li>
              <li>中英文双语支持</li>
            </ul>
          </Card>

          <Card elevation="high" className={styles.featureCard}>
            <div className={styles.cardIcon}>👶</div>
            <h3 className={styles.cardTitle}>适合年龄</h3>
            <ul className={styles.cardList}>
              <li>3-4岁：简单模式</li>
              <li>4-5岁：中等模式</li>
              <li>5-6岁：挑战模式</li>
              <li>所有年龄：快乐学习</li>
            </ul>
          </Card>
        </div>

        {/* 操作按钮 */}
        <div className={styles.actionsSection}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="primary"
              size="large"
              onClick={handleStartGame}
              fullWidth
              className={styles.startButton}
            >
              <span className={styles.buttonText}>开始游戏</span>
              <span className={styles.buttonEmoji}>🚀</span>
            </Button>
          </motion.div>

          <div className={styles.secondaryActions}>
            <Button
              variant="secondary"
              size="medium"
              onClick={handleOpenSettings}
            >
              ⚙️ 游戏设置
            </Button>
            <Button
              variant="secondary"
              size="medium"
              onClick={() => window.open('/help', '_blank')}
            >
              ❓ 游戏帮助
            </Button>
          </div>
        </div>

        {/* 小提示 */}
        <motion.div
          className={styles.tipSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className={styles.tipIcon}>💡</div>
          <p className={styles.tipText}>
            游戏会根据孩子的表现自动调整难度，确保学习过程既有挑战又充满乐趣！
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default HomePage