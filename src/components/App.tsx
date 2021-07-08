/** @jsxImportSource @emotion/react */

import { ErrorBoundary } from '@sentry/react'
import { FallbackRender } from '@sentry/react/dist/errorboundary'
import posthog from 'posthog-js'
import { Route, useHistory } from 'react-router-dom'

import { widthControl } from '../styles'
import Footer from './Footer'
import Header from './Header'
import Main, { main } from './Main'
import Notice from './Notice'

export interface Params {
    login: string | undefined
}

const ErrorMain: FallbackRender = ({ error }) => {
    return (
        <div css={[widthControl, main]} style={{ flexGrow: 1 }}>
            <Notice
                message={
                    <>
                        An unexpected error occurred: <i>{error.message}</i> Please reload the page.
                    </>
                }
                action={{ icon: '⟳', callback: () => document.location.reload() }}
            ></Notice>
        </div>
    )
}

export default function App(): JSX.Element {
    const history = useHistory()

    history.listen(() => {
        posthog.capture('$pageview')
    })

    return (
        <ErrorBoundary fallback={ErrorMain}>
            <Header />
            <Route path="/:login?" component={Main} />
            <Footer />
        </ErrorBoundary>
    )
}
