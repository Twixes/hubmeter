import './Spinner.scss'

import { motion, Variants } from 'framer-motion'
import React from 'react'

interface Props {
    color?: string
}

const VARIANTS: Variants = {
    hidden: {
        opacity: 0
    },
    shown: {
        opacity: 1
    }
}

export default function Spinner({ color }: Props): JSX.Element {
    return (
        <motion.div className="Spinner-container" variants={VARIANTS} initial="hidden" animate="shown" exit="hidden">
            <div className="Spinner" style={color ? { borderLeftColor: color, borderRightColor: color } : {}} />
        </motion.div>
    )
}
