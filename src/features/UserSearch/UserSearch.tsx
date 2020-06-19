import React, { useState, useRef, FormEvent, KeyboardEvent } from 'react'
import { useHistory } from 'react-router-dom'
import { User } from '../../api/github'
import { useOutsideClickHandler} from '../../components/utils'
import UserSearchControls from './UserSearchControls'
import UserSearchResults from './UserSearchResults'
import './UserSearch.scss'

interface Props {
  login: string
}

export default function UserSearch({ login }: Props): JSX.Element {
  const [currentLoginInput, setCurrentLoginInput] = useState<string>(login)
  const [matchingUser, setMatchingUser] = useState<User | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [currentSearchResults, setCurrentSearchResults] = useState<User[]>([])
  const [isSearchHiddenOverride, setIsSearchHiddenOverride] = useState<boolean>(false)
  const [isTypingInProgress, setIsTypingInProgress] = useState<boolean>(false)
  const [didSearchErrorOccur, setDidSearchErrorOccur] = useState<boolean>(false)
  const [currentNavigationIndex, setCurrentNavigationIndex] = useState(0)

  const history = useHistory()
  const formRef = useRef(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const navigationRefs = useRef<(HTMLElement | null)[]>(Array<HTMLElement | null>(5).fill(null))

  useOutsideClickHandler(formRef, () => {
    if (matchingUser) setCurrentLoginInput(matchingUser.login)
    setSelectedUser(null)
    setIsSearchHiddenOverride(true)
    setCurrentNavigationIndex(0)
  })

  const linkLogin: string = selectedUser ? selectedUser.login : matchingUser ? matchingUser.login : currentLoginInput
  const isSearchShown: boolean = Boolean(
    currentLoginInput && !isTypingInProgress && !isSearchHiddenOverride !== false && currentSearchResults.length
  )
  const isSubmitEnabled: boolean = Boolean(
    currentLoginInput &&
    (didSearchErrorOccur || isTypingInProgress || (!isTypingInProgress && (matchingUser || selectedUser)))
  )

  function submit() {
    setCurrentLoginInput(linkLogin)
    setIsSearchHiddenOverride(true)
    setCurrentNavigationIndex(0)
    history.push(`/${linkLogin}`)
  }

  function navigateSearchResultsWithKeyboard(event: KeyboardEvent<HTMLElement>, direction: number) {
    if (!isSearchShown) return
    const nextNavigationIndex = Math.min(Math.max(currentNavigationIndex + direction, 0), currentSearchResults.length)
    const nextNavigationElement: HTMLElement | null = navigationRefs.current[nextNavigationIndex]
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

  function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigationRefs.current[0]!.blur()
    if (!selectedUser && matchingUser) setSelectedUser(matchingUser)
    if (isSubmitEnabled) submit()
  }

  return (
    <form className="UserSearch" ref={formRef} onSubmit={onFormSubmit}>
      <UserSearchControls
        currentLoginInput={currentLoginInput} setCurrentLoginInput={setCurrentLoginInput} matchingUser={matchingUser}
        setMatchingUser={setMatchingUser} selectedUser={selectedUser} setSelectedUser={setSelectedUser}
        setIsSearchHiddenOverride={setIsSearchHiddenOverride} isTypingInProgress={isTypingInProgress}
        setIsTypingInProgress={setIsTypingInProgress} didSearchErrorOccur={didSearchErrorOccur}
        setDidSearchErrorOccur={setDidSearchErrorOccur} setCurrentSearchResults={setCurrentSearchResults}
        setCurrentNavigationIndex={setCurrentNavigationIndex} isSearchShown={isSearchShown}
        isSubmitEnabled={isSubmitEnabled} navigateSearchResultsWithKeyboard={navigateSearchResultsWithKeyboard}
        buttonRef={buttonRef} navigationRefs={navigationRefs}
      />
      <UserSearchResults
        setCurrentLoginInput={setCurrentLoginInput} matchingUser={matchingUser} setSelectedUser={setSelectedUser}
        currentSearchResults={currentSearchResults} setIsSearchHiddenOverride={setIsSearchHiddenOverride}
        setCurrentNavigationIndex={setCurrentNavigationIndex} isSearchShown={isSearchShown} buttonRef={buttonRef}
        navigationRefs={navigationRefs} submit={submit}
        navigateSearchResultsWithKeyboard={navigateSearchResultsWithKeyboard}
      />
    </form>
  )
}
