import { DataPoint } from '../components/Graph'
import { Event } from '../github-api'

export type Aggregatable = Pick<Event, 'created_at'>

function getHours(date: Date): number {
    return date.getUTCHours()
}

function getDayOfWeek(date: Date): number {
    const dayOfWeekSundayInitial = date.getUTCDay()
    // JS uses Sunday as the initial day of the week, IMO Monday is a saner choice
    const dayOfWeekMondayInitial = dayOfWeekSundayInitial ? dayOfWeekSundayInitial - 1 : 6
    return dayOfWeekMondayInitial
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
