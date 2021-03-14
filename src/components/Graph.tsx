import './Graph.scss'

import useSize from '@react-hook/size'
import { roundCommands, SVGCommand } from '@twixes/svg-round-corners'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import React, { Dispatch, MutableRefObject, SetStateAction, useLayoutEffect, useMemo, useRef, useState } from 'react'

import Spinner from './Spinner'

export type DataPoint = [Date | string | number, number]
type CaptionPoint = [Date | string | number, number, number]

interface Props {
    dataPoints: DataPoint[]
    isLoading?: boolean
}

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
    xLegendRefs: MutableRefObject<(HTMLDivElement | null)[]>
): JSX.Element {
    if (!points.length) throw Error('No data points to draw')
    const columnWidth: number = width / points.length
    const xLegendValueElements: JSX.Element[] = []
    for (const [i, [x]] of points.entries()) {
        xLegendValueElements.push(
            <div
                className="Graph-legend-x-value-container"
                style={{ width: columnWidth }}
                key={`Graph-legend-x-value-${i + 1}`}
            >
                <div
                    className="Graph-legend-x-value"
                    ref={(ref) => {
                        xLegendRefs.current[i] = ref
                    }}
                >
                    {x}
                </div>
            </div>
        )
    }
    return (
        <motion.div
            className="Graph-legend-x"
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
                className="Graph-main-marker"
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
                className="Graph-overlay-part"
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
                    className="Graph-main-path"
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
                className="Graph-main-path"
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

export default function Graph({ dataPoints, isLoading }: Props): JSX.Element {
    const vectorRef = useRef<HTMLDivElement | null>(null)
    const xLegendRefs = useRef<(HTMLDivElement | null)[]>([])
    const [vectorWidth, vectorHeight] = useSize(vectorRef)
    const [xLegendHeight, setXLegendHeight] = useState<number>(0)
    const [captionPoint, setCaptionPoint] = useState<CaptionPoint | null>(null)

    const xLegendElement = useMemo(() => (isLoading ? null : generateXLegend(dataPoints, vectorWidth, xLegendRefs)), [
        isLoading,
        dataPoints,
        vectorWidth
    ])

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
        <div className="Graph">
            <div className="Graph-container" ref={vectorRef}>
                <AnimatePresence>
                    {isLoading ? (
                        <Spinner color="var(--color-accent)" />
                    ) : (
                        <>
                            <figure className="Graph-main">{vectorMainElement}</figure>
                            <figure className="Graph-overlay">
                                <AnimatePresence>
                                    {captionPoint && (
                                        <motion.figcaption
                                            className="Graph-overlay-caption"
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
                                            {captionPoint[0]}
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
