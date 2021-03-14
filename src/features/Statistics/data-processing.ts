import { DataPoint } from '../../components/Graph'
import { Event } from '../../github-api'

export type Aggregatable = Pick<Event, 'created_at'>

const HOUR_NUMBERS: number[] = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const HOURS: string[] = HOUR_NUMBERS.map((hour) => `${hour} AM`).concat(HOUR_NUMBERS.map((hour) => `${hour} PM`))
const DAYS_OF_WEEK: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function getHours(date: Date): number {
    return date.getUTCHours()
}

export function getDayOfWeek(date: Date): number {
    const dayOfWeekSundayInitial = date.getUTCDay()
    // JS uses Sunday as the initial day of the week, IMO Monday is a saner choice
    const dayOfWeekMondayInitial = dayOfWeekSundayInitial ? dayOfWeekSundayInitial - 1 : 6
    return dayOfWeekMondayInitial
}

/** ISO 8601 week number. */
export function getWeek(date: Date): number {
    const dowOffset = 1 // First day of the week is Monday, for ISO 8601 compliance
    const newYear = new Date(date.getFullYear(), 0, 1)
    let day = newYear.getDay() - dowOffset // The day of week the year begins on
    day = day >= 0 ? day : day + 7
    const daynum =
        Math.floor(
            (date.getTime() - newYear.getTime() - (date.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) /
                86400000
        ) + 1
    let weeknum: number
    // If the year starts before the middle of a week
    if (day < 4) {
        weeknum = Math.floor((daynum + day - 1) / 7) + 1
        if (weeknum > 52) {
            const nYear = new Date(date.getFullYear() + 1, 0, 1)
            let nday = nYear.getDay() - dowOffset
            nday = nday >= 0 ? nday : nday + 7
            // If the next year starts before the middle of the week, it is week #1 of that year
            weeknum = nday < 4 ? 1 : 53
        }
    } else {
        weeknum = Math.floor((daynum + day - 1) / 7)
    }
    return weeknum
}

export function aggregateByHour(events: Aggregatable[]): DataPoint[] {
    const dataPointMap: Map<number, number> = new Map([...Array(24).keys()].map((n) => [n, 0]))
    for (const { created_at } of events) {
        const hours = getHours(created_at)
        dataPointMap.set(hours, dataPointMap.get(hours)! + 1)
    }
    return Array.from(dataPointMap.entries())
}

export function aggregateByDayOfWeek(events: Aggregatable[]): DataPoint[] {
    const dataPointMap: Map<number, number> = new Map([...Array(7).keys()].map((n) => [n, 0]))
    for (const { created_at } of events) {
        const dayOfWeek = getDayOfWeek(created_at)
        dataPointMap.set(dayOfWeek, dataPointMap.get(dayOfWeek)! + 1)
    }
    return Array.from(dataPointMap.entries())
}

export function aggregateByWeek(events: Aggregatable[]): DataPoint[] {
    const dataPointMap: Map<number, number> = new Map([...Array(52).keys()].map((n) => [n, 0]))
    for (const { created_at } of events) {
        const week = getWeek(created_at)
        dataPointMap.set(week, dataPointMap.get(week)! + 1)
    }
    return Array.from(dataPointMap.entries())
}
