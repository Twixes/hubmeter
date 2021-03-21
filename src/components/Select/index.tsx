import './index.scss'

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

import { EventType, eventTypeToName, User } from '../../github-api'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { capitalize } from '../../utils'

interface Props {
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
    if (selectedCount === Object.keys(EventType).length) return 'All'
    if (!short)
        return `Only selected: ${Object.entries(selectedOptions)
            .filter(([, value]) => value)
            .map(([key]) => eventTypeToName[key as EventType])
            .join(', ')}`
    return 'Only selected'
}

const VARIANTS: Variants = {
    hidden: ([shouldReduceMotion]: [boolean]) => {
        return {
            opacity: shouldReduceMotion ? 0 : 1
        }
    },
    shown: () => {
        return {
            opacity: 1
        }
    }
}

export default function Select({ label }: Props): JSX.Element {
    const shouldReduceMotion = useReducedMotion()
    const [eventTypeSelection, setEventTypeState] = useEventTypeSelection()

    return (
        <>
            <div className="SelectBox" title={humanizeAllowedEventTypes(eventTypeSelection, false)}>
                <i>{label}</i>
                <span className="SelectBox-summary">{humanizeAllowedEventTypes(eventTypeSelection)}</span>
            </div>
            <AnimatePresence>
                <motion.ul
                    className="SelectOptions"
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
            </AnimatePresence>
        </>
    )
}
