import React, { useMemo, useState, Dispatch, SetStateAction } from 'react'
import useSize from '@react-hook/size'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { roundCommands, SVGCommand } from 'svg-round-corners'
import './Graph.scss'
import Spinner from './Spinner'

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

function drawRoundedBarGraphWithOverlay(
  points: DataPoint[], width: number, height: number, setCaptionPoint: Dispatch<SetStateAction<CaptionPoint | null>>
): [JSX.Element, JSX.Element[]] {
  if (!points.length) throw Error('No data points to draw')
  const columnWidth: number = width / points.length
  const maxY: number = Math.max(...points.map(([, y]) => y)) || Infinity // fall back to 1 to avoid division by 0
  const markerElements: JSX.Element[] = []
  const markerSpace: number = 10 ** Math.floor(Math.log10(maxY)) * height / maxY
  for (let markerY = height - 1; markerY > 0; markerY -= markerSpace) {
    markerElements.push(<rect className="Graph-main-marker" x={0} y={Math.round(markerY)} width={width} height={1} />)
  }
  let xPosition: number = 0
  let yPosition: number = height
  const overlayElements: JSX.Element[] = []
  const mainCommands: SVGCommand[] = [
    { marker: 'M', values: { x: width, y: yPosition + 1 } },
    { marker: 'L', values: { x: xPosition, y: yPosition } }
  ]
  for (const [i, [x, y]] of points.entries()) {
    const overlayCommands: SVGCommand[] = [
      { marker: 'M', values: { x: columnWidth, y: height } },
      { marker: 'L', values: { x: 0, y: height } }
    ]
    yPosition = (1 - y / maxY) * height
    mainCommands.push({ marker: 'L', values: { x: xPosition, y: yPosition } })
    xPosition += columnWidth
    overlayCommands.push(...[
      { marker: 'L', values: { x: 0, y: yPosition } },
      { marker: 'L', values: { x: columnWidth, y: yPosition } },
      { marker: 'Z', values: { x: columnWidth, y: yPosition } }
    ])
    mainCommands.push({ marker: 'L', values: { x: xPosition, y: yPosition } })
    overlayElements.push(
      <svg
        viewBox={`0 0 ${columnWidth} ${height}`} xmlns="http://www.w3.org/2000/svg"
        width={columnWidth} height={height} fill="transparent"
        className="Graph-overlay-part" key={`Graph-overlay-part-${i}`} style={{ width: columnWidth }}
        onMouseEnter={() => { setCaptionPoint([x, y, i]) }} onMouseLeave={() => { setCaptionPoint(null) }}
      >
        <path d={roundCommands(overlayCommands, CORNER_RADIUS).path}/>
      </svg>
    )
  }
  mainCommands.push({ marker: 'Z', values: { x: xPosition, y: yPosition } })
  return [(
    <svg viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
      {markerElements}<path d={roundCommands(mainCommands, CORNER_RADIUS).path}/>
    </svg>
  ), overlayElements]
}

function generateXLegend(points: DataPoint[], width: number): JSX.Element {
  if (!points.length) throw Error('No data points to draw.')
  const columnWidth: number = width / points.length
  const elements: JSX.Element[] = points.map(([x,]) => (
    <div className="Graph-legend-x-value-container" style={{ width: columnWidth }}>
      <div className="Graph-legend-x-value">{x}</div>
    </div>
  ))
  return (
    <div className="Graph-legend-x">{elements}</div>
  )
}

export default function Graph({ dataPoints, isLoading }: Props): JSX.Element {
  const vectorRef = React.useRef<HTMLDivElement | null>(null)
  const [vectorWidth, vectorHeight] = useSize(vectorRef)
  const [captionPoint, setCaptionPoint] = useState<CaptionPoint | null>(null)

  const [vectorMainElement, vectorOverlayElements, xLegendElement] = useMemo(() => isLoading ? Array(3).fill(null) : [
    ...drawRoundedBarGraphWithOverlay(dataPoints, vectorWidth, vectorHeight, setCaptionPoint),
    generateXLegend(dataPoints, vectorWidth)
  ], [dataPoints, isLoading, vectorWidth, vectorHeight])

  return (
    <div className="Graph">
      <div className="Graph-container" ref={vectorRef}>
        <AnimatePresence>
          {isLoading ? <Spinner color="var(--color-accent)"/> : (
            <>
              <motion.figure
                className="Graph-main" variants={GRAPH_VARIANTS} initial="hidden" animate="shown" exit="hidden"
                transition={{ type: 'spring', damping: 18 }}
              >{vectorMainElement}
              </motion.figure>
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
              {xLegendElement}
            </>)}
        </AnimatePresence>
      </div>
    </div>
  )
}
