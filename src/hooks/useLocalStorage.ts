import { useCallback, useEffect, useState } from 'react'

type Setter<T> = (currentValue: T) => T
type NewValueOrSetter<T> = T | Setter<T>

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (newValueOrSetter: NewValueOrSetter<T>) => void] {
    const readValue = useCallback<() => T>(() => {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : defaultValue
    }, [key, defaultValue])

    const [storedValue, setStoredValue] = useState(readValue)

    const setNewValue = useCallback<(newValueOrSetter: NewValueOrSetter<T>) => void>(
        (newValueOrSetter) => {
            const newValue: T =
                typeof newValueOrSetter === 'function' ? (newValueOrSetter as Setter<T>)(storedValue) : newValueOrSetter
            window.localStorage.setItem(key, JSON.stringify(newValue))
            setStoredValue(newValue)
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

    return [storedValue, setNewValue]
}
