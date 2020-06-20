import React, { useEffect } from 'react'
import { Route, useParams } from 'react-router-dom'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { AnimatePresence, motion } from 'framer-motion'
import { fetchUser } from '../api/github'
import { currentErrorMessageState, currentUserState } from '../recoil'
import { Params } from '../app/App'
import UserSearch from '../features/UserSearch/UserSearch'
import Statistics from '../features/Statistics/Statistics'
import ErrorNotice from '../components/ErrorNotice'
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

  const setCurrentErrorMessage = useSetRecoilState(currentErrorMessageState)
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState)

  useEffect(() => {
    if (login) {
      if (!currentUser || currentUser.login !== login) fetchUser(login).then(user => {
        setCurrentUser(user)
        setCurrentErrorMessage(null)
      }).catch((error: Error) => {
        setCurrentErrorMessage(error.message)
      })
    } else {
      setCurrentUser(null)
    }
  }, [login, setCurrentErrorMessage, currentUser, setCurrentUser])

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
      <AnimatePresence>
        <ErrorNotice/>
      </AnimatePresence>
    </motion.main>
  )
}
