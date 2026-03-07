import React from 'react'
import styles from './Footer.module.css'

interface FooterProps {
  language?: 'zh-CN' | 'en-US'
  onLanguageChange?: (lang: 'zh-CN' | 'en-US') => void
  onAboutClick?: () => void
  onPrivacyClick?: () => void
}

const Footer: React.FC<FooterProps> = ({
  language = 'zh-CN',
  onLanguageChange,
  onAboutClick,
  onPrivacyClick,
}) => {
  const texts = {
    'zh-CN': {
      copyright: '© 2023 数感乐园 - 儿童数学启蒙游戏',
      designedFor: '专为3-6岁儿童设计',
      language: '语言',
      about: '关于',
      privacy: '隐私',
    },
    'en-US': {
      copyright: '© 2023 Math Fun Land - Kids Math Learning Game',
      designedFor: 'Designed for children aged 3-6',
      language: 'Language',
      about: 'About',
      privacy: 'Privacy',
    },
  }[language]

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* 版权信息 */}
        <div className={styles.copyrightSection}>
          <p className={styles.copyright}>{texts.copyright}</p>
          <p className={styles.designedFor}>{texts.designedFor}</p>
        </div>

        {/* 链接 */}
        <div className={styles.linksSection}>
          <button
            className={styles.footerLink}
            onClick={() => onAboutClick?.()}
            aria-label={texts.about}
          >
            {texts.about}
          </button>
          <span className={styles.separator}>•</span>
          <button
            className={styles.footerLink}
            onClick={() => onPrivacyClick?.()}
            aria-label={texts.privacy}
          >
            {texts.privacy}
          </button>
        </div>

        {/* 语言切换 */}
        <div className={styles.languageSection}>
          <span className={styles.languageLabel}>{texts.language}:</span>
          <div className={styles.languageButtons}>
            <button
              className={`${styles.languageButton} ${language === 'zh-CN' ? styles.languageButtonActive : ''}`}
              onClick={() => onLanguageChange?.('zh-CN')}
              aria-label="中文"
              aria-pressed={language === 'zh-CN'}
            >
              中文
            </button>
            <button
              className={`${styles.languageButton} ${language === 'en-US' ? styles.languageButtonActive : ''}`}
              onClick={() => onLanguageChange?.('en-US')}
              aria-label="English"
              aria-pressed={language === 'en-US'}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* 装饰元素 */}
      <div className={styles.decorations}>
        <span className={styles.decoration}>🧮</span>
        <span className={styles.decoration}>🎨</span>
        <span className={styles.decoration}>🎯</span>
        <span className={styles.decoration}>🌟</span>
        <span className={styles.decoration}>🎈</span>
      </div>
    </footer>
  )
}

export default Footer