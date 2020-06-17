import React, { useState, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { fetchSearchUsers } from '../api/github'
import './UserForm.scss'

interface Props {
  login: string
}

export default function UserForm({ login }: Props): JSX.Element {
  const [currentLogin, setCurrentLogin] = useState(login)
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
          setCurrentAvatarBackgroundImage(users.length ? `url(${users[0].avatar_url}` : '')
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

  const aAttributes: {[attribute: string]: string} = {}
  let currentIndicatorElement
  if (isTypingInProgress) {
    currentIndicatorElement = <div className="UserForm-indicator-typing"><b>.</b><b>.</b><b>.</b></div>
  } else if (currentLogin && currentAvatarBackgroundImage) {
    aAttributes['href'] = `https://github.com/${currentLogin}`
    currentIndicatorElement = <div
      className="UserForm-indicator-avatar"
      style={{ backgroundImage: isTypingInProgress ? 'none' : currentAvatarBackgroundImage }}
    ></div>
  } else {
    currentIndicatorElement = <div className="UserForm-indicator-unknown">?</div>
  }

  return (
    <form className="UserForm card">
      <a {...aAttributes} target="_blank"><div className="UserForm-indicator">{currentIndicatorElement}</div></a>
      <input className="UserForm-input" name="login" value={currentLogin} placeholder="GitHub user/org" spellCheck={false} onChange={onLoginChange}/>
      <Link to={`/${currentLogin}`}>
        <button
          className="UserForm-button" type="button" onClick={onLoadUserClick}
          disabled={!currentLogin}
        >→</button>
      </Link>
    </form>
  )
}
