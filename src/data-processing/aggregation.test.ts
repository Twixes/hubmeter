/* eslint-env jest */

import { Aggregatable, aggregateByDayOfWeek, aggregateByHour } from './aggregation'

const testEvents: Aggregatable[] = [
    {
        created_at: new Date('2021-03-14 21:09Z')
    },
    {
        created_at: new Date('2021-03-12 21:54Z')
    },
    {
        created_at: new Date('2021-03-14 20:20Z')
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
            [0, 0],
            [1, 0],
            [2, 0],
            [3, 0],
            [4, 1],
            [5, 0],
            [6, 2]
        ])
    })
})
