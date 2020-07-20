import { atom, selectorFamily, DefaultValue } from 'recoil'
import { User, EventType, Event } from './github-api'

export const errorMessageState = atom<string | null>({
  key: 'errorMessage',
  default: null
})

export const isCurrentUserLoadingState = atom<boolean>({
  key: 'isCurrentUserLoading',
  default: false
})

export const currentUserState = atom<User | null>({
  key: 'currentUser',
  default: null
})

export const areEventsLoadingState = atom<boolean>({
  key: 'areEventsLoading',
  default: false
})

export const loginToUserEventsState = atom<Map<string, Event[] | undefined>>({
  key: 'loginToUserEvents',
  default: new Map()
})

export const timeZoneUTCOffsetState = atom<number>({
  key: 'timeZoneUTCOffset',
  default: 0
})

export const eventTypesFilterState = atom<Set<EventType>>({
  key: 'eventTypesFilter',
  default: new Set()
})

export const userEventsState = selectorFamily<Event[] | undefined, { login: string }>({
  key: 'userEvents',
  get: ({ login }) => ({ get }) => {
    if (!login) return undefined
    const userEvents = get(loginToUserEventsState).get(login)
    const eventTypesFilter = get(eventTypesFilterState)
    if (!userEvents || !eventTypesFilter.size) return userEvents
    return userEvents.filter((event: Event) => eventTypesFilter.has(event.type))
  },
  set: ({ login }) => ({ set }, newEvents: Event[] | undefined | DefaultValue) => {
    if (login) set(loginToUserEventsState, prevState => {
      const newState = new Map(prevState)
      newState.set(login, newEvents as Event[])
      return newState
    })
  }
})
