import { atom, selectorFamily, DefaultValue } from 'recoil'
import { User, EventType, Event } from './api/github'

export const currentErrorMessageState = atom<string | null>({
  key: 'currentError',
  default: 'Error, something bad happened. Maybe try again later. Or never?'
})

export const currentUserState = atom<User | null>({
  key: 'currentUser',
  default: null
})

export const eventsState = atom<{ [login: string]: Event[] | undefined }>({
  key: 'events',
  default: {}
})

export const userEventsState = selectorFamily<Event[] | undefined, { login: string }>({
  key: 'userEvents',
  get: ({ login }) => ({ get }) => {
    return get(eventsState)[login]
  },
  set: ({ login }) => ({ set }, newEvents: Event[] | undefined | DefaultValue) => {
    set(eventsState, prevEventsState => { return { ...prevEventsState, [login]: newEvents } })
  }
})

export const userEventsFilteredState = selectorFamily<Event[] | undefined, { login: string, eventTypes: EventType[] }>({
  key: 'userEventsFiltered',
  get: ({ login, eventTypes }) => ({ get }) => {
    const events: Event[] | undefined = get(userEventsState({ login: login }))
    if (!eventTypes) return events
    const eventTypesSet: Set<EventType> = new Set(eventTypes)
    return events ? events.filter((event: Event) => eventTypesSet.has(event.type)) : undefined
  }
})
