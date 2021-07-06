/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import { motion } from 'framer-motion'
import React from 'react'

import { breakpointWidthTablet, widthControl } from '../styles'

const footer = css`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 4rem;
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
        <motion.footer css={[widthControl, footer]} layout>
            <span>
                GitHub&nbsp;activity insights you&nbsp;haven't seen&nbsp;before. <br />
                By&nbsp;<a href="https://matloka.com">Michael Matloka</a>.&nbsp;👋
            </span>
        </motion.footer>
    )
}
