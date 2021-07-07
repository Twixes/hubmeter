import { css, keyframes } from '@emotion/react'

import { breakpointWidthTablet } from '../../styles'

const bounce = keyframes`
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(-0.25em);
    }
`

export const controlsGrid = css({
    display: 'grid',
    gap: '0.75rem',
    [`@media screen and (min-width: ${breakpointWidthTablet})`]: { gridTemplateColumns: 'repeat(2, 1fr)' }
})

export const controls = css`
    z-index: 10;
    display: grid;
    grid-auto-flow: row;
    gap: 0.75rem;
    position: relative;
    border-radius: 0.5rem;
`

export const controlsIndicator = css`
    transition: opacity var(--duration-short) var(--timing-function-standard);
    opacity: var(--opacity-dim);
    font-size: 1.125rem;
    text-align: center;
    line-height: 1.5rem;
    height: 1.5rem;
    width: 1.5rem;
    border-radius: 0.25rem;
    overflow: hidden;
    user-select: none;
    & > div {
        height: 100%;
        width: 100%;
        border-radius: 0.25rem;
    }
`

export const controlsIndicatorAvatar = css`
    background-size: contain;
    background-repeat: no-repeat;
`

export const controlsIndicatorSolid = css`
    background: var(--color-accent);
    color: var(--color-foreground);
`

export const controlsIndicatorTyping = css`
    & span {
        animation: ${bounce} calc(var(--duration-long) / 2) cubic-bezier(0.1, 0, 0.5, 1) infinite alternate;
        display: inline-block;
        &:nth-of-type(2) {
            animation-delay: calc(var(--duration-long) / 15);
        }
        &:nth-of-type(3) {
            animation-delay: calc(var(--duration-long) / 15 * 2);
        }
    }
`

export const controlsLogin = css`
    flex-grow: 1;
    width: 0;
    height: 3rem;
    padding: 0;
    margin-left: 0.75rem;
    line-height: 3rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    &::placeholder {
        color: var(--color-accent-dim);
        opacity: 1;
    }
`

export const controlsSearch = css({
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 0
})

export const controlsSearchButton = css({
    transition:
        'background var(--duration-short) var(--timing-function-standard), color var(--duration-short) var(--timing-function-standard)',
    padding: 0,
    height: '3rem',
    width: '3rem',
    textAlign: 'center',
    lineHeight: '3rem',
    userSelect: 'none',
    cursor: 'pointer',
    '&:not(:disabled):active': {
        background: 'var(--color-accent)',
        color: 'var(--color-foreground)'
    },
    '&:disabled': {
        opacity: 'var(--opacity-dim)',
        cursor: 'default'
    }
})
