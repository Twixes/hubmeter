import './Footer.scss'

import { motion } from 'framer-motion'
import React from 'react'

export default function Footer(): JSX.Element {
    return (
        <motion.footer className="Footer" layout>
            <span>
                GitHub&nbsp;activity insights you&nbsp;haven't seen&nbsp;before. <br />
                By&nbsp;<a href="https://matloka.com">Michael Matloka</a>.&nbsp;👋
            </span>
        </motion.footer>
    )
}
