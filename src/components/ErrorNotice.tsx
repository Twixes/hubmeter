import React from 'react'
import { useRecoilState } from 'recoil'
import { motion } from 'framer-motion'
import { currentErrorMessageState } from '../recoil'
import './ErrorNotice.scss'

export default function ErrorNotice(): JSX.Element | null {
  const [currentErrorMessage, setCurrentErrorMessage] = useRecoilState(currentErrorMessageState)

  return !currentErrorMessage ? null : (
    <motion.div
      className="ErrorNotice" variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
      initial="hidden" animate="shown" exit="hidden"
    >
      <div className="ErrorNotice-indicator">!</div>
      <div className="ErrorNotice-message">{currentErrorMessage}</div>
      <button className="ErrorNotice-button" type="button" onClick={() => { setCurrentErrorMessage(null) }}>✗</button>
    </motion.div>
  )
}
