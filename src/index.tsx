import 'sanitize.css'
import 'sanitize.css/forms.css'
import 'sanitize.css/typography.css'
import 'focus-visible'
import './index.scss'

import * as Sentry from '@sentry/browser'
import posthog from 'posthog-js'
import React from 'react'
import { CookiesProvider } from 'react-cookie'
import ReactDOM from 'react-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import App from './components/App'

Sentry.init({ dsn: 'https://eaa5d3bc32f640ceb2f8090656940497@o173795.ingest.sentry.io/5288711' })
posthog.init('AfWAhZKo9pPPH8blum1SKbPAWPixyRGOuaxC_laQNAc', { api_host: 'https://app.posthog.com' })

ReactDOM.render(
    <React.StrictMode>
        <ErrorBoundary
            fallback={
                <h1>
                    An error occurred and has been registered for analysis.
                    <br />
                    Please reload the page.
                </h1>
            }
        >
            <RecoilRoot>
                <CookiesProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </CookiesProvider>
            </RecoilRoot>
        </ErrorBoundary>
    </React.StrictMode>,
    document.getElementById('root')
)
