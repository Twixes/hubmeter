import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import * as Sentry from '@sentry/browser';
import 'sanitize.css'
import 'sanitize.css/forms.css'
import 'sanitize.css/typography.css'
import 'focus-visible'
import App from './components/App'
import './index.scss'

Sentry.init({dsn: "https://eaa5d3bc32f640ceb2f8090656940497@o173795.ingest.sentry.io/5288711"})

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
)
