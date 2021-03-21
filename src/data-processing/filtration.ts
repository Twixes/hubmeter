import { Event, EventType } from '../github-api'

export type Filterable = Pick<Event, 'type'>

export function filterByEventType<T extends Filterable>(events: T[], only?: Partial<Record<EventType, boolean>>): T[] {
    return only ? events.filter(({ type }) => only[type]) : events
}
