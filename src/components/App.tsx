import React from 'react'
import { Route } from 'react-router-dom'
import Header from './Header'
import Main from './Main'
import Footer from './Footer'

export interface Params {
  login: string | undefined
}

export default function App(): JSX.Element {
  return (
    <>
      <Header/>
      <Route path="/:login?" component={Main}/>
      <Footer/>
    </>
  )
}
