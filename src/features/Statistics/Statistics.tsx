import React, { useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilValue, useRecoilState } from 'recoil'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { errorMessageState, isCurrentUserLoadingState, currentUserState, areEventsLoadingState, userEventsState } from '../../atoms'
import { fetchUserEventsAll } from '../../github-api'
import { Params } from '../../components/App'
import Graph from '../../components/Graph'
import './Statistics.scss'
import Spinner from '../../components/Spinner'

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

  const [errorMessage, setErrorMessage] = useRecoilState(errorMessageState)
  const [areEventsLoading, setAreEventsLoading] = useRecoilState(areEventsLoadingState)
  const [userEvents, setUserEvents] = useRecoilState(userEventsState({ login: login!.toLowerCase() }))
  const isCurrentUserLoading = useRecoilValue(isCurrentUserLoadingState)
  const currentUser = useRecoilValue(currentUserState)

  const loadUserEvents = useCallback((login: string) => {
    if (areEventsLoading) {
      console.warn('User events already are loading!')
    } else {
      setAreEventsLoading(true)
      fetchUserEventsAll(login).then(newEvents => {
        setUserEvents(newEvents)
      }).catch((error: Error) => {
        setErrorMessage(error.message)
      }).finally(() => {
        setAreEventsLoading(false)
      })
    }
  }, [areEventsLoading, setUserEvents, setAreEventsLoading, setErrorMessage])

  useEffect(() => {
    if (currentUser && !userEvents) {
      loadUserEvents(currentUser.login)
    }
  }, [currentUser, userEvents, loadUserEvents])

  return (
    <AnimatePresence>
      {(() => {
        if (errorMessage) return null
        if (isCurrentUserLoading) return <Spinner/>
        if (currentUser) {
          return (
            <motion.div
              className="Statistics" variants={VARIANTS}
              initial="hidden" animate="shown" exit="hidden" layout
            >
              <section>
                <h1>By hour</h1>
                <Graph dataPoints={[[2, 3]]} isLoading={areEventsLoading}/>
              </section>
              <section>
                <h1>By day of week</h1>
                <Graph dataPoints={[[2, 3]]} isLoading={areEventsLoading}/>
              </section>
            </motion.div>
          )
        }
        return null
      })()}
    </AnimatePresence>
  )
}
