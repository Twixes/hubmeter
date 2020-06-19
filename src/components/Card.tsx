import React, { CSSProperties } from 'react'
import './Card.scss'

interface Props {
  children: React.ReactElement
  className?: string
  continueTop?: boolean
  continueBottom?: boolean
  noPaddingLeft?: boolean
  noPaddingRight?: boolean
}

export default function UserSearch(
  { children, className, continueTop, continueBottom, noPaddingLeft, noPaddingRight }: Props
): JSX.Element {
  const style: CSSProperties = {}
  if (continueTop) {
    style.borderTopLeftRadius = 0
    style.borderTopRightRadius = 0
  }
  if (continueBottom) {
    style.borderBottomLeftRadius = 0
    style.borderBottomRightRadius = 0
  }
  if (noPaddingLeft) style.paddingLeft = 0
  if (noPaddingRight) style.paddingRight = 0
  className = className ? `Card ${className}` : 'Card'
  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}
