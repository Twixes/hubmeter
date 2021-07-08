/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import { AnimatePresence, motion, useReducedMotion, Variants } from 'framer-motion'
import { CSSProperties, ReactChild, ReactNode } from 'react'
import { useRef, useState } from 'react'

import { useOutsideClickHandler } from '../../hooks/useOutsideClickHandler'
import { card, expandableExpandedBottom, expandableExpandedTop } from '../../styles'

const selectBox = css`
    position: relative;
    flex-direction: column;
    justify-content: center;
    height: 3rem;
    line-height: 1.2;
    cursor: pointer;
    overflow: hidden;
    &::after {
        transition: background var(--duration-short) var(--timing-function-standard);
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
    &:hover::after {
        background: var(--color-shadow);
    }
`

const selectOptions = css`
    position: absolute;
    overflow: hidden;
    width: 100%;
    padding: 0;
    ul,
    ol {
        display: flex;
        flex-flow: column;
        list-style: none;
        width: 100%;
        margin: 0;
        padding: 0;
    }
    input {
        flex-shrink: 0;
    }
    li {
        display: flex;
        align-items: center;
        height: 2.5rem;
        position: relative;
        padding: 0.75rem;
        white-space: pre;
        &:not(:last-child) {
            border-bottom: solid 1px var(--color-shadow);
        }
        &::after {
            transition: background var(--duration-short) var(--timing-function-standard);
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }
        &:hover::after {
            background: var(--color-shadow);
        }
    }
    label {
        flex-grow: 1;
        line-height: 2.5rem;
        padding-left: 0.5rem;
    }
`

const selectBoxSummary = css`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

const expandableContainer = css({ position: 'relative', minWidth: 0 })

const VARIANTS: Variants = {
    hidden: ([shouldReduceMotion, itemsLimit]: [boolean, number]) => {
        return {
            opacity: shouldReduceMotion ? 0 : 1,
            height: shouldReduceMotion ? (itemsLimit ? `${itemsLimit * 2.5}rem` : `auto`) : 0,
            overflowY: itemsLimit ? 'scroll' : 'hidden'
        }
    },
    shown: ([, itemsLimit]: [boolean, number]) => {
        return {
            opacity: 1,
            height: itemsLimit ? `${itemsLimit * 2.5 + 1.25}rem` : `auto`,
            overflowY: itemsLimit ? 'scroll' : 'hidden'
        }
    }
}

export interface ExpandablePropsBase {
    label: string
    summary: ReactChild | string
    summaryExtended?: string
    style?: CSSProperties
    children: ReactNode
}

export function Base({ label, summary, summaryExtended, style, children }: ExpandablePropsBase): JSX.Element {
    const shouldReduceMotion = useReducedMotion()
    const [isExpanded, setIsExpanded] = useState(false)
    const containerRef = useRef<HTMLDivElement | null>(null)

    useOutsideClickHandler(containerRef, () => {
        setIsExpanded(false)
    })

    return (
        <div css={expandableContainer} ref={containerRef} style={style}>
            <div
                css={[card, selectBox, isExpanded && expandableExpandedTop]}
                title={summaryExtended || summary.toString()}
                onClick={() => {
                    setIsExpanded((state) => !state)
                }}
                tabIndex={0}
            >
                <i>{label}</i>
                <span css={selectBoxSummary}>{summary}</span>
            </div>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        css={[card, selectOptions, expandableExpandedBottom]}
                        custom={[shouldReduceMotion, 12]}
                        variants={VARIANTS}
                        initial="hidden"
                        animate="shown"
                        exit="hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
