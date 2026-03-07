import React from 'react'
import { motion } from 'framer-motion'
import styles from './Button.module.css'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'success' | 'warning'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = '',
}) => {
  const buttonClasses = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    fullWidth ? styles['button--fullWidth'] : '',
    disabled ? styles['button--disabled'] : '',
    className,
  ].join(' ').trim()

  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  )
}

export default Button