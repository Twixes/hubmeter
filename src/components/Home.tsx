import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Route, Switch } from "react-router-dom"
import './Home.scss'

let questions: string[] = [ // "Do ${subject} ${question}?"
  'release on Friday',
  'pull all-nighters',
  'work the night shift',
  'get up at the crack of dawn',
  'code on weekends',
  'code at high noon',
  'have a life',
  'ever code'
]

export default function App(): JSX.Element {
  return (
    <>
      <h1>Do</h1>
      <h1>…{ questions[Math.floor(Math.random() * questions.length)] }?</h1>
    </>
  )
}
