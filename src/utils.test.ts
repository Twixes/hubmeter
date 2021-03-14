/* eslint-env jest */

import { capitalize, formatTime } from './utils'

describe('formatTime()', () => {
    it('formats a PM hour nicely', () => {
        const date = new Date('2018-02-22 16:47Z')

        expect(formatTime(date)).toEqual('4:47 PM')
    })
    it('formats an AM hour nicely', () => {
        const date = new Date('2018-02-22 03:02Z')

        expect(formatTime(date)).toEqual('3:02 AM')
    })
})

describe('capitalize()', () => {
    it('returns the capitalized string', () => {
        expect(capitalize('jane')).toEqual('Jane')
        expect(capitalize('  hello there! ')).toEqual('Hello there!')
        expect(capitalize('underscores_make_no_difference')).toEqual('Underscores_make_no_difference')
    })
})
