import './Notice.scss'

import { AnimatePresence, motion, useReducedMotion, Variants } from 'framer-motion'
import React, { ReactChild } from 'react'

interface Props {
  message: ReactChild | null
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

export default function ErrorNotice({
  message,
  indication,
  onXClick,
  initialAnimatePresence
}: Props): JSX.Element | null {
  const shouldReduceMotion = useReducedMotion()

  return (
    <AnimatePresence initial={initialAnimatePresence}>
      {!message ? null : (
        <motion.div
          className="Notice"
          custom={shouldReduceMotion}
          variants={OUTSIDE_VARIANTS}
          initial="hidden"
          animate="shown"
          exit="hidden"
          layout
        >
          <div className="Notice-indicator">{indication}</div>
          <motion.div
            className="Notice-message"
            custom={shouldReduceMotion}
            variants={INSIDE_VARIANTS}
            initial="hidden"
            animate="shown"
            exit="hidden"
          >
            {message}
          </motion.div>
          {onXClick && (
            <button className="Notice-button" type="button" onClick={onXClick}>
              ✗
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
