import React from 'react'
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
  const randomQuestion: string = questions[Math.floor(Math.random() * questions.length)]

  return (
    <>
      <h1>Do</h1>
      <h1>…{randomQuestion}?</h1>
    </>
  )
}
