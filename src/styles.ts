import { css } from '@emotion/react'

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
