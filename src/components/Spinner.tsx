/** @jsxImportSource @emotion/react */

import { css, keyframes } from '@emotion/react'
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

const spin = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }`

const spinner = css`
    animation: ${spin} var(--duration-long) var(--timing-function-standard) infinite;
    width: 2.5rem;
    height: 2.5rem;
    border: solid transparent 0.375rem;
    border-left-color: var(--color-foreground);
    border-right-color: var(--color-foreground);
    border-radius: 1.5rem;
`

const spinnerContainer = css`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    width: 100%;
    height: 100%;
`

export default function Spinner({ color }: Props): JSX.Element {
    return (
        <motion.div css={spinnerContainer} variants={VARIANTS} initial="hidden" animate="shown" exit="hidden">
            <div css={spinner} style={color ? { borderLeftColor: color, borderRightColor: color } : {}} />
        </motion.div>
    )
}
