import React, { useEffect, ReactChild } from 'react'
import { Route, useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { AnimatePresence, motion } from 'framer-motion'
import { fetchUser } from '../github-api'
import { errorMessageState, currentUserState } from '../atoms'
import { Params } from './App'
import Notice from './Notice'
import Controls from '../features/Controls/Controls'
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

function HomeHeadline({ children }: { children: ReactChild }): JSX.Element | null {
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

  const [errorMessage, setErrorMessage] = useRecoilState(errorMessageState)
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState)

  useEffect(() => {
    if (login) {
      if (!currentUser || currentUser.login !== login) {
        fetchUser(login).then(user => {
          setCurrentUser(user)
          setErrorMessage(null)
        }).catch((error: Error) => {
          setCurrentUser(null)
          setErrorMessage(error.message)
        })
      }
    } else {
      setCurrentUser(null)
      setErrorMessage(null)
    }
  }, [login, setErrorMessage, currentUser, setCurrentUser])

  return (
    <motion.main
      className="Main"
      style={{ flexGrow: login ? 1 : 0 }} animate={{ flexGrow: login ? 1 : 0 }}
    >
      <HomeHeadline>Do</HomeHeadline>
      <Controls/>
      <Notice
        shouldDisplay={Boolean(errorMessage)} indication="!" onXClick={() => { setErrorMessage(null) }}
      >{errorMessage || ''}
      </Notice>
      <HomeHeadline>{`…${QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]}?`}</HomeHeadline>
      <Route path="/:login" component={Statistics}/>
    </motion.main>
  )
}
