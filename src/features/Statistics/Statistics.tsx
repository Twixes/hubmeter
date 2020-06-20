import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil'
import { motion } from 'framer-motion'
import { showGHAPIErrorNoticeState, currentUserState, userEventsState } from '../../atoms'
import { fetchUserEventsAll } from '../../api/github'
import { Params } from '../../app/App'
import './Statistics.scss'

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
    <motion.div className="Statistics" positionTransition>
    </motion.div>
  )
}
