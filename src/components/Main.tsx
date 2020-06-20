import React, { useEffect } from 'react'
import { Route, useParams } from 'react-router-dom'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { AnimatePresence, motion } from 'framer-motion'
import { fetchUser } from '../github-api'
import { showGHAPIErrorNoticeState, currentUserState } from '../atoms'
import { Params } from './App'
import ErrorNotice from '../components/ErrorNotice'
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
    <AnimatePresence initial={false}>
      <motion.h1
        variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
        initial="hidden" animate="shown" exit="hidden" positionTransition
      >
        {children}
      </motion.h1>
    </AnimatePresence>
  )
}

export default function Main(): JSX.Element {
  const { login } = useParams<Params>()

  const setShowGHAPIErrorNotice = useSetRecoilState(showGHAPIErrorNoticeState)
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState)

  useEffect(() => {
    if (login) {
      if (!currentUser || currentUser.login !== login) fetchUser(login).then(user => {
        setCurrentUser(user)
        setShowGHAPIErrorNotice(false)
      }).catch(() => {
        setShowGHAPIErrorNotice(true)
      })
    } else {
      setCurrentUser(null)
      setShowGHAPIErrorNotice(false)
    }
  }, [login, setShowGHAPIErrorNotice, currentUser, setCurrentUser])

  return (
    <motion.main
      className="Main"
      style={{ flexGrow: login ? 1 : 0 }} animate={{ flexGrow: login ? 1 : 0 }}
    >
      <HomeHeadline>Do</HomeHeadline>
      <UserSearch/>
      <ErrorNotice/>
      <HomeHeadline>{`…${QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]}?`}</HomeHeadline>
      <Route path="/:login" component={Statistics}/>
    </motion.main>
  )
}
