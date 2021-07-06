/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import { AnimatePresence, motion, useReducedMotion, Variants } from 'framer-motion'
import React, { ReactChild } from 'react'

import { card } from '../styles'

interface Props {
    message: ReactChild | null
    indicator?: string
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

const notice = css({
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: '3rem',
    paddingRight: 0,
    background: 'var(--color-accent)',
    color: 'var(--color-foreground)',
    fontSize: '1.5rem'
})

const noticeIndicator = css`
    background: var(--color-foreground);
    color: var(--color-accent);
    font-size: 1.125rem;
    text-align: center;
    line-height: 1.5rem;
    height: 1.5rem;
    width: 1.5rem;
    border-radius: 0.25rem;
    user-select: none;
`

const noticeMessage = css`
    flex-grow: 1;
    width: 0;
    padding: 0.375rem 0;
    margin: 0 0.75rem;
    overflow: hidden;
    ::selection {
        background: var(--color-foreground);
        color: var(--color-accent);
    }
`

const noticeButton = css`
    transition: background var(--duration-short) var(--timing-function-standard),
        color var(--duration-short) var(--timing-function-standard);
    padding: 0;
    align-self: stretch;
    width: 3rem;
    text-align: center;
    user-select: none;
    cursor: pointer;
    &:active {
        background: var(--color-foreground);
        color: var(--color-accent);
    }
`

export default function Notice({
    message,
    indicator = '!',
    onXClick,
    initialAnimatePresence
}: Props): JSX.Element | null {
    const shouldReduceMotion = useReducedMotion()

    return (
        <AnimatePresence initial={initialAnimatePresence}>
            {!message ? null : (
                <motion.div
                    css={[card, notice]}
                    custom={shouldReduceMotion}
                    variants={OUTSIDE_VARIANTS}
                    initial="hidden"
                    animate="shown"
                    exit="hidden"
                    layout
                >
                    <div css={noticeIndicator}>{indicator}</div>
                    <motion.div
                        css={noticeMessage}
                        custom={shouldReduceMotion}
                        variants={INSIDE_VARIANTS}
                        initial="hidden"
                        animate="shown"
                        exit="hidden"
                    >
                        {message}
                    </motion.div>
                    {onXClick && (
                        <button css={noticeButton} type="button" onClick={onXClick}>
                            ✗
                        </button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}
