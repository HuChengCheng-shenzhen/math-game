import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhCN from './zh-CN.json'
import enUS from './en-US.json'

// 初始化i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      'zh-CN': {
        translation: zhCN,
      },
      'en-US': {
        translation: enUS,
      },
    },
    lng: 'zh-CN', // 默认语言
    fallbackLng: 'zh-CN',
    interpolation: {
      escapeValue: false, // React已经处理了XSS
    },
    react: {
      useSuspense: false, // 为了更好的兼容性
    },
  })

export default i18n

// 语言切换函数
export const changeLanguage = (lng: 'zh-CN' | 'en-US') => {
  i18n.changeLanguage(lng)
  document.documentElement.lang = lng
}

// 获取当前语言
export const getCurrentLanguage = (): 'zh-CN' | 'en-US' => {
  return i18n.language as 'zh-CN' | 'en-US'
}

// 翻译hook
export { useTranslation } from 'react-i18next'