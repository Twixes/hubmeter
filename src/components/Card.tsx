import React, { CSSProperties } from 'react'
import './Card.scss'

interface Props {
  children: React.ReactElement
  className?: string
  style?: CSSProperties
  continueTop?: boolean
  continueBottom?: boolean
  noPaddingLeft?: boolean
  noPaddingRight?: boolean
}

export default function UserForm(
  { children, className, style, continueTop, continueBottom, noPaddingLeft, noPaddingRight }: Props
): JSX.Element {
  if (!style) style = {}
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
