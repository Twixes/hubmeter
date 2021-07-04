import { DateTime } from 'luxon'

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

export enum WeekAggregationMode {
    Total,
    Workweek,
    Weekend
}

export function aggregateByWeek(events: Aggregatable[], mode: WeekAggregationMode): DataPoint[] {
    const eventCreatedAtValues = events.map((event) => event.created_at.toMillis())
    const earliestDateTime = DateTime.fromMillis(Math.min(...eventCreatedAtValues))
    const latestDateTime = DateTime.fromMillis(Math.max(...eventCreatedAtValues))
    const earliestWeekStart = earliestDateTime.startOf('week')
    const latestWeekStart = latestDateTime.startOf('week')
    const eventCreatedAts = eventCreatedAtValues.map((value) => DateTime.fromMillis(value))
    const dataPointMap: Map<string, number> = new Map()
    let nextWeekStart = earliestWeekStart
    while (nextWeekStart <= latestWeekStart) {
        let thisWeekStart = nextWeekStart
        if (mode === WeekAggregationMode.Weekend) {
            thisWeekStart = thisWeekStart.plus({ days: 5 })
        }
        dataPointMap.set(thisWeekStart.toISODate(), 0)
        nextWeekStart = nextWeekStart.plus({ weeks: 1 })
    }
    for (const createdAt of eventCreatedAts) {
        if (mode === WeekAggregationMode.Weekend) {
            if (createdAt.weekday <= 5) continue
        } else if (mode === WeekAggregationMode.Workweek) {
            if (createdAt.weekday > 5) continue
        }
        let eventWeek = createdAt.startOf('week')
        if (mode === WeekAggregationMode.Weekend) {
            eventWeek = eventWeek.plus({ days: 5 })
        }
        const eventWeekString = eventWeek.toISODate()
        dataPointMap.set(eventWeekString, dataPointMap.get(eventWeekString)! + 1)
    }
    return Array.from(dataPointMap.entries())
}
