import React, { useEffect } from 'react'
import { Route, useParams } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { AnimatePresence, motion } from 'framer-motion'
import { currentUserState } from '../recoil'
import { fetchUser } from '../api/github'
import { Params } from '../app/App'
import UserSearch from '../features/UserSearch/UserSearch'
import Statistics from '../features/Statistics/Statistics'
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

function HomeHeadline({ children }: { children: string }): JSX.Element | null {
  const { login } = useParams<Params>()

  return login ? null : (
    <motion.h1
      variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
      initial="hidden" animate="shown" exit="hidden" positionTransition
    >
      {children}
    </motion.h1>
  )
}

export default function Main(): JSX.Element {
  const { login } = useParams<Params>()

  const setCurrentUser = useSetRecoilState(currentUserState)

  useEffect(() => {
    login ? fetchUser(login).then(setCurrentUser) : setCurrentUser(null)
  }, [login, setCurrentUser])

  return (
    <motion.main
      className="Main"
      style={{ flexGrow: login ? 1 : 0 }} animate={{ flexGrow: login ? 1 : 0 }}
    >
      <AnimatePresence initial={false}>
        <HomeHeadline>Do</HomeHeadline>
      </AnimatePresence>
      <UserSearch/>
      <AnimatePresence initial={false}>
        <HomeHeadline>{`…${QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]}?`}</HomeHeadline>
      </AnimatePresence>
      <Route path="/:login" component={() => <h1>By hour:</h1>}/>
    </motion.main>
  )
}
