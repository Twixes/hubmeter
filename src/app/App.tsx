import React from 'react'
import { Route } from 'react-router-dom'
import Header from '../components/Header'
import Main from '../components/Main'
import Footer from '../components/Footer'

export default function App(): JSX.Element {
  return (
    <>
      <Header/>
      <Route path="/:login?" component={Main}/>
      <Footer/>
    </>
  )
}
