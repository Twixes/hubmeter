import React, { useState, useRef, ChangeEvent, FormEvent, KeyboardEvent } from 'react'
import { useHistory } from 'react-router-dom'
import { fetchSearchUsers, User } from '../api/github'
import { useOutsideClickHandler} from './utils'
import Card from './Card'
import UserSearchResults from './UserSearchResults'
import './UserSearch.scss'

interface Props {
  login: string
}

const MAX_SEARCH_RESULTS_SHOWN: number = 4

export default function UserSearch({ login }: Props): JSX.Element {
  const [currentLoginInput, setCurrentLoginInput] = useState<string>(login)
  const [matchingUser, setMatchingUser] = useState<User | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [currentSearchResults, setCurrentSearchResults] = useState<User[]>([])
  const [isSearchHiddenOverride, setIsSearchHiddenOverride] = useState<boolean>(false)
  const [isTypingInProgress, setIsTypingInProgress] = useState<boolean>(false)
  const [didSearchErrorOccur, setDidSearchErrorOccur] = useState<boolean>(false)
  const [typingTimeout, setTypingTimeout] = useState(setTimeout(() => {}, 0))
  const [currentNavigationIndex, setCurrentNavigationIndex] = useState(0)

  const history = useHistory()
  const formRef = useRef(null)
  const buttonRef = useRef(null)
  const navigationRefs = useRef(Array<HTMLElement | undefined>(5))

  useOutsideClickHandler(formRef, () => {
    setIsSearchHiddenOverride(true)
    setCurrentNavigationIndex(0)
  })


  const linkLogin: string = selectedUser ? selectedUser.login : matchingUser ? matchingUser.login : currentLoginInput
  const isSearchShown: boolean = Boolean(
    currentLoginInput && !isTypingInProgress && !isSearchHiddenOverride !== false && currentSearchResults.length
  )
  const isPushEnabled: boolean = Boolean(
    currentLoginInput &&
    (didSearchErrorOccur || isTypingInProgress || (!isTypingInProgress && (matchingUser || selectedUser)))
  )

  function push() {
    setIsSearchHiddenOverride(true)
    setCurrentNavigationIndex(0)
    setCurrentLoginInput(linkLogin)
    history.push(`/${linkLogin}`)
  }

  function navigateSearchResultsWithKeyboard(event: KeyboardEvent<HTMLElement>, direction: number) {
    if (!isSearchShown) return
    const nextNavigationIndex = Math.min(Math.max(currentNavigationIndex + direction, 0), MAX_SEARCH_RESULTS_SHOWN)
    const nextNavigationElement: HTMLElement | undefined = navigationRefs.current[nextNavigationIndex]
    if (!nextNavigationElement) return
    event.preventDefault()
    setCurrentNavigationIndex(nextNavigationIndex)
    nextNavigationElement.focus()
    if (nextNavigationIndex <= 0) {
      setSelectedUser(null)
      ;(nextNavigationElement as HTMLInputElement).setSelectionRange(currentLoginInput.length, currentLoginInput.length)
    } else {
      setSelectedUser(currentSearchResults[nextNavigationIndex-1])
    }
  }

  function onLoginInputChange(event: ChangeEvent<HTMLInputElement>): void {
    const element = event.target
    const originalValue = element.value
    setCurrentLoginInput(originalValue)
    setMatchingUser(null)
    setSelectedUser(null)
    setIsSearchHiddenOverride(false)
    setIsTypingInProgress(true)
    setDidSearchErrorOccur(false)
    clearTimeout(typingTimeout)
    setTypingTimeout(setTimeout(() => {
      if (originalValue) {
        fetchSearchUsers(originalValue).then(users => {
          if (element.value !== originalValue) return // cancel if input value has changed in the meantime
          if (users.length && users[0].login.toLowerCase() === originalValue.toLowerCase()) setMatchingUser(users[0])
          setCurrentSearchResults(users.slice(0, MAX_SEARCH_RESULTS_SHOWN))
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
    setCurrentNavigationIndex(0)
  }

  function onLoginInputFocus(): void {
    setIsSearchHiddenOverride(false)
  }

  function onLoginInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case 'Tab':
        if (!selectedUser && matchingUser) setSelectedUser(matchingUser)
        setIsSearchHiddenOverride(true)
        break
      case 'Escape':
        event.preventDefault()
        ;(event.target as HTMLInputElement).blur()
        setCurrentNavigationIndex(0)
        setIsSearchHiddenOverride(true)
        setSelectedUser(null)
        break
      case 'ArrowUp':
        navigateSearchResultsWithKeyboard(event, -1)
        break
      case 'ArrowDown':
        navigateSearchResultsWithKeyboard(event, 1)
        break
    }
  }

  function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigationRefs.current[0]!.blur()
    if (!selectedUser && matchingUser) setSelectedUser(matchingUser)
    if (isPushEnabled) push()
  }

  function setUserFromSearch(user: User) {
    setCurrentLoginInput(user.login)
    setSelectedUser(user)
    push()
  }

  function onSearchResultKeyDownGenerator(user: User) {
    return (event: KeyboardEvent<HTMLLIElement>) => {
      switch (event.key) {
        case 'Tab':
          event.preventDefault()
          setIsSearchHiddenOverride(true)
          setSelectedUser(user)
          setCurrentNavigationIndex(0)
          ;(buttonRef.current! as HTMLAnchorElement).focus()
          break
        case 'Enter':
          setCurrentNavigationIndex(0)
          setUserFromSearch(user)
          break
        case 'Escape':
          setCurrentNavigationIndex(0)
          setIsSearchHiddenOverride(true)
          setSelectedUser(null)
          break
        case 'ArrowUp':
          navigateSearchResultsWithKeyboard(event, -1)
          break
        case 'ArrowDown':
          navigateSearchResultsWithKeyboard(event, 1)
          break
      }
    }
  }

  function onSearchResultFocusGenerator(user: User) {
    return () => {
      setSelectedUser(user)
    }
  }

  const aElementAttributes: {[attribute: string]: string} = {}
  let currentIndicatorElement: JSX.Element
  if (isTypingInProgress) {
    currentIndicatorElement = (
      <div className="UserSearch-indicator-typing"><span>.</span><span>.</span><span>.</span></div>
    )
  } else if (currentLoginInput && didSearchErrorOccur) {
    aElementAttributes['href'] = `https://github.com/${currentLoginInput}`
    currentIndicatorElement = (
      <div className="UserSearch-indicator-mark" key="exclamation-mark">!</div>
    )
  } else if (selectedUser) {
    aElementAttributes['href'] = `https://github.com/${selectedUser.login}`
    currentIndicatorElement = (
      <div
        className="UserSearch-indicator-avatar" style={{ backgroundImage: `url(${selectedUser.avatar_url}&s=144` }}
        key="avatar"
      ></div>
    )
  } else if (matchingUser) {
    aElementAttributes['href'] = `https://github.com/${matchingUser.login}`
    currentIndicatorElement = (
      <div
        className="UserSearch-indicator-avatar" style={{ backgroundImage: `url(${matchingUser.avatar_url}&s=144` }}
        key="avatar"
      ></div>
    )
  } else {
    currentIndicatorElement = (
      <div className="UserSearch-indicator-mark" key="question-mark">?</div>
    )
  }

  return (
    <form className="UserSearch" ref={formRef} onSubmit={onFormSubmit}>
      <Card continueBottom={isSearchShown} noPaddingRight>
        <>
          <a {...aElementAttributes} target="_blank" rel="noopener noreferrer">
            <div className="UserSearch-indicator" style={{ opacity: isPushEnabled ? 1 : ''}} >
              {currentIndicatorElement}
            </div>
          </a>
          <input
            className="UserSearch-login" type="search" name="login"
            ref={ref => navigationRefs.current[0] = ref as HTMLInputElement} tabIndex={0}
            value={selectedUser ? selectedUser.login : currentLoginInput} maxLength={39}
            spellCheck={false} placeholder="GitHub user/org" autoCapitalize="off" autoComplete="off" autoCorrect="off"
            autoFocus onChange={onLoginInputChange} onFocus={onLoginInputFocus} onKeyDown={onLoginInputKeyDown}
          />
          <button className="UserSearch-button" type="submit" disabled={!isPushEnabled} ref={buttonRef}>→</button>
        </>
      </Card>
      <UserSearchResults
        isSearchShown={isSearchShown} currentSearchResults={currentSearchResults} setUserFromSearch={setUserFromSearch}
        navigationRefs={navigationRefs} onSearchResultKeyDownGenerator={onSearchResultKeyDownGenerator}
        onSearchResultFocusGenerator={onSearchResultFocusGenerator}
      />
    </form>
  )
}
