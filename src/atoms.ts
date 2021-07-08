import { atom, selector, selectorFamily } from 'recoil'

import { DataPoint } from './components/Graph'
import { AggregationBy, aggregationFunctionMapping } from './data-processing/aggregation'
import { filterByEventType } from './data-processing/filtration'
import { transformUsingTimeZone } from './data-processing/transformation'
import { Event, EventType, fetchUser, fetchUserEventsAll, User } from './github-api'

// User inferred from URL

export const currentLoginState = atom<string | null>({
    key: 'currentLogin',
    default: null
})

export const currentUserState = selector<User | null>({
    key: 'currentUser',
    get: async ({ get }) => {
        const currentLogin = get(currentLoginState)
        if (!currentLogin) return null
        return await fetchUser(currentLogin)
    }
})

// Event data processing settings

export const eventTypeSelectionState = atom<Record<EventType, boolean>>({
    key: 'eventTypeSelectionState',
    default: Object.fromEntries(Object.keys(EventType).map((key) => [key, true])) as Record<EventType, boolean>
})

export const timeZoneUtcOffsetState = atom<number>({
    key: 'timeZoneUtcOffset',
    default: -new Date().getTimezoneOffset()
})

// Event data

export const userEventsState = selector<Event[] | null>({
    key: 'userEvents',
    get: async ({ get }) => {
        const currentUser = get(currentUserState)
        if (!currentUser) return null
        return await fetchUserEventsAll(currentUser.login)
    }
})

export const aggregatedDataPointsState = selectorFamily<DataPoint[], AggregationBy>({
    key: 'aggregatedDataPoints',
    get:
        (aggregationBy) =>
        ({ get }) => {
            const userEvents = get(userEventsState) || []
            const eventTypeSelection = get(eventTypeSelectionState)
            const timeZoneUtcOffset = get(timeZoneUtcOffsetState)
            const filteredUserEvents = filterByEventType(userEvents, eventTypeSelection)
            const transformedUserEvents = transformUsingTimeZone(filteredUserEvents, timeZoneUtcOffset)
            const aggregationFunction = aggregationFunctionMapping[aggregationBy]
            return aggregationFunction(transformedUserEvents)
        }
})
