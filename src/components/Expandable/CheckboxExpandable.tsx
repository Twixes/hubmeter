/** @jsxImportSource @emotion/react */

import { useRecoilState } from 'recoil'

import { eventTypeSelectionState } from '../../atoms'
import { EventType, eventTypeToName } from '../../github-api'
import { capitalize } from '../../utils'
import { Base } from './Base'

export interface SelectProps {
    label: string
    localStorageKey: string
    options: [string, string][]
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
    const [eventTypeSelection, setEventTypeSelection] = useRecoilState(eventTypeSelectionState)

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
                            onChange={(e) =>
                                setEventTypeSelection((prevState) => ({ ...prevState, [key]: e.target.checked }))
                            }
                        />
                        <label htmlFor={key}>{capitalize(eventTypeToName[key as EventType])}</label>
                    </li>
                ))}
            </ul>
        </Base>
    )
}
