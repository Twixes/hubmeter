import './index.scss'

import useLocalStorage from '@rehooks/local-storage'
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

import { EventType, User } from '../../github-api'
import useLocalStorageSet from '../../hooks/useLocalStorageSet'

interface Props {
    localStorageKey: string
}

const VARIANTS: Variants = {
    hidden: ([shouldReduceMotion, numberOfResults]: [boolean, number]) => {
        return {
            height: shouldReduceMotion ? `${numberOfResults * 3}rem` : 0,
            opacity: shouldReduceMotion ? 0 : 1
        }
    },
    shown: ([, numberOfResults]: [boolean, number]) => {
        return {
            height: `${numberOfResults * 3}rem`,
            opacity: 1
        }
    }
}

export default function Select({ localStorageKey }: Props): JSX.Element {
    const shouldReduceMotion = useReducedMotion()
    const [selectedOptions, toggleOption] = useLocalStorageSet<EventType>(localStorageKey)

    const options = EventType

    return (
        <AnimatePresence>
            <motion.ul
                className="ControlsSearchResults"
                custom={[shouldReduceMotion, Object.keys(options).length]}
                variants={VARIANTS}
                initial="hidden"
                animate="shown"
                exit="hidden"
            >
                {Object.entries(options).map(([optionKey, optionName], index) => (
                    <li className="ControlsSearchResults-user" key={optionKey} tabIndex={index + 1}>
                        <input
                            id={optionKey}
                            type="checkbox"
                            checked={selectedOptions.has(optionKey as EventType)}
                            onChange={(e) => toggleOption(optionKey as EventType, e.target.checked)}
                        />
                        <label htmlFor={optionKey}>{optionName}</label>
                    </li>
                ))}
            </motion.ul>
        </AnimatePresence>
    )
}
