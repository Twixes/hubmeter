import { css } from '@emotion/react'

export const breakpointWidthTablet = '38rem'
export const breakpointWidthLaptop = '78rem'
export const breakpointWidthDesktop = '118rem'

export const expandableExpandedTop = css({ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 })
export const expandableExpandedBottom = css({ borderTopLeftRadius: 0, borderTopRightRadius: 0 })

export const card = css({
    transition: 'border-radius var(--duration-short) var(--timing-function-standard)',
    display: 'flex',
    padding: '0 0.75rem',
    margin: 0,
    borderRadius: '0.5rem',
    background: 'var(--color-foreground)',
    color: 'var(--color-accent)',
    boxShadow:
        '0 0 0.09375rem var(--color-shadow), 0 0.125rem 0.1875rem var(--color-shadow), 0 0.25rem 0.375rem var(--color-shadow), 0 0.5rem 0.75rem var(--color-shadow), 0 1rem 1.5rem var(--color-shadow)'
})

export const widthControl = css({
    margin: '0 auto',
    width: '100%',
    maxWidth: '120rem',
    paddingLeft: '0.75rem',
    paddingRight: '0.75rem',
    [`@media screen and (min-width: ${breakpointWidthTablet})`]: {
        paddingLeft: '4rem',
        paddingRight: '4rem'
    },
    [`@media screen and (min-width: ${breakpointWidthLaptop})`]: {
        paddingLeft: '8rem',
        paddingRight: '8rem'
    },
    [`@media screen and (min-width: ${breakpointWidthDesktop})`]: {
        paddingLeft: '12rem',
        paddingRight: '12rem'
    }
})
