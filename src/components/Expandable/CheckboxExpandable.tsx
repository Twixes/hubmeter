/** @jsxImportSource @emotion/react */

import { CSSProperties } from 'react'

import { EventType, eventTypeToName } from '../../github-api'
import { capitalize } from '../../utils'
import { Base } from './Base'

export interface CheckboxExpandableProps {
    label: string
    itemLabels: Record<string, string>
    selectionState: Record<string, boolean>
    onSelect: (selectedItem: string, isChecked: boolean) => void
    style?: CSSProperties
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

export function CheckboxExpandable({
    label,
    itemLabels,
    selectionState,
    onSelect,
    style
}: CheckboxExpandableProps): JSX.Element {
    return (
        <Base
            label={label}
            summary={humanizeAllowedEventTypes(selectionState)}
            summaryExtended={humanizeAllowedEventTypes(selectionState, false)}
            style={style}
        >
            <ul>
                {Object.entries(selectionState).map(([value, isChecked], index) => (
                    <li key={value} tabIndex={index + 1}>
                        <input
                            id={value}
                            type="checkbox"
                            checked={isChecked as boolean}
                            onChange={(e) => onSelect(value, e.target.checked)}
                        />
                        <label htmlFor={value}>{capitalize(itemLabels[value])}</label>
                    </li>
                ))}
            </ul>
        </Base>
    )
}
