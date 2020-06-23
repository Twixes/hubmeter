import React, { useMemo, useState, Dispatch, SetStateAction, useEffect } from 'react'
import useSize from '@react-hook/size'
import { motion, AnimatePresence, Variants, useMotionValue, MotionValue } from 'framer-motion'
import { roundCommands, SVGCommand } from 'svg-round-corners'
import './Graph.scss'
import Spinner from './Spinner'
import { type } from 'os'

export type DataPoint = [Date | string | number, number]
type CaptionPoint = [Date | string | number, number, number]

interface Props {
  dataPoints: DataPoint[]
  isLoading?: boolean
}

const CORNER_RADIUS: number = 4
const GRAPH_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
    scaleY: 0
  },
  shown: {
    opacity: 1,
    scaleY: 1
  }
}

function drawRoundedBarGraphMain(points: DataPoint[], width: number, height: number): JSX.Element {
  if (!points.length) throw Error('No data points to draw.')
  const columnWidth: number = width / points.length
  const heightWithoutBaseline: number = height - CORNER_RADIUS
  const maxY: number = Math.max(...points.map(([, y]) => y)) || Infinity // fall back to 1 to avoid division by 0
  let xPosition: number = 0
  let yPosition: number = height
  const commands: SVGCommand[] = [
    { marker: 'M', values: { x: width, y: yPosition } },
    { marker: 'L', values: { x: xPosition, y: yPosition } }
  ]
  for (const [, y] of points) {
    yPosition = (1 - y / maxY) * heightWithoutBaseline
    commands.push({ marker: 'L', values: { x: xPosition, y: yPosition } })
    xPosition += columnWidth
    commands.push({ marker: 'L', values: { x: xPosition, y: yPosition } })
  }
  commands.push({ marker: 'Z', values: { x: xPosition, y: yPosition } })
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg"
      width={width} height={height}
    >
      <path d={roundCommands(commands, CORNER_RADIUS, 3).path}/>
    </svg>
  )
}

function drawRoundedBarGraphOverlay(
  points: DataPoint[], width: number, height: number, setCaptionPoint: Dispatch<SetStateAction<CaptionPoint | null>>
): JSX.Element[] {
  if (!points.length) throw Error('No data points to draw.')
  const columnWidth: number = width / points.length
  const heightWithoutBaseline: number = height - CORNER_RADIUS
  const maxY: number = Math.max(...points.map(([, y]) => y)) || Infinity // fall back to 1 to avoid division by 0
  const elements: JSX.Element[] = []
  for (const [i, [x, y]] of points.entries()) {
    const commands: SVGCommand[] = [
      { marker: 'M', values: { x: columnWidth, y: height } },
      { marker: 'L', values: { x: 0, y: height } }
    ]
    const yPosition: number = (1 - y / maxY) * heightWithoutBaseline
    commands.push(...[
      { marker: 'L', values: { x: 0, y: yPosition } },
      { marker: 'L', values: { x: columnWidth, y: yPosition } },
      { marker: 'Z', values: { x: columnWidth, y: yPosition } }
    ])
    elements.push(
      <div
        className="Graph-overlay-part" key={`Graph-overlay-part-${i}`} style={{ width: columnWidth }}
        onMouseEnter={() => { setCaptionPoint([x, y, i]) }} onMouseLeave={() => { setCaptionPoint(null) }}
      >
        <svg
          viewBox={`0 0 ${columnWidth} ${height}`} xmlns="http://www.w3.org/2000/svg"
          width={columnWidth} height={height} fill="transparent"
        >
          <path d={roundCommands(commands, CORNER_RADIUS, 3).path}/>
        </svg>
        <div className="Graph-overlay-legend-x-container"><div className="Graph-overlay-legend-x">{x}</div></div>
      </div>
    )
  }
  return elements
}

export default function Graph({ dataPoints, isLoading }: Props): JSX.Element {
  const vectorRef = React.useRef<HTMLDivElement | null>(null)
  const [vectorWidth, vectorHeight] = useSize(vectorRef)
  const [captionPoint, setCaptionPoint] = useState<CaptionPoint | null>(null)

  const [vectorMainElement, vectorOverlayElements] = useMemo(() => isLoading ? Array(2).fill(null) : [
    drawRoundedBarGraphMain(dataPoints, vectorWidth, vectorHeight),
    drawRoundedBarGraphOverlay(dataPoints, vectorWidth, vectorHeight, setCaptionPoint)
  ], [dataPoints, isLoading, vectorWidth, vectorHeight])

  return (
    <div className="Graph">
      <div className="Graph-container" ref={vectorRef}>
        <AnimatePresence>
          {isLoading ? <Spinner color="var(--color-accent)"/> : (
            <motion.div
              className="Graph-subcontainer" variants={GRAPH_VARIANTS} initial="hidden" animate="shown" exit="hidden"
              transition={{ type: 'spring', damping: 18 }}
            >
              <figure className="Graph-main">{vectorMainElement}</figure>
              <figure className="Graph-overlay">
                <AnimatePresence>
                  {captionPoint && <motion.figcaption
                    className="Graph-overlay-caption"
                    initial={{
                      x: `calc(-50% + ${((captionPoint[2] + 0.5) / dataPoints.length) * vectorWidth}px)`,
                      y: 'calc(-0.75rem)',
                      opacity: 0
                    }}
                    animate={{
                      x: `calc(-50% + ${((captionPoint[2] + 0.5) / dataPoints.length) * vectorWidth}px)`,
                      y: '0%',
                      opacity: 1
                    }}
                    exit={{
                      x: `calc(-50% + ${((captionPoint[2] + 0.5) / dataPoints.length) * vectorWidth}px)`,
                      y: 'calc(-0.75rem)',
                      opacity: 0
                    }}
                  >{captionPoint[0]}<br/>{captionPoint[1]} {captionPoint[1] === 1 ? 'event' : 'events'}
                  </motion.figcaption>}
                </AnimatePresence>
                {vectorOverlayElements}
              </figure>
            </motion.div>)}
        </AnimatePresence>
      </div>
    </div>
  )
}
