/** @jsxImportSource @emotion/react */

import { CSSProperties, useMemo } from 'react'

import { Base } from './Base'

export interface Possibility<T extends string | number> {
    value: T
    label: string
}

export interface RadioExpandableProps<T extends string | number> {
    label: string
    possibilities: Possibility<T>[]
    selectedValue: Possibility<T>['value'] | null
    onChange: (selectedPossibility: Possibility<T> | null) => void
    style?: CSSProperties
}

export function RadioExpandable<T extends string | number>({
    label,
    possibilities,
    selectedValue,
    onChange,
    style
}: RadioExpandableProps<T>): JSX.Element {
    const selectedPossibility = useMemo<Possibility<T> | null>(
        () => possibilities.find((possibility) => possibility.value === selectedValue) || null,
        [possibilities, selectedValue]
    )

    return (
        <Base label={label} summary={selectedPossibility?.label || <i>Select an option</i>} style={style}>
            <ul>
                {possibilities.map((thisPossibility, index) => {
                    const { value, label } = thisPossibility
                    const inputId = value.toString()
                    return (
                        <li key={value} tabIndex={index + 1}>
                            <input
                                id={inputId}
                                type="radio"
                                name={label}
                                checked={!!selectedPossibility && value === selectedPossibility.value}
                                onChange={(e) => {
                                    if (
                                        e.target.checked &&
                                        (!selectedPossibility || value !== selectedPossibility.value)
                                    ) {
                                        onChange?.(thisPossibility)
                                    }
                                }}
                            />
                            <label htmlFor={inputId}>{label}</label>
                        </li>
                    )
                })}
            </ul>
        </Base>
    )
}
