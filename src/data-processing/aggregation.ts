import { DateTime } from 'luxon'

import { DataPoint, Labeling } from '../components/Graph'
import { Event } from '../github-api'
import { formatDate, getDayOfWeek, getHours } from '../utils'

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
    // Cloning created_ats to avoid same internal mutability problems as with getDayOfWeek
    const eventCreatedAts: DateTime[] = events.map((event) => event.created_at.plus(0))
    const eventCreatedAtValues = eventCreatedAts.map((createdAt) => createdAt.toMillis())

    const earliestDateTime = DateTime.fromMillis(Math.min(...eventCreatedAtValues))
    const latestDateTime = DateTime.fromMillis(Math.max(...eventCreatedAtValues))
    const earliestWeekStart = earliestDateTime.startOf('week')
    const latestWeekStart = latestDateTime.startOf('week')

    const today = DateTime.local().startOf('day')

    const dataPointMap: Map<string, number> = new Map()
    let nextWeekStart = earliestWeekStart
    while (nextWeekStart <= latestWeekStart) {
        let thisWeekStart = nextWeekStart
        if (mode === WeekAggregationMode.Weekend) {
            thisWeekStart = thisWeekStart.plus({ days: 5 })
        }
        if (thisWeekStart > today) {
            // Skip future buckets – particularly relevant for weekend aggregation due to above addition of 5 days
            break
        }
        dataPointMap.set(formatDate(thisWeekStart), 0)
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
        const eventWeekString = formatDate(eventWeek)
        dataPointMap.set(eventWeekString, dataPointMap.get(eventWeekString)! + 1)
    }

    return Array.from(dataPointMap.entries())
}

export enum AggregationBy {
    Hour,
    DayOfWeek,
    Workweek,
    Weekend
}

export const aggregationFunctionMapping: Record<AggregationBy, (events: Event[]) => DataPoint[]> = {
    [AggregationBy.Hour]: aggregateByHour,
    [AggregationBy.DayOfWeek]: aggregateByDayOfWeek,
    [AggregationBy.Workweek]: (events) => aggregateByWeek(events, WeekAggregationMode.Workweek),
    [AggregationBy.Weekend]: (events) => aggregateByWeek(events, WeekAggregationMode.Weekend)
}

const HOUR_NUMBERS: number[] = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const HOURS: string[] = HOUR_NUMBERS.map((hour) => `${hour} AM`).concat(HOUR_NUMBERS.map((hour) => `${hour} PM`))
const DAYS_OF_WEEK: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const aggregationLabelingMapping: Record<AggregationBy, Labeling | undefined> = {
    [AggregationBy.Hour]: HOURS,
    [AggregationBy.DayOfWeek]: DAYS_OF_WEEK,
    [AggregationBy.Workweek]: undefined,
    [AggregationBy.Weekend]: undefined
}
