import React, { ReactChild } from 'react'
import { AnimatePresence, motion, useReducedMotion, Variants } from 'framer-motion'
import './Notice.scss'

interface Props {
  children: ReactChild
  shouldDisplay: boolean
  indication: string
  onXClick?: () => void
  initialAnimatePresence?: boolean
}

const OUTSIDE_VARIANTS: Variants = {
  hidden: (shouldReduceMotion: boolean) => {
    return {
      maxHeight: shouldReduceMotion ? '12rem' : '3rem',
      marginTop: shouldReduceMotion ? '0.75rem' : '-3rem',
      opacity: 0
    }
  },
  shown: {
    maxHeight: '12rem',
    marginTop: '0.75rem',
    opacity: 1
  }
}

const INSIDE_VARIANTS: Variants = {
  hidden: (shouldReduceMotion: boolean) => {
    return {
      maxHeight: shouldReduceMotion ? '12rem' : '3rem'
    }
  },
  shown: {
    maxHeight: '12rem'
  }
}

export default function ErrorNotice(
  { children, shouldDisplay, indication, onXClick, initialAnimatePresence }: Props
): JSX.Element | null {
  const shouldReduceMotion = useReducedMotion()

  return (
    <AnimatePresence initial={initialAnimatePresence}>
      {!shouldDisplay ? null : (
        <motion.div
          className="Notice" custom={shouldReduceMotion} variants={OUTSIDE_VARIANTS}
          initial="hidden" animate="shown" exit="hidden" positionTransition
        >
          <div className="Notice-indicator">{indication}</div>
          <motion.div
            className="Notice-message" custom={shouldReduceMotion} variants={INSIDE_VARIANTS}
            initial="hidden" animate="shown" exit="hidden"
          >{children}
          </motion.div>
          {onXClick && <button className="Notice-button" type="button" onClick={onXClick}>✗</button>}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
