import posthog from 'posthog-js'
import React from 'react'
import { Route, useHistory } from 'react-router-dom'

import Footer from './Footer'
import Header from './Header'
import Main from './Main'

export interface Params {
  login: string | undefined
}

export default function App(): JSX.Element {
  const history = useHistory()

  history.listen(() => {
    posthog.capture('$pageview')
  })

  return (
    <>
      <Header/>
      <Route path="/:login?" component={Main}/>
      <Footer/>
    </>
  )
}
