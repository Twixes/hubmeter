/** @jsxImportSource @emotion/react */

import { EventType, eventTypeToName } from '../../github-api'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { capitalize } from '../../utils'
import { Base } from './Base'

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

export function Select({ label }: SelectProps): JSX.Element {
    const [eventTypeSelection, setEventTypeState] = useEventTypeSelection()

    return (
        <Base
            label={label}
            summary={humanizeAllowedEventTypes(eventTypeSelection)}
            summaryExtended={humanizeAllowedEventTypes(eventTypeSelection, false)}
        >
            <ul>
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
            </ul>
        </Base>
    )
}
