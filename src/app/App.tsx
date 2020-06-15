import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Route, Switch } from "react-router-dom"
import Header from '../components/Header'
import Footer from '../components/Footer'
import Home from '../components/Home'
import './App.scss'

export default function App(): JSX.Element {
  return (
    <div className="App">
      <Header/>
      <main className="bounded">
        <Route path="/" component={Home} exact={true}/>
      </main>
      <Footer/>
    </div>
  )
}
