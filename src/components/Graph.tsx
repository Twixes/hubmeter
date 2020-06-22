import React, { useMemo, useState, Dispatch, SetStateAction } from 'react'
import useSize from '@react-hook/size'
import { motion, AnimatePresence, Variants, useMotionValue, MotionValue } from 'framer-motion'
import { roundCommands, SVGCommand } from 'svg-round-corners'
import './Graph.scss'

export type DataPoint = [Date | string | number, number]
type CaptionPoint = [Date | string | number, number, number]

interface Props {
  dataPoints: DataPoint[]
}

const CORNER_RADIUS: number = 4

function drawRoundedBarGraph(points: DataPoint[], width: number, height: number): [string, string] {
  const columnWidth: number = width / points.length
  const heightWithoutBaseline: number = height - CORNER_RADIUS
  const maxY: number = Math.max(...points.map(([, y]) => y)) || Infinity // fall back to 1 to avoid division by 0
  let xPosition: number = 0
  let yPosition: number = height
  const commandsAllZero: SVGCommand[] = [
    { marker: 'M', values: { x: width, y: height } },
    { marker: 'L', values: { x: xPosition, y: height } }
  ]
  const commands: SVGCommand[] = [
    { marker: 'M', values: { x: width, y: yPosition } },
    { marker: 'L', values: { x: xPosition, y: yPosition } }
  ]
  for (const [, y] of points) {
    yPosition = (1 - y / maxY) * heightWithoutBaseline
    commandsAllZero.push({ marker: 'L', values: { x: xPosition, y: heightWithoutBaseline } })
    commands.push({ marker: 'L', values: { x: xPosition, y: yPosition } })
    xPosition += columnWidth
    commandsAllZero.push({ marker: 'L', values: { x: xPosition, y: heightWithoutBaseline } })
    commands.push({ marker: 'L', values: { x: xPosition, y: yPosition } })
  }
  commandsAllZero.push({ marker: 'Z', values: { x: xPosition, y: heightWithoutBaseline } })
  commands.push({ marker: 'Z', values: { x: xPosition, y: yPosition } })
  console.log(commandsAllZero)
  return [roundCommands(commands, CORNER_RADIUS).path, roundCommands(commandsAllZero, CORNER_RADIUS).path]
}

function generateRoundedBarGraphOverlay(
  points: DataPoint[], width: number, height: number, setCaptionPoint: Dispatch<SetStateAction<CaptionPoint | null>>
): JSX.Element[] {
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
        className="Graph-overlay-part"
        onMouseEnter={() => { setCaptionPoint([x, y, i]) }} onMouseLeave={() => { setCaptionPoint(null) }}
      >
        <svg
          viewBox={`0 0 ${columnWidth} ${height}`} xmlns="http://www.w3.org/2000/svg"
          width={columnWidth} height={height} fill="transparent"
        >
          <path d={roundCommands(commands, CORNER_RADIUS).path}/>
        </svg>
      </div>
    )
  }
  return elements
}

export default function Graph({ dataPoints }: Props): JSX.Element {
  const vectorRef = React.useRef<HTMLDivElement | null>(null)
  const [vectorWidth, vectorHeight] = useSize(vectorRef)
  const [captionPoint, setCaptionPoint] = useState<CaptionPoint | null>(null)
  const showProperGraph = useState<boolean>(false)

  const [[vectorMainPath, vectorMainPathAllZero], vectorOverlayElements] = useMemo(() => [
    drawRoundedBarGraph(dataPoints, vectorWidth, vectorHeight)[0],
    generateRoundedBarGraphOverlay(dataPoints, vectorWidth, vectorHeight, setCaptionPoint)
  ], [dataPoints, vectorWidth, vectorHeight])

  return (
    <div className="Graph">
      <div className="Graph-container" ref={vectorRef}>
        <figure className="Graph-main">
          <svg
            viewBox={`0 0 ${vectorWidth} ${vectorHeight}`} xmlns="http://www.w3.org/2000/svg"
            width={vectorWidth} height={vectorHeight}
          >
            <motion.path d={showProperGraph ? vectorMainPath : vectorMainPathAllZero}/>
          </svg>
        </figure>
        <figure className="Graph-overlay">
          <AnimatePresence>
            {captionPoint && <motion.figcaption
              className="Graph-overlay-caption"
              initial={{
                x: `calc(-50% + ${((captionPoint[2] + 0.5) / dataPoints.length) * vectorWidth}px)`,
                y: 'calc(-100% - 1rem)',
                opacity: 0
              }}
              animate={{
                x: `calc(-50% + ${((captionPoint[2] + 0.5) / dataPoints.length) * vectorWidth}px)`,
                y: '0%',
                opacity: 1
              }}
              exit={{
                x: `calc(-50% + ${((captionPoint[2] + 0.5) / dataPoints.length) * vectorWidth}px)`,
                y: 'calc(-100% - 1rem)',
                opacity: 0
              }}
            >
              {captionPoint[0]}<br/>{captionPoint[1]} {captionPoint[1] === 1 ? 'event' : 'events'}
            </motion.figcaption>}
          </AnimatePresence>
          {vectorOverlayElements}
        </figure>
      </div>
    </div>
  )
}
