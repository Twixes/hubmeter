import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { errorMessageState, currentUserState, eventsState, userEventsState } from '../../atoms'
import { fetchUserEventsAll } from '../../github-api'
import { Params } from '../../components/App'
import Graph, { DataPoint } from '../../components/Graph'
import './Statistics.scss'

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
  }, [setErrorMessage, currentUser, events, setEvents])

  const [byHourPoints]: DataPoint[][] = useMemo(() => {
    const byHourPointsTentative: DataPoint[] = HOURS.map(hour => [hour, 0])
    console.log(currentUser)
    if (currentUser && events[currentUser.login.toLowerCase()]) {
      for (const event of events[currentUser.login.toLowerCase()]!) {
        byHourPointsTentative[event.created_at.getUTCHours()][1] += 1
      }
    }
    return [byHourPointsTentative]
  }, [events, currentUser])

  return (
    <AnimatePresence>
      {!currentUser ? null : <motion.div
        className="Statistics" variants={VARIANTS} initial="hidden" animate="shown" exit="hidden" positionTransition
      >
        <h1>By hour</h1>
        <Graph dataPoints={byHourPoints}/>
      </motion.div>}
    </AnimatePresence>
  )
}
