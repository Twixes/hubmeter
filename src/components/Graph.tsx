/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import useSize from '@react-hook/size'
import { roundCommands, SVGCommand } from '@twixes/svg-round-corners'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import React, { Dispatch, MutableRefObject, SetStateAction, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { card } from '../styles'
import Spinner from './Spinner'

export type DataPoint = [string | number, number]
export type Labeling = Record<string | number, string> | string[]
type CaptionPoint = [string | number, number, number]

const graph = css({
    width: '100%',
    height: '16rem',
    padding: '0.75rem 1.5rem'
})

const graphOverlayCaption = css({
    position: 'absolute',
    textAlign: 'center',
    padding: '0.25rem',
    borderRadius: '0.25rem',
    background: 'var(--color-accent)',
    color: 'var(--color-foreground)',
    lineHeight: 1
})

const graphLegendX = css({
    display: 'flex',
    flexFlow: 'row nowrap',
    paddingTop: '0.375rem',
    lineHeight: 1
})

const graphLegendXValue = css({
    transform: 'rotate(-30deg)',
    transformOrigin: 'top right',
    width: 'fit-content',
    textAlign: 'right',
    whiteSpace: 'pre',
    fontSize: '0.75rem'
})

const graphLegendXValueContainer = css({
    transform: 'translateX(-50%)',
    display: 'flex',
    flexFlow: 'nowrap column',
    alignItems: 'flex-end'
})

const graphArea = css({
    display: 'inline-block',
    margin: 0
})

const CORNER_RADIUS = 4
const TRANSITION = { type: 'spring', damping: 18 }
const OPACITY_VARIANTS: Variants = {
    hidden: {
        opacity: 0
    },
    shown: {
        opacity: 1
    }
}
const EXPANSION_VARIANTS: Variants = {
    hidden: {
        scaleY: 0
    },
    shown: {
        scaleY: 1
    }
}

function generateXLegend(
    points: DataPoint[],
    width: number,
    xLegendRefs: MutableRefObject<(HTMLDivElement | null)[]>,
    labeling?: Labeling
): JSX.Element {
    if (!points.length) throw Error('No data points to draw')
    const columnWidth: number = width / points.length
    const xLegendValueElements: JSX.Element[] = []
    for (const [i, [x]] of points.entries()) {
        xLegendValueElements.push(
            <div css={graphLegendXValueContainer} style={{ width: columnWidth }} key={`Graph-legend-x-value-${i + 1}`}>
                <div
                    css={graphLegendXValue}
                    ref={(ref) => {
                        xLegendRefs.current[i] = ref
                    }}
                >
                    {labeling?.[x as number] ?? x /* as number is slightly hacky, but does avoid TS complaints */}
                </div>
            </div>
        )
    }
    return (
        <motion.div
            css={graphLegendX}
            transition={TRANSITION}
            variants={OPACITY_VARIANTS}
            initial="hidden"
            animate="shown"
            exit="hidden"
        >
            {xLegendValueElements}
        </motion.div>
    )
}

function drawRoundedBarGraphWithOverlay(
    points: DataPoint[],
    width: number,
    height: number,
    setCaptionPoint: Dispatch<SetStateAction<CaptionPoint | null>>,
    xLegendHeight: number
): [JSX.Element, JSX.Element[]] {
    if (!points.length) throw new Error('No data points to draw')
    if (xLegendHeight > 0) height -= xLegendHeight
    const maxY: number = Math.max(...points.map(([, y]) => y)) || 10 // fall back to 10 to avoid division by 0
    let markerValue: number = 10 ** Math.floor(Math.log10(maxY))
    let markerSpace: number = (markerValue * height) / maxY
    if (height / markerSpace < 2) {
        // ensure that at least 2 markers will be displayed
        markerValue /= 10
        markerSpace /= 10
    }
    const markerElements: JSX.Element[] = []
    for (let markerY = height - 1; markerY > 0; markerY -= markerSpace) {
        markerElements.push(
            <motion.rect
                css={{ fill: 'var(--color-accent-pale)' }}
                x={0}
                y={Math.round(markerY)}
                key={`marker-${markerY}`}
                width={width}
                height={1}
                transition={TRANSITION}
                variants={OPACITY_VARIANTS}
                initial="hidden"
                animate="shown"
                exit="hidden"
            />
        )
    }
    const columnWidth: number = width / points.length
    const overlayElements: JSX.Element[] = []
    const mainCommands: SVGCommand[] = [
        { marker: 'M', values: { x: width, y: height + 1 } },
        { marker: 'L', values: { x: 0, y: height + 1 } }
    ]
    let xPosition = 0
    let yPosition: number = height
    for (const [i, [x, y]] of points.entries()) {
        const overlayCommands: SVGCommand[] = [
            { marker: 'M', values: { x: columnWidth, y: height } },
            { marker: 'L', values: { x: 0, y: height } }
        ]
        yPosition = (1 - y / maxY) * height
        mainCommands.push({ marker: 'L', values: { x: xPosition, y: yPosition } })
        xPosition += columnWidth
        overlayCommands.push(
            ...[
                { marker: 'L', values: { x: 0, y: yPosition } },
                { marker: 'L', values: { x: columnWidth, y: yPosition } },
                { marker: 'Z', values: { x: columnWidth, y: yPosition } }
            ]
        )
        mainCommands.push({ marker: 'L', values: { x: xPosition, y: yPosition } })
        overlayElements.push(
            <svg
                viewBox={`0 0 ${columnWidth} ${height}`}
                xmlns="http://www.w3.org/2000/svg"
                width={columnWidth}
                height={height}
                fill="transparent"
                css={{
                    transition: 'fill var(--duration-instant) var(--timing-function-standard)',
                    ':hover': {
                        fill: 'rgba(0, 0, 0, 0.25)'
                    }
                }}
                key={`Graph-overlay-part-${i + 1}`}
                style={{ width: columnWidth }}
                onMouseEnter={() => {
                    setCaptionPoint([x, y, i])
                }}
                onMouseLeave={() => {
                    setCaptionPoint(null)
                }}
            >
                <motion.path
                    css={{ transformOrigin: 'bottom !important' }}
                    variants={EXPANSION_VARIANTS}
                    initial="hidden"
                    animate="shown"
                    exit="hidden"
                    transition={TRANSITION}
                    d={roundCommands(overlayCommands, CORNER_RADIUS).path}
                />
            </svg>
        )
    }
    mainCommands.push({ marker: 'Z', values: { x: xPosition, y: yPosition } })
    const mainElement: JSX.Element = (
        <svg viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
            {markerElements}
            <motion.path
                css={{ transformOrigin: 'bottom !important' }}
                variants={EXPANSION_VARIANTS}
                initial="hidden"
                animate="shown"
                exit="hidden"
                transition={TRANSITION}
                d={roundCommands(mainCommands, CORNER_RADIUS).path}
            />
        </svg>
    )
    return [mainElement, overlayElements]
}

export interface GraphProps {
    dataPoints: DataPoint[]
    labeling?: Labeling
    isLoading?: boolean
}

export default function Graph({ dataPoints, labeling, isLoading }: GraphProps): JSX.Element {
    const vectorRef = useRef<HTMLDivElement | null>(null)
    const xLegendRefs = useRef<(HTMLDivElement | null)[]>([])
    const [vectorWidth, vectorHeight] = useSize(vectorRef)
    const [xLegendHeight, setXLegendHeight] = useState<number>(0)
    const [captionPoint, setCaptionPoint] = useState<CaptionPoint | null>(null)

    const xLegendElement = useMemo(
        () => (isLoading ? null : generateXLegend(dataPoints, vectorWidth, xLegendRefs, labeling)),
        [isLoading, dataPoints, vectorWidth, labeling]
    )

    const [vectorMainElement, vectorOverlayElements] = useMemo(
        () =>
            isLoading
                ? [null, null]
                : drawRoundedBarGraphWithOverlay(dataPoints, vectorWidth, vectorHeight, setCaptionPoint, xLegendHeight),
        [isLoading, dataPoints, vectorWidth, vectorHeight, xLegendHeight]
    )

    useLayoutEffect(() => {
        setXLegendHeight(
            Math.max(
                ...xLegendRefs.current.filter((ref) => Boolean(ref)).map((ref) => ref!.getBoundingClientRect().height)
            )
        )
    })

    return (
        <div css={[card, graph]}>
            <div css={{ width: '100%', height: '100%' }} ref={vectorRef}>
                <AnimatePresence>
                    {isLoading ? (
                        <Spinner color="var(--color-accent)" />
                    ) : (
                        <>
                            <figure css={graphArea}>{vectorMainElement}</figure>
                            <figure css={[graphArea, { marginLeft: '-100%' }]}>
                                <AnimatePresence>
                                    {captionPoint && (
                                        <motion.figcaption
                                            css={[card, graphOverlayCaption]}
                                            initial={{
                                                x: `calc(-50% + ${
                                                    ((captionPoint[2] + 0.5) / dataPoints.length) * vectorWidth
                                                }px)`,
                                                y: 'calc(-0.75rem)',
                                                opacity: 0
                                            }}
                                            animate={{
                                                x: `calc(-50% + ${
                                                    ((captionPoint[2] + 0.5) / dataPoints.length) * vectorWidth
                                                }px)`,
                                                y: '0%',
                                                opacity: 1
                                            }}
                                            exit={{
                                                x: `calc(-50% + ${
                                                    ((captionPoint[2] + 0.5) / dataPoints.length) * vectorWidth
                                                }px)`,
                                                y: 'calc(-0.75rem)',
                                                opacity: 0
                                            }}
                                        >
                                            {labeling ? labeling[captionPoint[0] as number] : captionPoint[0]}
                                            <br />
                                            {captionPoint[1]} {captionPoint[1] === 1 ? 'event' : 'events'}
                                        </motion.figcaption>
                                    )}
                                </AnimatePresence>
                                {vectorOverlayElements}
                            </figure>
                            {xLegendElement}
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
