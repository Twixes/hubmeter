import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilValue, useRecoilState } from 'recoil'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { errorMessageState, currentUserState, eventsState, userEventsState } from '../../atoms'
import { fetchUserEventsAll, Event } from '../../github-api'
import { Params } from '../../components/App'
import Graph, { DataPoint } from '../../components/Graph'
import './Statistics.scss'
import Spinner from '../../components/Spinner'

const hourNumbers: number[] = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const HOURS: string[] = hourNumbers.map(hour => `${hour} AM`).concat(hourNumbers.map(hour => `${hour} PM`))
const DAYS_OF_WEEK: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

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
  const [areEventsLoaded, setAreEventsLoaded] = useState(false)

  useEffect(() => {
    if (currentUser && !events[currentUser.login.toLowerCase()]) {
      // setAreEventsLoaded(false)
      fetchUserEventsAll(currentUser.login).then(newEvents => {
        setEvents({ ...events, [currentUser.login.toLowerCase()]: newEvents })
        setAreEventsLoaded(true)
      }).catch((error: Error) => {
        setErrorMessage(error.message)
        setAreEventsLoaded(false)
      })
    }
  }, [setErrorMessage, currentUser, events, setEvents])

  const [byHourPoints, byDayOfWeekPoints] = useMemo(() => {
    const byHourPointsTentative: DataPoint[] = HOURS.map(hour => [hour, 0])
    const byDayOfWeekPointsTentative: DataPoint[] = DAYS_OF_WEEK.map(dayOfWeek => [dayOfWeek, 0])
    if (currentUser && events[currentUser.login.toLowerCase()]) {
      const userEvents: Event[] = events[currentUser.login.toLowerCase()]!
      const oldestEventCreatedAt: Date | null = userEvents.length ? userEvents[userEvents.length - 1].created_at : null
      for (const event of userEvents) {
        byHourPointsTentative[event.created_at.getUTCHours()][1] += 1
        console.log(event.created_at.getUTCDate())
        byDayOfWeekPointsTentative[(event.created_at.getUTCDay() + 6) % 7][1] += 1
      }
    }
    byHourPointsTentative.push(...byHourPointsTentative.splice(0, 6)) // rearrange to make points start with 6 AM
    return [byHourPointsTentative, byDayOfWeekPointsTentative]
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
              <section>
                <h1>By hour</h1>
                <Graph dataPoints={byHourPoints} isLoading={!areEventsLoaded}/>
              </section>
              <section>
                <h1>By day of week</h1>
                <Graph dataPoints={byDayOfWeekPoints} isLoading={!areEventsLoaded}/>
              </section>
            </motion.div>
          )
        }
      })()}
    </AnimatePresence>
  )
}
