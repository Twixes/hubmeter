/** @jsxImportSource @emotion/react */

import './index.scss'

import { css } from '@emotion/react'
import { AnimatePresence, motion, useReducedMotion, Variants } from 'framer-motion'
import React, {
    Dispatch,
    KeyboardEvent,
    MutableRefObject,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo
} from 'react'
import { useState } from 'react'
import { useRef } from 'react'

import { EventType, eventTypeToName, User } from '../../github-api'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useOutsideClickHandler } from '../../hooks/useOutsideClickHandler'
import { expandableExpandedBottom, expandableExpandedTop } from '../../styles'
import { capitalize } from '../../utils'

export interface SelectProps {
    label: string
    localStorageKey: string
    options: [string, string][]
}

const initialSelectState = Object.fromEntries(Object.keys(EventType).map((key) => [key, false])) as Record<
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
    hidden: ([shouldReduceMotion, optionCount]: [boolean, number]) => {
        return {
            opacity: shouldReduceMotion ? 0 : 1,
            height: shouldReduceMotion ? `${optionCount * 2.5}rem` : 0
        }
    },
    shown: ([, optionCount]: [boolean, number]) => {
        return {
            opacity: 1,
            height: `${optionCount * 2.5}rem`
        }
    }
}

export function Select({ label }: SelectProps): JSX.Element {
    const shouldReduceMotion = useReducedMotion()
    const [eventTypeSelection, setEventTypeState] = useEventTypeSelection()
    const [areOptionsShown, setAreOptionsShown] = useState(false)
    const containerRef = useRef<HTMLDivElement | null>(null)

    useOutsideClickHandler(containerRef, () => {
        setAreOptionsShown(false)
    })

    return (
        <div css={css({ position: 'relative' })} ref={containerRef}>
            <div
                className="SelectBox"
                css={areOptionsShown && expandableExpandedTop}
                title={humanizeAllowedEventTypes(eventTypeSelection, false)}
                onClick={() => {
                    setAreOptionsShown((state) => !state)
                }}
            >
                <i>{label}</i>
                <span className="SelectBox-summary">{humanizeAllowedEventTypes(eventTypeSelection)}</span>
            </div>
            <AnimatePresence>
                {areOptionsShown && (
                    <motion.ul
                        className="SelectOptions"
                        css={expandableExpandedBottom}
                        custom={[shouldReduceMotion, Object.keys(eventTypeSelection).length]}
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
