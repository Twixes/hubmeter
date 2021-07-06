/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import { AnimatePresence, motion, useReducedMotion, Variants } from 'framer-motion'
import { useState } from 'react'
import { useRef } from 'react'

import { EventType, eventTypeToName } from '../github-api'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useOutsideClickHandler } from '../hooks/useOutsideClickHandler'
import { card, expandableExpandedBottom, expandableExpandedTop } from '../styles'
import { capitalize } from '../utils'

export interface SelectProps {
    label: string
    localStorageKey: string
    options: [string, string][]
}

const initialSelectState = Object.fromEntries(Object.keys(EventType).map((key) => [key, true])) as Record<
    EventType,
    boolean
>

export function useEventTypeSelection(): [
    Record<EventType, boolean>,
    (eventType: EventType, newState: boolean) => void
] {
    const [eventTypeSelection, setEventTypeSelection] = useLocalStorage<Record<EventType, boolean>>('event-types', {
        ...initialSelectState
    })
    return [
        eventTypeSelection,
        (eventType, newState) => setEventTypeSelection((currentState) => ({ ...currentState, [eventType]: newState }))
    ]
}

function humanizeAllowedEventTypes(selectedOptions: Record<EventType, boolean>, short = true): string {
    const selectedCount = Object.values(selectedOptions).filter(Boolean).length
    if (!selectedCount) return 'None'
    const allOptionEntries = Object.entries(selectedOptions)
    if (selectedCount === Object.keys(EventType).length) return 'All'
    const selectedOptionNames = allOptionEntries
        .filter(([, value]) => value)
        .map(([key]) => eventTypeToName[key as EventType])
    const info = `${selectedOptionNames.length} out of ${allOptionEntries.length}`
    if (!short) return `${info}: ${selectedOptionNames.join(', ')}`
    return info
}

const VARIANTS: Variants = {
    hidden: ([shouldReduceMotion]: [boolean]) => {
        return {
            opacity: shouldReduceMotion ? 0 : 1,
            height: shouldReduceMotion ? `auto` : 0
        }
    },
    shown: () => {
        return {
            opacity: 1,
            height: `auto`
        }
    }
}

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
    display: flex;
    flex-flow: column;
    list-style: none;
    position: absolute;
    width: 100%;
    padding: 0;
    overflow: hidden;
    z-index: 1;
    li {
        display: flex;
        align-items: center;
        height: 2.5rem;
        position: relative;
        padding: 0.75rem;
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
    white-space: pre;
    overflow: hidden;
    text-overflow: ellipsis;
`

export function Select({ label }: SelectProps): JSX.Element {
    const shouldReduceMotion = useReducedMotion()
    const [eventTypeSelection, setEventTypeState] = useEventTypeSelection()
    const [areOptionsShown, setAreOptionsShown] = useState(false)
    const containerRef = useRef<HTMLDivElement | null>(null)

    useOutsideClickHandler(containerRef, () => {
        setAreOptionsShown(false)
    })

    return (
        <div css={{ position: 'relative' }} ref={containerRef}>
            <div
                css={[card, selectBox, areOptionsShown && expandableExpandedTop]}
                title={humanizeAllowedEventTypes(eventTypeSelection, false)}
                onClick={() => {
                    setAreOptionsShown((state) => !state)
                }}
                tabIndex={0}
            >
                <i>{label}</i>
                <span css={selectBoxSummary}>{humanizeAllowedEventTypes(eventTypeSelection)}</span>
            </div>
            <AnimatePresence>
                {areOptionsShown && (
                    <motion.ul
                        css={[card, selectOptions, expandableExpandedBottom]}
                        custom={[shouldReduceMotion]}
                        variants={VARIANTS}
                        initial="hidden"
                        animate="shown"
                        exit="hidden"
                    >
                        {Object.entries(eventTypeSelection).map(([key, value], index) => (
                            <li key={key} tabIndex={index + 1}>
                                <input
                                    id={key}
                                    type="checkbox"
                                    checked={value}
                                    onChange={(e) => setEventTypeState(key as EventType, e.target.checked)}
                                />
                                <label htmlFor={key}>{capitalize(eventTypeToName[key as EventType])}</label>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    )
}
