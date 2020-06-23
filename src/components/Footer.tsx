import React from 'react'
import { motion } from 'framer-motion'
import './Footer.scss'

export default function Footer(): JSX.Element {
  return (
    <motion.footer className="Footer" positionTransition>
      <span>GitHub&nbsp;activity insights you&nbsp;haven't seen&nbsp;before. <br/>
        By&nbsp;<a href="https://twixes.com">Twixes</a>.&nbsp;👋
      </span>
    </motion.footer>
  )
}
