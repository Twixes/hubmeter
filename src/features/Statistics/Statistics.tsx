import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { errorMessageState, currentUserState, eventsState, userEventsState } from '../../atoms'
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

  const setErrorMessage = useSetRecoilState(errorMessageState)
  const currentUser = useRecoilValue(currentUserState)
  // const [userEvents, setUserEvents] = useRecoilState(userEventsState({ login: login!.toLowerCase() }))
  const [events, setEvents] = useRecoilState(eventsState)

  useEffect(() => {
    if (currentUser && !events[currentUser.login.toLowerCase()]) {
      fetchUserEventsAll(currentUser.login).then(newEvents => {
        setEvents({ ...events, [currentUser.login.toLowerCase()]: newEvents })
      }).catch((error: Error) => {
        setErrorMessage(error.message)
      })
    }
    if (currentUser) console.log(events[currentUser.login.toLowerCase()]?.length)
  }, [setShowGHAPIErrorNotice, currentUser, events, setEvents])

  return (
    <AnimatePresence>
      {!currentUser ? null : <motion.div
        className="Statistics" variants={VARIANTS} initial="hidden" animate="shown" exit="hidden" positionTransition
      >
        <h1>Statistics</h1>
      </motion.div>}
    </AnimatePresence>
  )
}
