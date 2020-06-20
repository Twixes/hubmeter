import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { showGHAPIErrorNoticeState, currentUserState, userEventsState } from '../../atoms'
import { fetchUserEventsAll } from '../../github-api'
import { Params } from '../../components/App'
import './Statistics.scss'

const VARIANTS: Variants = {
  hidden: {
    opacity: 0
  },
  shown: {
    opacity: 1
  }
}

export default function Statistics(): JSX.Element {
  const { login } = useParams<Params>()

  const setShowGHAPIErrorNotice = useSetRecoilState(showGHAPIErrorNoticeState)
  const currentUser = useRecoilValue(currentUserState)
  const [userEvents, setUserEvents] = useRecoilState(userEventsState({ login: login!.toLowerCase() }))

  useEffect(() => {
    if (currentUser && !userEvents) {
      fetchUserEventsAll(currentUser.login).then(setUserEvents).catch(() => { setShowGHAPIErrorNotice(true)})
    }
    console.log(userEvents?.length)
  }, [setShowGHAPIErrorNotice, currentUser, userEvents, setUserEvents])

  return (
    <AnimatePresence>
      <motion.div
        className="Statistics" variants={VARIANTS}
        initial="hidden" animate="shown" exit="hidden" positionTransition
      >
        <h1>Statistics</h1>
      </motion.div>
    </AnimatePresence>
  )
}
