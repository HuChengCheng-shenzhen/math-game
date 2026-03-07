import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/UI/Button'
import Card from '../components/UI/Card'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import styles from './SettingsPage.module.css'

const SettingsPage: React.FC = () => {
  const navigate = useNavigate()

  // 设置状态
  const [language, setLanguage] = useState<'zh-CN' | 'en-US'>('zh-CN')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [autoAdvance, setAutoAdvance] = useState(true)
  const [hintDuration, setHintDuration] = useState(3000)
  const [animationSpeed, setAnimationSpeed] = useState<'normal' | 'fast' | 'slow'>('normal')

  const handleSave = () => {
    // 保存设置到本地存储
    const settings = {
      language,
      soundEnabled,
      musicEnabled,
      difficulty,
      autoAdvance,
      hintDuration,
      animationSpeed,
    }
    localStorage.setItem('math-game-settings', JSON.stringify(settings))
    alert('设置已保存！')
  }

  const handleReset = () => {
    setLanguage('zh-CN')
    setSoundEnabled(true)
    setMusicEnabled(true)
    setDifficulty('medium')
    setAutoAdvance(true)
    setHintDuration(3000)
    setAnimationSpeed('normal')
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleGoHome = () => {
    navigate('/')
  }

  // 示例数据用于Header
  const sampleGameState = {
    score: 0,
    level: 1,
    difficulty: 'medium' as const,
  }

  return (
    <div className={styles.settingsPage}>
      <Header
        score={sampleGameState.score}
        level={sampleGameState.level}
        difficulty={sampleGameState.difficulty}
        onSettingsClick={() => {}}
        onHelpClick={() => navigate('/help')}
      />

      <main className={styles.settingsContent}>
        <motion.div
          className={styles.settingsHeader}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>游戏设置</h1>
          <p className={styles.subtitle}>个性化你的游戏体验</p>
        </motion.div>

        <div className={styles.settingsGrid}>
          {/* 语言设置 */}
          <Card className={styles.settingCard}>
            <div className={styles.settingHeader}>
              <div className={styles.settingIcon}>🌐</div>
              <h3 className={styles.settingTitle}>语言设置</h3>
            </div>
            <div className={styles.settingOptions}>
              <button
                className={`${styles.languageOption} ${language === 'zh-CN' ? styles.active : ''}`}
                onClick={() => setLanguage('zh-CN')}
              >
                <span className={styles.flag}>🇨🇳</span>
                <span className={styles.languageName}>中文</span>
              </button>
              <button
                className={`${styles.languageOption} ${language === 'en-US' ? styles.active : ''}`}
                onClick={() => setLanguage('en-US')}
              >
                <span className={styles.flag}>🇺🇸</span>
                <span className={styles.languageName}>English</span>
              </button>
            </div>
          </Card>

          {/* 声音设置 */}
          <Card className={styles.settingCard}>
            <div className={styles.settingHeader}>
              <div className={styles.settingIcon}>🔊</div>
              <h3 className={styles.settingTitle}>声音设置</h3>
            </div>
            <div className={styles.switchGroup}>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                />
                <span className={styles.slider}></span>
                <span className={styles.switchLabel}>游戏音效</span>
              </label>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={musicEnabled}
                  onChange={(e) => setMusicEnabled(e.target.checked)}
                />
                <span className={styles.slider}></span>
                <span className={styles.switchLabel}>背景音乐</span>
              </label>
            </div>
          </Card>

          {/* 难度设置 */}
          <Card className={styles.settingCard}>
            <div className={styles.settingHeader}>
              <div className={styles.settingIcon}>🎯</div>
              <h3 className={styles.settingTitle}>游戏难度</h3>
            </div>
            <div className={styles.difficultyOptions}>
              {(['easy', 'medium', 'hard'] as const).map((level) => (
                <button
                  key={level}
                  className={`${styles.difficultyOption} ${difficulty === level ? styles.active : ''}`}
                  onClick={() => setDifficulty(level)}
                >
                  <div className={styles.difficultyIcon}>
                    {level === 'easy' && '😊'}
                    {level === 'medium' && '😃'}
                    {level === 'hard' && '😎'}
                  </div>
                  <div className={styles.difficultyInfo}>
                    <span className={styles.difficultyName}>
                      {level === 'easy' && '简单'}
                      {level === 'medium' && '中等'}
                      {level === 'hard' && '困难'}
                    </span>
                    <span className={styles.difficultyDesc}>
                      {level === 'easy' && '数字5-10，简单图案'}
                      {level === 'medium' && '数字5-15，中等图案'}
                      {level === 'hard' && '数字5-20，复杂图案'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* 游戏设置 */}
          <Card className={styles.settingCard}>
            <div className={styles.settingHeader}>
              <div className={styles.settingIcon}>⚙️</div>
              <h3 className={styles.settingTitle}>游戏选项</h3>
            </div>
            <div className={styles.gameOptions}>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={autoAdvance}
                  onChange={(e) => setAutoAdvance(e.target.checked)}
                />
                <span className={styles.slider}></span>
                <span className={styles.switchLabel}>答对后自动进入下一关</span>
              </label>

              <div className={styles.sliderGroup}>
                <label className={styles.sliderLabel}>
                  提示显示时间: <span className={styles.sliderValue}>{hintDuration / 1000}秒</span>
                </label>
                <input
                  type="range"
                  min="1000"
                  max="5000"
                  step="1000"
                  value={hintDuration}
                  onChange={(e) => setHintDuration(Number(e.target.value))}
                  className={styles.rangeSlider}
                />
                <div className={styles.sliderMarks}>
                  <span>1秒</span>
                  <span>3秒</span>
                  <span>5秒</span>
                </div>
              </div>

              <div className={styles.animationSpeed}>
                <span className={styles.speedLabel}>动画速度:</span>
                <div className={styles.speedOptions}>
                  {(['slow', 'normal', 'fast'] as const).map((speed) => (
                    <button
                      key={speed}
                      className={`${styles.speedOption} ${animationSpeed === speed ? styles.active : ''}`}
                      onClick={() => setAnimationSpeed(speed)}
                    >
                      {speed === 'slow' && '🐢 慢'}
                      {speed === 'normal' && '🚶 正常'}
                      {speed === 'fast' && '🚀 快'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* 关于 */}
          <Card className={styles.settingCard}>
            <div className={styles.settingHeader}>
              <div className={styles.settingIcon}>ℹ️</div>
              <h3 className={styles.settingTitle}>关于游戏</h3>
            </div>
            <div className={styles.aboutContent}>
              <p className={styles.aboutText}>
                <strong>数感乐园</strong> 是一款专为3-6岁儿童设计的数学启蒙游戏。
                通过有趣的图案和互动，帮助孩子建立数字与数量的对应关系，培养数感能力。
              </p>
              <div className={styles.versionInfo}>
                <span>版本: 1.0.0</span>
                <span>开发者: 儿童教育团队</span>
              </div>
            </div>
          </Card>

          {/* 数据管理 */}
          <Card className={styles.settingCard}>
            <div className={styles.settingHeader}>
              <div className={styles.settingIcon}>📊</div>
              <h3 className={styles.settingTitle}>数据管理</h3>
            </div>
            <div className={styles.dataManagement}>
              <button className={styles.dataButton} onClick={() => alert('清除游戏进度功能')}>
                🗑️ 清除游戏进度
              </button>
              <button className={styles.dataButton} onClick={() => alert('导出数据功能')}>
                📤 导出游戏数据
              </button>
              <button className={styles.dataButton} onClick={() => alert('导入数据功能')}>
                📥 导入游戏数据
              </button>
            </div>
          </Card>
        </div>

        {/* 操作按钮 */}
        <div className={styles.actionButtons}>
          <Button variant="primary" size="large" onClick={handleSave}>
            💾 保存设置
          </Button>
          <Button variant="secondary" size="medium" onClick={handleReset}>
            🔄 恢复默认
          </Button>
          <Button variant="secondary" size="medium" onClick={handleGoBack}>
            ↩️ 返回
          </Button>
          <Button variant="secondary" size="medium" onClick={handleGoHome}>
            🏠 返回首页
          </Button>
        </div>
      </main>

      <Footer
        language={language}
        onLanguageChange={setLanguage}
        onAboutClick={() => window.open('/about', '_blank')}
        onPrivacyClick={() => window.open('/privacy', '_blank')}
      />
    </div>
  )
}

export default SettingsPage