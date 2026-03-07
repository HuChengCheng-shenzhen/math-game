import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import './styles/global.css'
import './styles/animations.css'
import './styles/responsive.css'
import './i18n' // 初始化国际化

// 懒加载页面组件
const HomePage = lazy(() => import('./screens/HomePage'))
const GamePage = lazy(() => import('./screens/GamePage'))
const SettingsPage = lazy(() => import('./screens/SettingsPage'))

// 加载中组件
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)',
    fontFamily: '"Comic Sans MS", cursive, sans-serif'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: '48px',
        animation: 'bounce 1s infinite',
        marginBottom: '20px'
      }}>
        🧮
      </div>
      <h1 style={{ color: '#1976D2', marginBottom: '10px' }}>数感乐园</h1>
      <p style={{ color: '#666' }}>加载中...</p>
    </div>
  </div>
)

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* 重定向未知路径到首页 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App