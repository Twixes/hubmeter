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
import { useLocalStorageSet } from '../../hooks/useLocalStorageSet'
import { capitalize } from '../../utils'

interface Props {
    label: string
    localStorageKey: string
    options: [string, string][]
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

function humanizeAllowedEventTypes(selectedOptions: Set<EventType>): string {
    if (!selectedOptions.size) return 'None'
    if (selectedOptions.size === Object.keys(EventType).length) return 'All'
    return 'Only selected'
}

export default function Select({ label, localStorageKey, options }: Props): JSX.Element {
    const shouldReduceMotion = useReducedMotion()
    const [selectedOptions, toggleOption] = useLocalStorageSet<EventType>(localStorageKey)

    const humanAllowedEventTypes = humanizeAllowedEventTypes(selectedOptions)

    return (
        <>
            <div className="SelectBox" title={humanAllowedEventTypes}>
                <i>{label}</i>
                <span className="SelectBox-summary">{humanAllowedEventTypes}</span>
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
                    {options.map(([optionKey, optionName], index) => (
                        <li key={optionKey} tabIndex={index + 1}>
                            <input
                                id={optionKey}
                                type="checkbox"
                                checked={selectedOptions.has(optionKey as EventType)}
                                onChange={(e) => toggleOption(optionKey as EventType, e.target.checked)}
                            />
                            <label htmlFor={optionKey}>{capitalize(optionName)}</label>
                        </li>
                    ))}
                </motion.ul>
            </AnimatePresence>
        </>
    )
}
