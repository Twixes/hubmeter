import { atom, selectorFamily, DefaultValue } from 'recoil'
import { User, EventType, Event } from './github-api'

export const showGHAPIErrorNoticeState = atom<boolean>({
  key: 'showGHAPIErrorNotice',
  default: false
})

export const show404ErrorNoticeState = atom<boolean>({
  key: 'show404ErrorNotice',
  default: false
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
