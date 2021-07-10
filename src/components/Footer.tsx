/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'

import { breakpointWidthTablet, widthControl } from '../styles'

const footer = css`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 4rem;
    padding-bottom: 0.75rem;
    color: var(--color-foreground-dim);
    text-align: center;
    & br {
        display: none;
        @media screen and (min-width: ${breakpointWidthTablet}) {
            display: block;
        }
    }
`

export default function Footer(): JSX.Element {
    return (
        <footer css={[widthControl, footer]}>
            <span>
                GitHub&nbsp;activity stats you&nbsp;haven't seen&nbsp;before. <br />
                By&nbsp;<a href="https://matloka.com">Michael Matloka</a>.&nbsp;👋
            </span>
        </footer>
    )
}
