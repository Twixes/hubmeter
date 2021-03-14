import { useCallback, useEffect, useState } from 'react'

type ToggleItem<T> = (key: T, include: boolean) => void

export default function useLocalStorageSet<T>(key: string): [Set<T>, ToggleItem<T>] {
    // Get from local storage then parse stored json or return initialValue
    const readValue: () => Set<T> = () => {
        const item = window.localStorage.getItem(key)
        return item ? new Set(JSON.parse(item)) : new Set()
    }

    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(readValue)

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const toggleItem = useCallback<ToggleItem<T>>(
        (item, include) => {
            const newSet = new Set(storedValue)
            if (include) newSet.add(item)
            else newSet.delete(item)

            // Save to local storage
            window.localStorage.setItem(key, JSON.stringify(Array.from(newSet)))

            // Save state
            setStoredValue(newSet)

            // We dispatch a custom event so every useLocalStorage hook are notified
            window.dispatchEvent(new Event('local-storage'))
        },
        [key, storedValue]
    )

    useEffect(() => {
        setStoredValue(readValue())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const handleStorageChange = () => {
            setStoredValue(readValue())
        }

        // this only works for other documents, not the current one
        window.addEventListener('storage', handleStorageChange)

        // this is a custom event, triggered in writeValueToLocalStorage
        window.addEventListener('local-storage', handleStorageChange)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('local-storage', handleStorageChange)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return [storedValue, toggleItem]
}
