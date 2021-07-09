/** @jsxImportSource @emotion/react */

import { CSSProperties, useMemo } from 'react'

import { Base } from './Base'

export interface RadioItem<T extends string | number> {
    value: T
    label: string
}

export interface RadioExpandableProps<T extends string | number> {
    label: string
    items: RadioItem<T>[]
    selectedValue: RadioItem<T>['value'] | null
    onSelect: (selectedItem: RadioItem<T> | null) => void
    style?: CSSProperties
}

export function RadioExpandable<T extends string | number>({
    label,
    items,
    selectedValue,
    onSelect,
    style
}: RadioExpandableProps<T>): JSX.Element {
    const selectedItem = useMemo<RadioItem<T> | null>(
        () => items.find((item) => item.value === selectedValue) || null,
        [items, selectedValue]
    )

    return (
        <Base label={label} summary={selectedItem?.label || <i>Select an option</i>} style={style}>
            <ul>
                {items.map((thisItem, index) => {
                    const { value, label } = thisItem
                    const inputId = value.toString()
                    return (
                        <li key={value} tabIndex={index + 1}>
                            <input
                                id={inputId}
                                type="radio"
                                name={label}
                                checked={!!selectedItem && value === selectedItem.value}
                                onChange={(e) => {
                                    if (e.target.checked && (!selectedItem || value !== selectedItem.value)) {
                                        onSelect(thisItem)
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
