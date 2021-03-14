import { RefObject, useEffect } from 'react'

export function useOutsideClickHandler(ref: RefObject<HTMLElement>, handleClickOutside: () => void): void {
    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) handleClickOutside()
        }
        document.addEventListener('mousedown', handleClick)
        return () => {
            document.removeEventListener('mousedown', handleClick)
        }
    }, [ref, handleClickOutside])
}

/** Extract hours out of date, adjusting for timezone. */
export function getHours(date: Date): number {
    return date.getUTCHours()
}

/** Extract day of week out of date, adjusting for timezone. */
export function getDayOfWeek(date: Date): number {
    const dayOfWeekSundayInitial = date.getUTCDay()
    // JS uses Sunday as the initial day of the week, IMO Monday is a saner choice
    const dayOfWeekMondayInitial = dayOfWeekSundayInitial ? dayOfWeekSundayInitial - 1 : 6
    return dayOfWeekMondayInitial
}

export function formatTime(date: Date): string {
    return `${getHours(date) % 12 || 12}:${date.getMinutes().toString().padStart(2, '0')} ${
        getHours(date) >= 12 ? 'PM' : 'AM'
    }`
}

export function capitalize(text: string): string {
    text = text.trim()
    return text.charAt(0).toUpperCase() + text.slice(1)
}
