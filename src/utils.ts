import { DateTime } from 'luxon'

/** Extract hours out of date, adjusting for timezone. */
export function getHours(date: DateTime): number {
    return date.hour
}

/** Extract day of week out of date, adjusting for timezone. 0-based indexing starting with Monday. */
export function getDayOfWeek(date: DateTime): number {
    // Cloning with .plus(0) because otherwise Recoil, which is all about immutability,
    // complains when Luxon caches the DateTime's weekday data in an internally mutable way
    // Subtracting 1 to convert from 1-based to 0-based indexing
    return date.plus(0).weekday - 1
}

export function formatTime(date: DateTime): string {
    return date.toFormat('h:mm a')
}

export function formatDate(date: DateTime): string {
    return date.toFormat('EEE, MMM d')
}

export function utcOffsetMinutesToTimeZone(utcOffsetMinutes: number): string {
    const sign = utcOffsetMinutes > 0 ? '+' : '-'
    utcOffsetMinutes = Math.abs(utcOffsetMinutes)
    const hours = Math.floor(utcOffsetMinutes / 60)
    const minutes = Math.floor(Math.abs(utcOffsetMinutes % 60))
    const timeZone = `UTC${sign}${hours}:${minutes.toString().padStart(2, '0')}`
    return timeZone
}

export function capitalize(text: string): string {
    text = text.trim()
    return text.charAt(0).toUpperCase() + text.slice(1)
}
