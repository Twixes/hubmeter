import React, { useState, useEffect, useRef, FormEvent, KeyboardEvent } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { motion } from 'framer-motion'
import { useOutsideClickHandler } from '../../utils'
import { User } from '../../github-api'
import { currentUserState } from '../../atoms'
import ControlsSearch from './ControlsSearch'
import ControlsSearchResults from './ControlsSearchResults'
import './Controls.scss'

export default function Controls(): JSX.Element {
  const currentUser = useRecoilValue(currentUserState)

  const { login } = useParams<{ login: string | undefined }>()
  const history = useHistory()
  const formRef = useRef(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const navigationRefs = useRef<(HTMLElement | null)[]>(Array<HTMLElement | null>(5).fill(null))

  const [currentLoginInput, setCurrentLoginInput] = useState<string>(
    (currentUser ? currentUser.login : login) || ''
  )
  const [matchingUser, setMatchingUser] = useState<User | null>(currentUser)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [currentSearchResults, setCurrentSearchResults] = useState<User[]>([])
  const [isSearchHiddenOverride, setIsSearchHiddenOverride] = useState<boolean>(false)
  const [isTypingInProgress, setIsTypingInProgress] = useState<boolean>(false)
  const [didSearchErrorOccur, setDidSearchErrorOccur] = useState<boolean>(false)
  const [currentNavigationIndex, setCurrentNavigationIndex] = useState(0)

  const linkLogin: string = selectedUser ? selectedUser.login : matchingUser ? matchingUser.login : currentLoginInput
  const isSearchShown: boolean = Boolean(
    currentLoginInput && !isTypingInProgress && !isSearchHiddenOverride !== false && currentSearchResults.length
  )
  const isSubmitEnabled: boolean = Boolean(
    currentLoginInput &&
    (didSearchErrorOccur || isTypingInProgress || (!isTypingInProgress && (matchingUser || selectedUser)))
  )

  useOutsideClickHandler(formRef, () => {
    if (!isSearchShown) return
    if (matchingUser) setCurrentLoginInput(matchingUser.login)
    setSelectedUser(null)
    setIsSearchHiddenOverride(true)
    setCurrentNavigationIndex(0)
  })

  useEffect(() => {
    if (!currentUser) return
    setCurrentLoginInput(currentUser.login)
    setMatchingUser(currentUser)
    history.replace(`/${currentUser.login}`)
  }, [currentUser, setCurrentLoginInput, setMatchingUser, history])

  useEffect(() => {
    setCurrentLoginInput(login || '')
    if (!login) {
      setMatchingUser(null)
      setSelectedUser(null)
    }
  }, [login])

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
      setSelectedUser(currentSearchResults[nextNavigationIndex - 1])
    }
  }

  function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigationRefs.current[0]!.blur()
    if (!selectedUser && matchingUser) setSelectedUser(matchingUser)
    if (isSubmitEnabled) submit()
  }

  return (
    <motion.form className="Controls" ref={formRef} onSubmit={onFormSubmit} positionTransition>
      <ControlsSearch
        currentLoginInput={currentLoginInput} setCurrentLoginInput={setCurrentLoginInput} matchingUser={matchingUser}
        setMatchingUser={setMatchingUser} selectedUser={selectedUser} setSelectedUser={setSelectedUser}
        setIsSearchHiddenOverride={setIsSearchHiddenOverride} isTypingInProgress={isTypingInProgress}
        setIsTypingInProgress={setIsTypingInProgress} didSearchErrorOccur={didSearchErrorOccur}
        setDidSearchErrorOccur={setDidSearchErrorOccur} setCurrentSearchResults={setCurrentSearchResults}
        setCurrentNavigationIndex={setCurrentNavigationIndex} isSearchShown={isSearchShown}
        isSubmitEnabled={isSubmitEnabled} navigateSearchResultsWithKeyboard={navigateSearchResultsWithKeyboard}
        buttonRef={buttonRef} navigationRefs={navigationRefs}
      />
      <ControlsSearchResults
        setCurrentLoginInput={setCurrentLoginInput} matchingUser={matchingUser} setSelectedUser={setSelectedUser}
        currentSearchResults={currentSearchResults} setIsSearchHiddenOverride={setIsSearchHiddenOverride}
        setCurrentNavigationIndex={setCurrentNavigationIndex} isSearchShown={isSearchShown} buttonRef={buttonRef}
        navigationRefs={navigationRefs} submit={submit}
        navigateSearchResultsWithKeyboard={navigateSearchResultsWithKeyboard}
      />
    </motion.form>
  )
}
