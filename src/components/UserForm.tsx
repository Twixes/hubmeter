import React, { useState, useRef, ChangeEvent, FormEvent, KeyboardEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { fetchSearchUsers, User } from '../api/github'
import { useOutsideClickHandler} from './utils'
import Card from './Card'
import './UserForm.scss'

interface Props {
  login: string
}

const MAX_SEARCH_RESULTS_VISIBLE: number = 4

export default function UserForm({ login }: Props): JSX.Element {
  const [currentLoginInput, setCurrentLoginInput] = useState<string>(login)
  const [currentAvatarURL, setCurrentAvatarURL] = useState<string>('')
  const [currentSearchResults, setCurrentSearchResults] = useState<User[]>([])
  const [isSearchHiddenOverride, setIsSearchHiddenOverride] = useState<boolean>(false)
  const [isTypingInProgress, setIsTypingInProgress] = useState<boolean>(false)
  const [didSearchErrorOccur, setDidSearchErrorOccur] = useState<boolean>(false)
  const [typingTimeout, setTypingTimeout] = useState(setTimeout(() => {}, 0))

  const history = useHistory()
  const wrapperRef = useRef(null)
  useOutsideClickHandler(wrapperRef, () => { setIsSearchHiddenOverride(true) })

  const isSearchShown: boolean = Boolean(
    currentLoginInput && !isTypingInProgress && !isSearchHiddenOverride !== false && currentSearchResults.length
  )
  const searchBoxHeight: string = (
    isSearchShown ? `${Math.min(currentSearchResults.length, MAX_SEARCH_RESULTS_VISIBLE) * 3}rem` : '0'
  )
  const isButtonEnabled: boolean = Boolean(
    currentLoginInput && (didSearchErrorOccur || isTypingInProgress || !isTypingInProgress && currentAvatarURL)
  )

  function pushUser(login: string) {
    setIsSearchHiddenOverride(true)
    history.push(`/${login}`)
  }

  function onLoginInputChange(event: ChangeEvent<HTMLInputElement>): void {
    const element = event.target
    setCurrentLoginInput(element.value)
    setCurrentAvatarURL('')
    setIsSearchHiddenOverride(false)
    setIsTypingInProgress(true)
    setDidSearchErrorOccur(false)
    clearTimeout(typingTimeout)
    setTypingTimeout(setTimeout(() => {
      if (element.value) {
        fetchSearchUsers(element.value).then(users => {
          setCurrentSearchResults(users)
          if (users.length && users[0].login.toLowerCase() === element.value.toLowerCase()) {
            setCurrentAvatarURL(users[0].avatar_url)
          }
        }).catch(() => {
          setDidSearchErrorOccur(true)
          setCurrentSearchResults([])
        }).finally(() => {
          setIsTypingInProgress(false)
        })
      } else {
        setIsTypingInProgress(false)
      }
    }, 500))
  }

  function onLoginInputFocus(): void {
    setIsSearchHiddenOverride(false)
  }

  function onLoginInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.which === 27) {
      event.preventDefault()
      setIsSearchHiddenOverride(true)
    }
  }

  function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isButtonEnabled) pushUser(currentLoginInput)
  }

  function setUserFromSearch(user: User) {
    setCurrentLoginInput(user.login)
    setCurrentAvatarURL(user.avatar_url)
    pushUser(user.login)
  }

  function onSearchResultKeyDownedGenerator(user: User) {
    return (event: KeyboardEvent<HTMLLIElement>) => {
      if (event.which === 13) setUserFromSearch(user)
      else if (event.which === 27) setIsSearchHiddenOverride(true)
    }
  }

  const aElementAttributes: {[attribute: string]: string} = {}
  let currentIndicatorElement: JSX.Element
  if (isTypingInProgress) {
    currentIndicatorElement = (
      <div className="UserForm-indicator-typing">
        <span>.</span><span>.</span><span>.</span>
      </div>
    )
  } else if (currentLoginInput && didSearchErrorOccur) {
    aElementAttributes['href'] = `https://github.com/${currentLoginInput}`
    currentIndicatorElement = (
      <div className="UserForm-indicator-error">!</div>
    )
  } else if (currentLoginInput && currentAvatarURL) {
    aElementAttributes['href'] = `https://github.com/${currentLoginInput}`
    currentIndicatorElement = (
      <div className="UserForm-indicator-avatar" style={{ backgroundImage: `url(${currentAvatarURL}&s=144` }}></div>
    )
  } else {
    currentIndicatorElement = (
      <div className="UserForm-indicator-unknown">?</div>
    )
  }

  return (
    <form className="UserForm" ref={wrapperRef} onSubmit={onFormSubmit}>
      <Card continueBottom={isSearchShown} noPaddingRight noBoxShadow>
        <>
          <a {...aElementAttributes} target="_blank" rel="noopener noreferrer">
            <div className="UserForm-indicator" style={{ opacity: isButtonEnabled ? 1 : ''}} >
              {currentIndicatorElement}
            </div>
          </a>
          <input
            className="UserForm-login" type="search" name="login" value={currentLoginInput} spellCheck={false}
            placeholder="GitHub user/org" autoCapitalize="off" autoComplete="off" autoCorrect="off" autoFocus
            tabIndex={5} onChange={onLoginInputChange} onFocus={onLoginInputFocus} onKeyDown={onLoginInputKeyDown}
          />
          <Link to={`/${currentLoginInput}`}>
            <button className="UserForm-button" type="button" disabled={!isButtonEnabled}>→</button>
          </Link>
        </>
      </Card>
      <Card
        className="UserForm-search-box" continueTop noPaddingLeft noPaddingRight noBoxShadow
        style={{ height: searchBoxHeight }}>
        <ul className="UserForm-search-list" style={{ height: searchBoxHeight }}>
          {currentSearchResults.slice(0, MAX_SEARCH_RESULTS_VISIBLE).map(user =>(
              <li
                className="UserForm-search-result" key={user.login}
                onClick={() => { setUserFromSearch(user) }} onKeyDown={onSearchResultKeyDownedGenerator(user)}>
                <a href={`https://github.com/${user.login}`} target="_blank" rel="noopener noreferrer">
                  <div className="UserForm-indicator" style={{ opacity: 1 }}>
                    <div
                      className="UserForm-indicator-avatar"
                      style={{ backgroundImage: `url(${user.avatar_url}&s=144` }}></div>
                  </div>
                </a>
                <div className="UserForm-login">
                  {user.login}
                </div>
                <div className="UserForm-button">
                  {user.login.toLowerCase() === currentLoginInput.toLowerCase() ? '✓' : ''}
                </div>
              </li>
            )
          )}
        </ul>
      </Card>
    </form>
  )
}
