import React from 'react'
import { Route } from 'react-router-dom'
import UserSearch from '../features/UserSearch/UserSearch'
import './Main.scss'

const QUESTIONS: string[] = [ // "Do ${subject} ${question}?"
  'release on Friday',
  'pull all-nighters',
  'work the night shift',
  'git up at the crack of dawn',
  'code on weekends',
  'commit at high noon',
  'push in the morning',
  'even have a life'
]

function HeadlineAbove(): JSX.Element {
  return <h1>Do</h1>
}

function HeadlineBelow(): JSX.Element {
  return <h1>…{QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]}?</h1>
}
export default function Main(): JSX.Element {
  return (
    <main className="Main">
      <Route path="/" component={HeadlineAbove} exact/>
      <UserSearch login={''}/>
      <Route path="/" component={HeadlineBelow} exact/>
    </main>
  )
}
