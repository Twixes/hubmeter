/* eslint-env jest */

import { Aggregatable, aggregateByDayOfWeek, aggregateByHour, aggregateByWeek } from './data-processing'

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

describe('#aggregateByWeek()', () => {
    it('should aggregate events by day of week into data points', () => {
        const results = aggregateByWeek(testEvents)

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
            [10, 3],
            [11, 0],
            [12, 0],
            [13, 0],
            [14, 0],
            [15, 0],
            [16, 0],
            [17, 0],
            [18, 0],
            [19, 0],
            [20, 0],
            [21, 0],
            [22, 0],
            [23, 0],
            [24, 0],
            [25, 0],
            [26, 0],
            [27, 0],
            [28, 0],
            [29, 0],
            [30, 0],
            [31, 0],
            [32, 0],
            [33, 0],
            [34, 0],
            [35, 0],
            [36, 0],
            [37, 0],
            [38, 0],
            [39, 0],
            [40, 0],
            [41, 0],
            [42, 0],
            [43, 0],
            [44, 0],
            [45, 0],
            [46, 0],
            [47, 0],
            [48, 0],
            [49, 0],
            [50, 0],
            [51, 0]
        ])
    })
})
