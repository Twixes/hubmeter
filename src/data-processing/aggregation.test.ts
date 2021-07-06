/* eslint-env jest */

import { DateTime } from 'luxon'

import {
    Aggregatable,
    aggregateByDayOfWeek,
    aggregateByHour,
    aggregateByWeek,
    WeekAggregationMode
} from './aggregation'

const testEvents: Aggregatable[] = [
    {
        created_at: DateTime.fromISO('2021-03-14T21:09')
    },
    {
        created_at: DateTime.fromISO('2021-03-12T21:54')
    },
    {
        created_at: DateTime.fromISO('2021-03-14T20:20')
    }
]

describe('#aggregateByHour()', () => {
    it('should aggregate events by hour into data points', () => {
        const results = aggregateByHour(testEvents)

        expect(results).toStrictEqual([
            [0, 0],
            [1, 0],
            [2, 0],
            [3, 0],
            [4, 0],
            [5, 0],
            [6, 0],
            [7, 0],
            [8, 0],
            [9, 0],
            [10, 0],
            [11, 0],
            [12, 0],
            [13, 0],
            [14, 0],
            [15, 0],
            [16, 0],
            [17, 0],
            [18, 0],
            [19, 0],
            [20, 1],
            [21, 2],
            [22, 0],
            [23, 0]
        ])
    })
})

describe('#aggregateByDayOfWeek()', () => {
    it('should aggregate events by day of week into data points', () => {
        const results = aggregateByDayOfWeek(testEvents)

        expect(results).toStrictEqual([
            [0, 0], // Mon
            [1, 0], // Tue
            [2, 0], // Wed
            [3, 0], // Thu
            [4, 1], // Fri
            [5, 0], // Sat
            [6, 2] // Sun
        ])
    })
})

describe('#aggregateByWeek()', () => {
    it('should aggregate events by workweek into data points', () => {
        const results = aggregateByWeek(testEvents, WeekAggregationMode.Workweek)

        expect(results).toStrictEqual([['Mon, Mar 8', 1]])
    })

    it('should aggregate events by weekend into data points', () => {
        const results = aggregateByWeek(testEvents, WeekAggregationMode.Weekend)

        expect(results).toStrictEqual([['Sat, Mar 13', 2]])
    })
})
