import React, { useEffect, ReactChild } from 'react'
import { Route, useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { AnimatePresence, motion } from 'framer-motion'
import { fetchUser } from '../github-api'
import { showGHAPIErrorNoticeState, show404ErrorNoticeState, currentUserState } from '../atoms'
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

  const [showGHAPIErrorNotice, setShowGHAPIErrorNotice] = useRecoilState(showGHAPIErrorNoticeState)
  const [show404ErrorNotice, setShow404ErrorNotice] = useRecoilState(show404ErrorNoticeState)
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState)

  useEffect(() => {
    if (login) {
      if (!currentUser || currentUser.login !== login) {
        fetchUser(login).then(user => {
          setCurrentUser(user)
          setShowGHAPIErrorNotice(false)
          setShow404ErrorNotice(!user)
        }).catch(() => {
          setShowGHAPIErrorNotice(true)
          setShow404ErrorNotice(false)
        })
      }
    } else {
      setCurrentUser(null)
      setShowGHAPIErrorNotice(false)
      setShow404ErrorNotice(false)
    }
  }, [login, setShowGHAPIErrorNotice, setShow404ErrorNotice, currentUser, setCurrentUser])

  return (
    <motion.main
      className="Main"
      style={{ flexGrow: login ? 1 : 0 }} animate={{ flexGrow: login ? 1 : 0 }}
    >
      <HomeHeadline>Do</HomeHeadline>
      <Controls/>
      <Notice
        shouldDisplay={show404ErrorNotice} indication="!" onXClick={() => { setShow404ErrorNotice(false) }}
      >User doesn't exist.
      </Notice>
      <Notice
        shouldDisplay={showGHAPIErrorNotice} indication="!" onXClick={() => { setShowGHAPIErrorNotice(false) }}
      >
        <>GitHub&nbsp;API&nbsp;error. <a
          href="https://developer.github.com/v3/#rate-limiting" target="_blank" rel="noopener noreferrer"
        >Rate&nbsp;limiting
        </a> may be at&nbsp;fault. Try&nbsp;again&nbsp;later.
        </>
      </Notice>
      <HomeHeadline>{`…${QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]}?`}</HomeHeadline>
      <Route path="/:login" component={Statistics}/>
    </motion.main>
  )
}
