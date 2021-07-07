import { atom, selectorFamily } from 'recoil'

import { filterByEventType } from './data-processing/filtration'
import { transformUsingTimeZone } from './data-processing/transformation'
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

export const timeZoneUtcOffsetState = atom<number>({
    key: 'timeZoneUtcOffset',
    default: -new Date().getTimezoneOffset()
})

export const eventTypeSelectionState = atom<Record<EventType, boolean>>({
    key: 'eventTypeSelectionState',
    default: Object.fromEntries(Object.keys(EventType).map((key) => [key, true])) as Record<EventType, boolean>
})

export const userEventsSelector = selectorFamily<Event[] | null, { login: string }>({
    key: 'userEvents',
    get:
        ({ login }) =>
        ({ get }) => {
            if (!login) return null
            const userEvents = get(loginToUserEventsState).get(login)
            if (!userEvents) return null
            return userEvents
        },
    set:
        ({ login }) =>
        ({ set }, newEvents) => {
            if (login)
                set(loginToUserEventsState, (prevState) => {
                    const newState = new Map(prevState)
                    newState.set(login, newEvents as Event[])
                    return newState
                })
        }
})

export const userEventsProcessedSelector = selectorFamily<Event[] | null, { login: string }>({
    key: 'userEventsProcessed',
    get:
        ({ login }) =>
        ({ get }) => {
            const userEvents = get(userEventsSelector({ login }))
            console.log(get(loginToUserEventsState))
            if (!userEvents) return null
            const eventTypeSelection = get(eventTypeSelectionState)
            const timeZoneUtcOffset = get(timeZoneUtcOffsetState)
            const filteredUserEvents = filterByEventType(userEvents, eventTypeSelection)
            const transformedUserEvents = transformUsingTimeZone(filteredUserEvents, timeZoneUtcOffset)
            return transformedUserEvents
        }
})
