/* eslint-env jest */

import { capitalize } from './utils'

describe('capitalize()', () => {
    it('returns the capitalized string', () => {
        expect(capitalize('jane')).toEqual('Jane')
        expect(capitalize('  hello there! ')).toEqual('Hello there!')
        expect(capitalize('underscores_make_no_difference')).toEqual('Underscores_make_no_difference')
    })
})
