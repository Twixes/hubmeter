import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Route, Switch } from "react-router-dom"
import Header from '../components/Header'
import Footer from '../components/Footer'
import Home from '../components/Home'

export default function App(): JSX.Element {
  return (
    <>
      <Header/>
      <main className="bounded">
        <Route path="/" component={Home} exact={true}/>
      </main>
      <Footer/>
    </>
  )
}
