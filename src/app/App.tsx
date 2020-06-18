import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Route } from 'react-router-dom'
import { RootState } from './rootReducer'
import Header from '../components/Header'
import Footer from '../components/Footer'
import UserForm from '../components/UserForm'

const QUESTIONS: string[] = [ // "Do ${subject} ${question}?"
  'release on Friday',
  'pull all-nighters',
  'work the night shift',
  'git up at the crack of dawn',
  'code on weekends',
  'code at high noon',
  'have a life',
  'ever code'
]

function HeadlineAbove(): JSX.Element {
  return <h1>Do</h1>
}

function HeadlineBelow(): JSX.Element {
  return <h1>…{QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]}?</h1>
}

export default function App(): JSX.Element {
  const dispatch = useDispatch()

  const { currentLogin } = useSelector(
    (state: RootState) => state.eventsDisplay
  )

  return (
    <>
      <Header/>
      <main className="bounded">
        <Route path="/" component={HeadlineAbove} exact/>
        <UserForm login={''}/>
        <Route path="/" component={HeadlineBelow} exact/>
      </main>
      <Footer/>
    </>
  )
}
