import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilValue, useRecoilState } from 'recoil'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { errorMessageState, currentUserState, eventsState, userEventsState } from '../../atoms'
import { fetchUserEventsAll } from '../../github-api'
import { Params } from '../../components/App'
import Graph, { DataPoint } from '../../components/Graph'
import './Statistics.scss'
import Spinner from '../../components/Spinner'

const hourNumbers: number[] = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const HOURS: string[] = hourNumbers.map(hour => `${hour} AM`).concat(hourNumbers.map(hour => `${hour} PM`))

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
  const currentUser = useRecoilValue(currentUserState)
  // const [userEvents, setUserEvents] = useRecoilState(userEventsState({ login: login!.toLowerCase() }))
  const [events, setEvents] = useRecoilState(eventsState)
  const [wereEventsLoaded, setWereEventsLoaded] = useState<boolean>(false)

  useEffect(() => {
    if (currentUser && !events[currentUser.login.toLowerCase()]) {
      setWereEventsLoaded(false)
      fetchUserEventsAll(currentUser.login).then(newEvents => {
        setEvents({ ...events, [currentUser.login.toLowerCase()]: newEvents })
        setWereEventsLoaded(true)
      }).catch((error: Error) => {
        setErrorMessage(error.message)
        setWereEventsLoaded(false)
      })
    }
  }, [setErrorMessage, currentUser, events, setEvents])

  const [byHourPoints] = useMemo(() => {
    const byHourPointsTentative: DataPoint[] = HOURS.map(hour => [hour, 0])
    if (currentUser && events[currentUser.login.toLowerCase()]) {
      for (const event of events[currentUser.login.toLowerCase()]!) {
        byHourPointsTentative[event.created_at.getUTCHours()][1] += 1
      }
    }
    byHourPointsTentative.push(...byHourPointsTentative.splice(0, 6))
    return [byHourPointsTentative]
  }, [events, currentUser])

  return (
    <AnimatePresence>
      {(() => {
        if (errorMessage) return null
        else if (!currentUser) return <Spinner/>
        else {
          return (
            <motion.div
              className="Statistics" variants={VARIANTS}
              initial="hidden" animate="shown" exit="hidden" positionTransition
            >
              <h1>By hour</h1>
              <Graph dataPoints={byHourPoints} isLoading={!wereEventsLoaded}/>
            </motion.div>
          )
        }
      })()}
    </AnimatePresence>
  )
}
