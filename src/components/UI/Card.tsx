import React from 'react'
import { motion } from 'framer-motion'
import styles from './Card.module.css'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'small' | 'medium' | 'large'
  elevation?: 'none' | 'low' | 'medium' | 'high'
  border?: boolean
  onClick?: () => void
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'medium',
  elevation = 'medium',
  border = false,
  onClick,
}) => {
  const cardClasses = [
    styles.card,
    styles[`card--padding-${padding}`],
    styles[`card--elevation-${elevation}`],
    border ? styles['card--border'] : '',
    onClick ? styles['card--clickable'] : '',
    className,
  ].join(' ')

  const CardComponent = onClick ? motion.div : 'div'

  const cardProps = onClick
    ? {
        className: cardClasses,
        onClick,
        whileHover: { y: -4 },
        whileTap: { y: 0 },
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
      }
    : { className: cardClasses }

  return <CardComponent {...cardProps}>{children}</CardComponent>
}

export default Card