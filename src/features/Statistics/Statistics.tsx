/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { useRecoilValueLoadable } from 'recoil'

import { aggregatedDataPointsState, currentUserState } from '../../atoms'
import Graph, { Labeling } from '../../components/Graph'
import Spinner from '../../components/Spinner'
import { AggregationBy, aggregationLabelingMapping } from '../../data-processing/aggregation'
import { breakpointWidthTablet } from '../../styles'

const VARIANTS: Variants = {
    hidden: {
        opacity: 0
    },
    shown: {
        opacity: 1
    }
}

const statistics = css({
    display: 'grid',
    gridTemplateColumns: '1fr',
    [`@media screen and (min-width: ${breakpointWidthTablet})`]: {
        paddingTop: '2rem',
        paddingBottom: '2rem'
    },
    [`@media screen and (min-width: ${breakpointWidthTablet})`]: {
        gridTemplateColumns: '1fr 1fr',
        gap: '0 0.75rem'
    }
})

interface SmartGraphProps {
    aggregationBy: AggregationBy
    labeling?: Labeling
}

function SmartGraph({ aggregationBy }: SmartGraphProps): JSX.Element {
    const aggregatedDataPoints = useRecoilValueLoadable(aggregatedDataPointsState(aggregationBy))
    const labeling = aggregationLabelingMapping[aggregationBy]

    if (aggregatedDataPoints.state === 'hasError') {
        throw aggregatedDataPoints.contents
    }

    return <Graph dataPoints={aggregatedDataPoints.valueMaybe() || null} labeling={labeling} />
}

export default function Statistics(): JSX.Element {
    const currentUserLoadable = useRecoilValueLoadable(currentUserState)

    if (currentUserLoadable.state === 'hasError') {
        throw currentUserLoadable.contents
    }

    return (
        <AnimatePresence>
            {currentUserLoadable.state === 'loading' ? (
                <Spinner />
            ) : (
                <motion.div css={statistics} variants={VARIANTS} initial="hidden" animate="shown" exit="hidden" layout>
                    <section>
                        <h1>By hour</h1>
                        <SmartGraph aggregationBy={AggregationBy.Hour} />
                    </section>
                    <section>
                        <h1>By day of week</h1>
                        <SmartGraph aggregationBy={AggregationBy.DayOfWeek} />
                    </section>
                    <section>
                        <h1>By workweek</h1>
                        <SmartGraph aggregationBy={AggregationBy.Workweek} />
                    </section>
                    <section>
                        <h1>By weekend</h1>
                        <SmartGraph aggregationBy={AggregationBy.Weekend} />
                    </section>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
