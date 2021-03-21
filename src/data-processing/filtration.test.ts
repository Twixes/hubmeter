/* eslint-env jest */

import { EventType } from '../github-api'
import { Filterable, filterByEventType } from './filtration'

const testEvents: Filterable[] = [
    {
        type: EventType.PullRequestEvent
    },
    {
        type: EventType.IssuesEvent
    },
    {
        type: EventType.PullRequestEvent
    },
    {
        type: EventType.PushEvent
    }
]

describe('#filterByEventType()', () => {
    it('should return all events if no filter provided', () => {
        const results = filterByEventType(testEvents)

        expect(results).toStrictEqual(testEvents)
    })
    it('should return no events if provided filter allows no event type', () => {
        const results = filterByEventType(testEvents, {})

        expect(results).toHaveLength(0)
    })
    it('should return only events of types allowed by provided filter', () => {
        const results = filterByEventType(testEvents, {
            [EventType.PullRequestEvent]: true,
            [EventType.PushEvent]: true
        })

        expect(results).toStrictEqual([
            {
                type: EventType.PullRequestEvent
            },
            {
                type: EventType.PullRequestEvent
            },
            {
                type: EventType.PushEvent
            }
        ])
    })
    it('should return no events if no types allowed by provided filter are in input', () => {
        const results = filterByEventType(testEvents, { [EventType.SponsorshipEvent]: true })

        expect(results).toHaveLength(0)
    })
})
