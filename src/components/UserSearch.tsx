import React, { useState, useRef, ChangeEvent, FormEvent, KeyboardEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { fetchSearchUsers, User } from '../api/github'
import { useOutsideClickHandler} from './utils'
import Card from './Card'
import UserSearchResults from './UserSearchResults'
import './UserSearch.scss'

interface Props {
  login: string
}

const MAX_SEARCH_RESULTS_VISIBLE: number = 4

export default function UserSearch({ login }: Props): JSX.Element {
  const [currentLoginInput, setCurrentLoginInput] = useState<string>(login)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
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
  const isPushEnabled: boolean = Boolean(
    currentLoginInput && (didSearchErrorOccur || isTypingInProgress || !isTypingInProgress && currentUser)
  )

  function push() {
    setIsSearchHiddenOverride(true)
    if (currentUser) {
      setCurrentLoginInput(currentUser.login)
      history.push(`/${currentUser.login}`)
    } else if (currentLoginInput) {
      history.push(`/${currentLoginInput}`)
    }
  }

  function onLoginInputChange(event: ChangeEvent<HTMLInputElement>): void {
    const element = event.target
    setCurrentLoginInput(element.value)
    setCurrentUser(null)
    setIsSearchHiddenOverride(false)
    setIsTypingInProgress(true)
    setDidSearchErrorOccur(false)
    clearTimeout(typingTimeout)
    setTypingTimeout(setTimeout(() => {
      if (element.value) {
        fetchSearchUsers(element.value).then(users => {
          setCurrentSearchResults(users)
          if (users.length && users[0].login.toLowerCase() === element.value.toLowerCase()) {
            setCurrentUser(users[0])
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
    document.querySelector('input')?.blur()
    if (isPushEnabled) push()
  }

  function setUserFromSearch(user: User) {
    setCurrentLoginInput(user.login)
    setCurrentUser(user)
    push()
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
      <div className="UserSearch-indicator-typing">
        <span>.</span><span>.</span><span>.</span>
      </div>
    )
  } else if (currentLoginInput && didSearchErrorOccur) {
    aElementAttributes['href'] = `https://github.com/${currentLoginInput}`
    currentIndicatorElement = (
      <div className="UserSearch-indicator-error">!</div>
    )
  } else if (currentLoginInput && currentUser) {
    aElementAttributes['href'] = `https://github.com/${currentLoginInput}`
    currentIndicatorElement = (
      <div className="UserSearch-indicator-avatar" style={{ backgroundImage: `url(${currentUser.avatar_url}&s=144` }}>
      </div>
    )
  } else {
    currentIndicatorElement = (
      <div className="UserSearch-indicator-unknown">?</div>
    )
  }

  return (
    <form className="UserSearch" ref={wrapperRef} onSubmit={onFormSubmit}>
      <Card continueBottom={isSearchShown} noPaddingRight>
        <>
          <a {...aElementAttributes} target="_blank" rel="noopener noreferrer">
            <div className="UserSearch-indicator" style={{ opacity: isPushEnabled ? 1 : ''}} >
              {currentIndicatorElement}
            </div>
          </a>
          <input
            className="UserSearch-login" type="search" name="login" value={currentLoginInput} spellCheck={false}
            placeholder="GitHub user/org" autoCapitalize="off" autoComplete="off" autoCorrect="off" autoFocus
            onChange={onLoginInputChange} onFocus={onLoginInputFocus} onKeyDown={onLoginInputKeyDown}
          />
          <Link to={`/${currentLoginInput}`}>
            <button className="UserSearch-action" type="button" disabled={!isPushEnabled}>→</button>
          </Link>
        </>
      </Card>
      <UserSearchResults
        isSearchShown={isSearchShown} currentLoginInput={currentLoginInput} users={currentSearchResults}
        setUserFromSearch={setUserFromSearch} onSearchResultKeyDownedGenerator={onSearchResultKeyDownedGenerator}
      />
    </form>
  )
}
