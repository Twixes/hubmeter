import { atom, DefaultValue, selectorFamily } from 'recoil'

import { Event, EventType, User } from './github-api'

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

export const eventTypesFilterState = atom<Set<EventType> | null>({
    key: 'eventTypesFilter',
    default: null
})

export const userEventsState = selectorFamily<Event[] | undefined, { login: string }>({
    key: 'userEvents',
    get:
        ({ login }) =>
        ({ get }) => {
            if (!login) return undefined
            const userEvents = get(loginToUserEventsState).get(login)
            const eventTypesFilter = get(eventTypesFilterState)
            if (!userEvents || !eventTypesFilter) return userEvents
            return userEvents.filter((event: Event) => eventTypesFilter.has(event.type))
        },
    set:
        ({ login }) =>
        ({ set }, newEvents: Event[] | undefined | DefaultValue) => {
            if (login)
                set(loginToUserEventsState, (prevState) => {
                    const newState = new Map(prevState)
                    newState.set(login, newEvents as Event[])
                    return newState
                })
        }
})
