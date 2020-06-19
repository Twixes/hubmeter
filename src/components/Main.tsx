import React, { ReactElement, useState } from 'react'
import { Route, useParams, useHistory, match } from 'react-router-dom'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { fetchUser, User } from '../api/github'
import UserSearch from '../features/UserSearch/UserSearch'
import './Main.scss'

interface Props {
  match: match<{ login: string | undefined }>
}

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

const HEADLINE_VARIANTS: Variants = {
  hidden: {
    opacity: 0
  },
  shown: {
    opacity: 1
  }
}

function Headline({ children }: { children: string }): JSX.Element | null {
  const params = useParams<{ login: string | undefined }>()
  return params.login ? null : (
    <motion.h1 variants={HEADLINE_VARIANTS} initial="hidden" animate="shown" exit="hidden" positionTransition>
      {children}
    </motion.h1>
  )
}

export default function Main({ match }: Props): JSX.Element {
  const login: string | undefined = match.params.login

  const [pathUser, setPathUser] = useState<User | null>(null)

  const history = useHistory()

  history.listen(async () => {
    setPathUser(login ? await fetchUser(login) : null)
  })

  return (
    <motion.main
      className="Main"
      style={{ flexGrow: login ? 1 : 0 }} animate={{ flexGrow: login ? 1 : 0 }}
    >
      <AnimatePresence initial={false}>
        <Headline>Do</Headline>
      </AnimatePresence>
      <UserSearch/>
      <AnimatePresence initial={false}>
        <Headline>{`…${QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]}?`}</Headline>
      </AnimatePresence>
      <Route path="/:login" component={() => <h1>By hour:</h1>}/>
    </motion.main>
  )
}
