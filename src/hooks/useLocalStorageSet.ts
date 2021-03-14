import { useCallback, useEffect, useState } from 'react'

type ToggleItem<T> = (key: T, include: boolean) => void

export function useLocalStorageSet<T>(key: string): [Set<T>, ToggleItem<T>] {
    const readValue: () => Set<T> = () => {
        const item = window.localStorage.getItem(key)
        return item ? new Set(JSON.parse(item)) : new Set()
    }

    const [storedValue, setStoredValue] = useState(readValue)

    const toggleItem = useCallback<ToggleItem<T>>(
        (item, include) => {
            const newSet = new Set(storedValue)
            if (include) newSet.add(item)
            else newSet.delete(item)
            window.localStorage.setItem(key, JSON.stringify(Array.from(newSet)))
            setStoredValue(newSet)
            window.dispatchEvent(new StorageEvent('storage'))
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
        window.addEventListener('storage', handleStorageChange)
        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return [storedValue, toggleItem]
}
