import React from 'react'
import { Route, useHistory } from 'react-router-dom'
import posthog from 'posthog-js'
import Header from './Header'
import Main from './Main'
import Footer from './Footer'

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
