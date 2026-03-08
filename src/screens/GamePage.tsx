import React, { useReducer, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import NumberDisplay from '../components/GameBoard/NumberDisplay'
import PatternGrid from '../components/GameBoard/PatternGrid'
import OptionButtons from '../components/GameBoard/OptionButtons'
import ErrorHint from '../components/GameBoard/ErrorHint'
import FeedbackOverlay from '../components/GameBoard/FeedbackOverlay'
import Button from '../components/UI/Button'
import Modal from '../components/UI/Modal'
import { gameReducer, initialGameState } from '../game/engine'
import styles from './GamePage.module.css'

const GamePage: React.FC = () => {
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(gameReducer, initialGameState)
  const [showPauseModal, setShowPauseModal] = React.useState(false)
  const [showHelpModal, setShowHelpModal] = React.useState(false)
  const [language, setLanguage] = React.useState<'zh-CN' | 'en-US'>('zh-CN')
  const [isPanelCollapsed, setIsPanelCollapsed] = React.useState(false)

  // 初始化游戏
  useEffect(() => {
    dispatch({ type: 'GENERATE_NEW_ROUND' })
  }, [])

  // 处理答案选择
  const handleAnswerSelect = useCallback((option: number) => {
    dispatch({ type: 'SELECT_ANSWER', payload: option })
  }, [])

  // 处理下一关
  const handleNextRound = useCallback(() => {
    dispatch({ type: 'GENERATE_NEW_ROUND' })
  }, [])

  // 处理错误提示隐藏
  const handleHideHint = useCallback(() => {
    dispatch({ type: 'HIDE_HINT' })
  }, [])

  // 处理暂停
  const handlePause = useCallback(() => {
    setShowPauseModal(true)
  }, [])

  // 处理继续
  const handleResume = useCallback(() => {
    setShowPauseModal(false)
  }, [])

  // 处理返回首页
  const handleGoHome = useCallback(() => {
    navigate('/')
  }, [navigate])

  // 处理重置游戏
  const handleResetGame = useCallback(() => {
    dispatch({ type: 'RESET_DIFFICULTY' })
    dispatch({ type: 'GENERATE_NEW_ROUND' })
    setShowPauseModal(false)
  }, [])

  // 处理难度设置
  const handleSetDifficulty = useCallback((difficulty: 'easy' | 'medium' | 'hard') => {
    dispatch({ type: 'SET_DIFFICULTY', payload: difficulty })
    dispatch({ type: 'GENERATE_NEW_ROUND' })
  }, [])

  // 自动进入下一关（正确回答后）
  useEffect(() => {
    if (state.isCorrect === true) {
      const timer = setTimeout(() => {
        handleNextRound()
      }, 1500) // 1.5秒后自动进入下一关
      return () => clearTimeout(timer)
    }
  }, [state.isCorrect, handleNextRound])

  // 错误提示自动隐藏
  useEffect(() => {
    if (state.showHint) {
      const timer = setTimeout(() => {
        handleHideHint()
      }, 3000) // 3秒后自动隐藏提示
      return () => clearTimeout(timer)
    }
  }, [state.showHint, handleHideHint])

  return (
    <div className={styles.gamePage}>
      <Header
        score={state.score}
        level={state.level}
        difficulty={state.difficulty}
        onSettingsClick={handlePause}
        onHelpClick={() => setShowHelpModal(true)}
      />

      <main className={styles.gameContent}>
        {/* 游戏区域 */}
        <div className={styles.gameArea}>
          {/* 数字显示 */}
          <NumberDisplay
            number={state.currentNumber}
            isCorrect={state.isCorrect}
            showHint={state.showHint}
          />

          {/* 图案网格 */}
          <PatternGrid
            patterns={state.patterns}
            selectedCount={state.selectedAnswer}
            showCount={state.showHint}
          />

          {/* 选项按钮 */}
          <OptionButtons
            options={state.options}
            correctAnswer={state.correctAnswer}
            selectedAnswer={state.selectedAnswer}
            isCorrect={state.isCorrect}
            hintLevel={state.hintLevel}
            onSelect={handleAnswerSelect}
            disabled={state.selectedAnswer !== null}
          />

          {/* 操作按钮 */}
          <div className={styles.actionButtons}>
            <Button
              variant="secondary"
              size="medium"
              onClick={handlePause}
              disabled={state.selectedAnswer === null && state.isCorrect === null}
            >
              ⏸️ 暂停
            </Button>
            <Button
              variant="secondary"
              size="medium"
              onClick={handleNextRound}
              disabled={state.selectedAnswer === null}
            >
              ⏭️ 下一关
            </Button>
            <Button
              variant="secondary"
              size="medium"
              onClick={handleResetGame}
            >
              🔄 重新开始
            </Button>
          </div>
        </div>

        {/* 信息面板（游戏状态、提示、难度设置 - 可折叠） */}
        <div className={`${styles.infoPanel} ${isPanelCollapsed ? styles.collapsed : ''}`}>
          <button
            className={styles.collapseButton}
            onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
            aria-label={isPanelCollapsed ? '展开信息面板' : '折叠信息面板'}
          >
            {isPanelCollapsed ? '🔽 展开信息' : '🔼 折叠信息'}
          </button>

          <div className={styles.infoPanelContent}>
            <div className={styles.statusCard}>
              <h3 className={styles.statusTitle}>游戏状态</h3>
              <div className={styles.statusItems}>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>连续正确</span>
                  <span className={styles.statusValue}>{state.consecutiveCorrect}</span>
                </div>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>连续错误</span>
                  <span className={styles.statusValue}>{state.consecutiveWrong}</span>
                </div>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>正确率</span>
                  <span className={styles.statusValue}>
                    {state.level > 1
                      ? `${Math.round((state.score / 10 / (state.level - 1)) * 100)}%`
                      : '0%'}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.tipsCard}>
              <h3 className={styles.tipsTitle}>💡 游戏提示</h3>
              <ul className={styles.tipsList}>
                <li>仔细数一数图案的数量</li>
                <li>选择与图案数量相同的数字</li>
                <li>错误时会有提示帮助学习</li>
                <li>连续正确会提高难度哦！</li>
              </ul>
            </div>

            <div className={styles.difficultyCard}>
              <h3 className={styles.difficultyTitle}>难度设置</h3>
              <div className={styles.difficultyButtons}>
                <Button
                  variant={state.difficulty === 'easy' ? 'primary' : 'secondary'}
                  size="small"
                  onClick={() => handleSetDifficulty('easy')}
                >
                  简单
                </Button>
                <Button
                  variant={state.difficulty === 'medium' ? 'primary' : 'secondary'}
                  size="small"
                  onClick={() => handleSetDifficulty('medium')}
                >
                  中等
                </Button>
                <Button
                  variant={state.difficulty === 'hard' ? 'primary' : 'secondary'}
                  size="small"
                  onClick={() => handleSetDifficulty('hard')}
                >
                  困难
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer
        language={language}
        onLanguageChange={setLanguage}
        onAboutClick={() => window.open('/about', '_blank')}
        onPrivacyClick={() => window.open('/privacy', '_blank')}
      />

      {/* 错误提示 */}
      <ErrorHint
        show={state.showHint}
        onHide={handleHideHint}
        language={language}
      />

      {/* 反馈覆盖层 */}
      <FeedbackOverlay
        show={state.selectedAnswer !== null && state.isCorrect === true}
        type="success"
        autoHide
        duration={1500}
      />

      <FeedbackOverlay
        show={state.selectedAnswer !== null && state.isCorrect === false}
        type="error"
        autoHide
        duration={2000}
      />

      {/* 暂停模态框 */}
      <Modal
        isOpen={showPauseModal}
        onClose={handleResume}
        title="游戏暂停"
        size="medium"
      >
        <div className={styles.modalContent}>
          <p>游戏已暂停。您可以选择以下操作：</p>
          <div className={styles.modalActions}>
            <Button variant="primary" size="large" onClick={handleResume} fullWidth>
              ▶️ 继续游戏
            </Button>
            <Button variant="secondary" size="medium" onClick={handleResetGame} fullWidth>
              🔄 重新开始
            </Button>
            <Button variant="secondary" size="medium" onClick={handleGoHome} fullWidth>
              🏠 返回首页
            </Button>
          </div>
        </div>
      </Modal>

      {/* 帮助模态框 */}
      <Modal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        title="游戏帮助"
        size="large"
      >
        <div className={styles.helpContent}>
          <div className={styles.helpSection}>
            <h4>🎮 游戏玩法</h4>
            <ol>
              <li>观察屏幕上显示的图案数量</li>
              <li>记住显示的数字</li>
              <li>从三个选项中选择正确的数字</li>
              <li>答对得分，进入下一关</li>
            </ol>
          </div>
          <div className={styles.helpSection}>
            <h4>🌟 游戏特色</h4>
            <ul>
              <li><strong>智能难度调整：</strong>根据表现自动调整游戏难度</li>
              <li><strong>友好错误提示：</strong>答错时会有提示帮助学习</li>
              <li><strong>可爱图案：</strong>冰淇淋、饼干等儿童喜爱的图案</li>
              <li><strong>双语支持：</strong>支持中文和英文</li>
            </ul>
          </div>
          <div className={styles.helpSection}>
            <h4>🎯 学习目标</h4>
            <ul>
              <li>认识数字5-20</li>
              <li>建立数量对应关系</li>
              <li>培养观察力和注意力</li>
              <li>在错误中学习成长</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default GamePage