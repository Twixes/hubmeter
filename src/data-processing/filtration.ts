import { Event, EventType } from '../github-api'

export type Filterable = Pick<Event, 'type'>

export function filterByEventType<T extends Filterable>(events: T[], only?: Set<EventType> | EventType[]): T[] {
    if (!only) return events
    const onlySet: Set<EventType> = Array.isArray(only) ? new Set(only) : only
    if (!onlySet.size) return []
    return events.filter(({ type }) => onlySet.has(type))
}
