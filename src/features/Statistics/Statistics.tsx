import './Statistics.scss'

import { AnimatePresence, motion, Variants } from 'framer-motion'
import React, { useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'

import {
    areEventsLoadingState,
    currentUserState,
    errorMessageState,
    isCurrentUserLoadingState,
    userEventsState
} from '../../atoms'
import { Params } from '../../components/App'
import Graph from '../../components/Graph'
import Spinner from '../../components/Spinner'
import { fetchUserEventsAll } from '../../github-api'

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

    const loadUserEvents = useCallback(
        (login: string) => {
            if (areEventsLoading) {
                console.warn('User events already are loading!')
            } else {
                setAreEventsLoading(true)
                fetchUserEventsAll(login)
                    .then((newEvents) => {
                        setUserEvents(newEvents)
                        return newEvents
                    })
                    .finally(() => {
                        setAreEventsLoading(false)
                    })
                    .catch((error: Error) => {
                        setErrorMessage(error.message)
                    })
            }
        },
        [areEventsLoading, setUserEvents, setAreEventsLoading, setErrorMessage]
    )

    useEffect(() => {
        if (currentUser && !userEvents) {
            loadUserEvents(currentUser.login)
        }
    }, [currentUser, userEvents, loadUserEvents])

    return (
        <AnimatePresence>
            {(() => {
                if (errorMessage) return null
                if (isCurrentUserLoading) return <Spinner />
                if (currentUser) {
                    return (
                        <motion.div
                            className="Statistics"
                            variants={VARIANTS}
                            initial="hidden"
                            animate="shown"
                            exit="hidden"
                            layout
                        >
                            <section>
                                <h1>By hour</h1>
                                <Graph
                                    dataPoints={[
                                        [2, 3],
                                        [3, 2]
                                    ]}
                                    isLoading={areEventsLoading}
                                />
                            </section>
                            <section>
                                <h1>By day of week</h1>
                                <Graph
                                    dataPoints={[
                                        [2, 3],
                                        [3, 2]
                                    ]}
                                    isLoading={areEventsLoading}
                                />
                            </section>
                        </motion.div>
                    )
                }
                return null
            })()}
        </AnimatePresence>
    )
}
