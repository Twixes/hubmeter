import { DataPoint } from '../components/Graph'
import { Event } from '../github-api'
import { getDayOfWeek, getHours } from '../utils'

export type Aggregatable = Pick<Event, 'created_at'>

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

export function aggregateByWorkweek(events: Aggregatable[]): DataPoint[] {
    const dataPointMap: Map<number, number> = new Map([...Array(7).keys()].map((n) => [n, 0]))
    for (const { created_at } of events) {
        const dayOfWeek = getDayOfWeek(created_at)
        dataPointMap.set(dayOfWeek, dataPointMap.get(dayOfWeek)! + 1)
    }
    return Array.from(dataPointMap.entries())
}
