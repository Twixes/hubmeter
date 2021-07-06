import { Event, EventType } from '../github-api'
import { utcOffsetMinutesToTimeZone } from '../utils'

export type Transformable = Pick<Event, 'created_at'>

export function transformUsingTimeZone<T extends Transformable>(
    events: T[],
    utcOffsetMinutes: number = new Date().getTimezoneOffset()
): T[] {
    const timeZone = utcOffsetMinutesToTimeZone(utcOffsetMinutes)
    return events.map((event) => ({ ...event, created_at: event.created_at.setZone(timeZone) } as T))
}
