import { Event, EventType } from '../github-api'

export type Filterable = Pick<Event, 'type'>

export function filterByEventType(events: Filterable[], only?: Set<EventType> | EventType[]): Filterable[] {
    if (!only) return events
    const onlySet: Set<EventType> = Array.isArray(only) ? new Set(only) : only
    if (!onlySet.size) return []
    return events.filter(({ type }) => onlySet.has(type))
}
