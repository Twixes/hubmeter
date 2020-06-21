import React from 'react'
import { useRecoilState } from 'recoil'
import { AnimatePresence, motion, useReducedMotion, Variants } from 'framer-motion'
import { showGHAPIErrorNoticeState } from '../atoms'
import './ErrorNotice.scss'

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
      maxHeight: shouldReduceMotion ? '12rem' : '3rem',
    }
  },
  shown: {
    maxHeight: '12rem',
  }
}

export default function ErrorNotice(): JSX.Element | null {
  const [showGHAPIErrorNotice, setShowGHAPIErrorNotice] = useRecoilState(showGHAPIErrorNoticeState)
  const shouldReduceMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {!showGHAPIErrorNotice ? null : (
        <motion.div
          className="ErrorNotice" custom={shouldReduceMotion} variants={OUTSIDE_VARIANTS}
          initial="hidden" animate="shown" exit="hidden" positionTransition
        >
          <div className="ErrorNotice-indicator">!</div>
          <motion.div
            className="ErrorNotice-message" custom={shouldReduceMotion} variants={INSIDE_VARIANTS}
            initial="hidden" animate="shown" exit="hidden"
          >
            GitHub API error. <a
              href="https://developer.github.com/v3/#rate-limiting" target="_blank" rel="noopener noreferrer"
            >Rate limiting</a> may be at fault. Try again later.
          </motion.div>
          <button
            className="ErrorNotice-button" type="button" onClick={() => { setShowGHAPIErrorNotice(false) }}
          >✗</button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
