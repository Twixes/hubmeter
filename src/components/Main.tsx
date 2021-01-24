import './Main.scss'

import { AnimatePresence, motion } from 'framer-motion'
import React, { ReactChild, useEffect, useMemo, useState } from 'react'
import { Route, useHistory, useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'

import { currentUserState, errorMessageState, isCurrentUserLoadingState } from '../atoms'
import Controls from '../features/Controls/Controls'
import Statistics from '../features/Statistics/Statistics'
import { fetchUser } from '../github-api'
import { Params } from './App'
import Notice from './Notice'

const QUESTIONS: string[] = [
  // "Do ${subject} ${question}?"
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
        style={{ margin: '0.5rem 0' }}
        initial="hidden"
        animate="shown"
        exit="hidden"
        layout
      >
        {children}
      </motion.h1>
    </AnimatePresence>
  )
}

export default function Main(): JSX.Element {
  const { login } = useParams<Params>()
  const history = useHistory()

  const [errorMessage, setErrorMessage] = useRecoilState(errorMessageState)
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState)
  const [isCurrentUserLoading, setIsCurrentUserLoading] = useRecoilState(isCurrentUserLoadingState)

  const [randomQuestion, setRandomQuestion] = useState(QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)])

  useEffect(() => {
    setRandomQuestion(QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)])
    const titleElement = document.querySelector('title')
    titleElement!.innerText = login || 'HubMeter'
  }, [login])

  useEffect(() => {
    setErrorMessage(null)
    if (login) {
      if (!currentUser || currentUser.login.toLowerCase() !== login.toLowerCase()) {
        fetchUser(login)
          .then((user) => {
            setIsCurrentUserLoading(true)
            setCurrentUser(user)
            setErrorMessage(null)
            history.replace(`/${user.login}`)
            return user
          })
          .finally(() => {
            setIsCurrentUserLoading(false)
          })
          .catch((error: Error) => {
            setCurrentUser(null)
            setErrorMessage(error.message)
          })
      } else if (currentUser.login !== login) {
        setCurrentUser(null)
      }
    }
  }, [login, setErrorMessage, currentUser, setCurrentUser, history, setIsCurrentUserLoading])

  return (
    <motion.main className="Main" style={{ flexGrow: login ? 1 : 0 }} animate={{ flexGrow: login ? 1 : 0 }}>
      <HomeHeadline>Do</HomeHeadline>
      <Controls />
      <Notice message={errorMessage} />
      <HomeHeadline>{`…${randomQuestion}?`}</HomeHeadline>
      <Route path="/:login" component={Statistics} />
    </motion.main>
  )
}
