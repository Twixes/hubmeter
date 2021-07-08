/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import { ErrorBoundary } from '@sentry/react'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactChild, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'

import { currentLoginState } from '../atoms'
import Controls from '../features/Controls/Controls'
import Statistics from '../features/Statistics/Statistics'
import { breakpointWidthTablet, widthControl } from '../styles'
import { updatePageTitle } from '../utils'
import { Params } from './App'
import Notice from './Notice'

const QUESTIONS: string[] = [
    // "Does ${subject} ${question}?"
    'release on Friday',
    'pull all-nighters',
    'work the night shift',
    'git up at the crack of dawn',
    'code on weekends',
    'commit at high noon',
    'push in the morning',
    'even have a life'
]

function HomeHeadline({ visible, children }: { visible: boolean; children: ReactChild }): JSX.Element | null {
    return !visible ? null : (
        <AnimatePresence>
            <motion.h1
                variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
                style={{ margin: '0.5rem 0' }}
                initial="hidden"
                animate="shown"
                exit="hidden"
                layout
            >
                {children}
            </motion.h1>
        </AnimatePresence>
    )
}

export const main = css`
    display: flex;
    flex-direction: column;
    padding-top: 0.75rem;
    @media screen and (min-width: ${breakpointWidthTablet}) {
        padding-top: 4rem;
        padding-bottom: 3.5rem;
    }
`

export default function Main(): JSX.Element {
    const { login: paramLogin } = useParams<Params>()

    const [currentLogin, setCurrentLogin] = useRecoilState(currentLoginState)
    const errorResetCallback = useRef<(() => void) | null>(null)

    const [randomQuestion, setRandomQuestion] = useState(QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)])

    useEffect(() => {
        errorResetCallback.current?.()
        errorResetCallback.current = null
        setCurrentLogin(paramLogin?.toLowerCase() || null)
        setRandomQuestion(QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)])
        updatePageTitle(paramLogin ? `${paramLogin} – HubMeter` : 'HubMeter')
    }, [paramLogin, currentLogin, setCurrentLogin, errorResetCallback])

    return (
        <motion.main
            css={[widthControl, main]}
            style={{ flexGrow: paramLogin ? 1 : 0 }}
            animate={{ flexGrow: paramLogin ? 1 : 0 }}
        >
            <HomeHeadline visible={!paramLogin}>Does</HomeHeadline>
            <Controls />
            <HomeHeadline visible={!paramLogin}>{`…${randomQuestion}?`}</HomeHeadline>

            <ErrorBoundary
                fallback={({ error, resetError }) => {
                    errorResetCallback.current = resetError
                    return <Notice message={error.message} />
                }}
            >
                {paramLogin ? <Statistics /> : null}
            </ErrorBoundary>
        </motion.main>
    )
}
