import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Modal.module.css'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  showCloseButton?: boolean
  size?: 'small' | 'medium' | 'large'
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  size = 'medium',
}) => {
  // 阻止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // ESC键关闭
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className={styles.modalOverlay}>
        <motion.div
          className={styles.modalBackdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className={`${styles.modal} ${styles[`modal--${size}`]}`}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{title}</h2>
              {showCloseButton && (
                <button
                  className={styles.modalCloseButton}
                  onClick={onClose}
                  aria-label="Close"
                >
                  ×
                </button>
              )}
            </div>
          )}
          <div className={styles.modalContent}>{children}</div>
          {!title && showCloseButton && (
            <button
              className={styles.modalCloseButtonTop}
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default Modal