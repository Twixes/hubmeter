import React from 'react'
import { useRecoilState } from 'recoil'
import { AnimatePresence, motion, useReducedMotion, Variants } from 'framer-motion'
import { showGHAPIErrorNoticeState } from '../atoms'
import './ErrorNotice.scss'

const VARIANTS: Variants = {
  hidden: (shouldReduceMotion: boolean) => {
    return {
      marginTop: shouldReduceMotion ? '0.75rem' : '-3rem',
      opacity: 0
    }
  },
  shown: () => {
    return {
      marginTop: '0.75rem',
      opacity: 1
    }
  }
}

export default function ErrorNotice(): JSX.Element | null {
  const [showGHAPIErrorNotice, setShowGHAPIErrorNotice] = useRecoilState(showGHAPIErrorNoticeState)
  const shouldReduceMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {!showGHAPIErrorNotice ? null : (
        <motion.div
          className="ErrorNotice" custom={shouldReduceMotion} variants={VARIANTS}
          initial="hidden" animate="shown" exit="hidden" positionTransition
        >
          <div className="ErrorNotice-indicator">!</div>
          <div className="ErrorNotice-message">
            GitHub API error. <a
              href="https://developer.github.com/v3/#rate-limiting" target="_blank" rel="noopener noreferrer"
            >Rate limiting</a> may be at fault. Try again later.
          </div>
          <button className="ErrorNotice-button" type="button" onClick={() => { setShowGHAPIErrorNotice(false) }}>
            ✗
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
