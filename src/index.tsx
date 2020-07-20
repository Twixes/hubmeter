import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { CookiesProvider } from 'react-cookie'
import { ErrorBoundary } from 'react-error-boundary'
import { RecoilRoot } from 'recoil'
import * as Sentry from '@sentry/browser'
import posthog from 'posthog-js'
import 'sanitize.css'
import 'sanitize.css/forms.css'
import 'sanitize.css/typography.css'
import 'focus-visible'
import App from './components/App'
import './index.scss'

Sentry.init({ dsn: 'https://eaa5d3bc32f640ceb2f8090656940497@o173795.ingest.sentry.io/5288711' })
posthog.init('AfWAhZKo9pPPH8blum1SKbPAWPixyRGOuaxC_laQNAc', { api_host: 'https://app.posthog.com' })

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary fallback={<h1>An error occurred. Reload the page.</h1>}>
      <RecoilRoot>
        <CookiesProvider>
          <BrowserRouter>
            <App/>
          </BrowserRouter>
        </CookiesProvider>
      </RecoilRoot>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
)
