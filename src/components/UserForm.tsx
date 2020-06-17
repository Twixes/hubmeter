import React, { useState, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { fetchSearchUsers } from '../api/github'
import './UserForm.scss'

interface Props {
  login: string
}

export default function UserForm({ login }: Props): JSX.Element {
  const [currentLogin, setCurrentLogin] = useState(login)
  const [currentUser, setCurrentUser] = useState({ id: '', login: '', avatar_url: '' })
  const [currentAvatarBackgroundImage, setCurrentAvatarBackgroundImage] = useState('')
  const [isTypingInProgress, setIsTypingInProgress] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState(setTimeout(async () => {}, 0))

  function onLoginChange(e: ChangeEvent<HTMLInputElement>): void {
    const element = e.target
    setCurrentLogin(element.value)
    setIsTypingInProgress(true)
    clearTimeout(typingTimeout)
    setTypingTimeout(setTimeout(() => {
      if (element.value) {
        fetchSearchUsers(element.value).then(users => {
          setCurrentAvatarBackgroundImage(users.length ? `url(${users[0].avatar_url}&s=144` : '')
        }).finally(() => {
          setIsTypingInProgress(false)
        })
      } else {
        setIsTypingInProgress(false)
      }
    }, 500))
  }

  function onLoadUserClick(): void {
  }

  const aElementAttributes: {[attribute: string]: string} = {}
  let currentIndicatorElement
  if (isTypingInProgress) {
    currentIndicatorElement = (
      <div className="UserForm-indicator-typing" style={{ opacity: currentLogin ? 1 : ''}}>
        <span>.</span><span>.</span><span>.</span>
      </div>
    )
  } else if (currentLogin && currentAvatarBackgroundImage) {
    aElementAttributes['href'] = `https://github.com/${currentLogin}`
    currentIndicatorElement = (
      <div className="UserForm-indicator-avatar" style={{ backgroundImage: currentAvatarBackgroundImage }}></div>
    )
  } else {
    currentIndicatorElement = (
      <div className="UserForm-indicator-unknown" style={{ opacity: currentLogin ? 1 : ''}}>?</div>
    )
  }

  return (
    <form className="UserForm card">
      <a {...aElementAttributes} target="_blank">
        <div className="UserForm-indicator">{currentIndicatorElement}</div>
      </a>
      <input
        className="UserForm-input" type="search" name="login" value={currentLogin} placeholder="GitHub user/org"
        spellCheck={false} onChange={onLoginChange}
      />
      <Link to={`/${currentLogin}`}>
        <button
          className="UserForm-button" type="button" onClick={onLoadUserClick}
          disabled={!currentLogin}
        >→</button>
      </Link>
    </form>
  )
}
