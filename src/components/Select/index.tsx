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
    hidden: ([shouldReduceMotion, numberOfResults]: [boolean, number]) => {
        return {
            height: shouldReduceMotion ? `${numberOfResults * 0.75}rem` : 0,
            opacity: shouldReduceMotion ? 0 : 1
        }
    },
    shown: ([, numberOfResults]: [boolean, number]) => {
        return {
            height: `${numberOfResults * 0.75}rem`,
            opacity: 1
        }
    }
}

function humanizeAllowedEventTypes(selectedOptions: Set<EventType>): string {
    if (!selectedOptions.size || selectedOptions.size === Object.keys(EventType).length) return 'All'
    return `Only: ${Array.from(selectedOptions)
        .map((key) => eventTypeToName[key])
        .join(', ')}`
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
                <motion.div
                    className="SelectOptions"
                    custom={[shouldReduceMotion, options.length]}
                    variants={VARIANTS}
                    initial="hidden"
                    animate="shown"
                    exit="hidden"
                >
                    {options.map(([optionKey, optionName], index) => (
                        <div key={optionKey} tabIndex={index + 1}>
                            <input
                                id={optionKey}
                                type="checkbox"
                                checked={selectedOptions.has(optionKey as EventType)}
                                onChange={(e) => toggleOption(optionKey as EventType, e.target.checked)}
                            />
                            <label htmlFor={optionKey}>{capitalize(optionName)}</label>
                        </div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </>
    )
}
