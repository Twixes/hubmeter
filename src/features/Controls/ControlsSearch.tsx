import './ControlsSearch.scss'

import React, { ChangeEvent, Dispatch, KeyboardEvent, MutableRefObject, SetStateAction, useState } from 'react'

import { fetchSearchUsers, User } from '../../github-api'

interface Props {
    currentLoginInput: string
    setCurrentLoginInput: Dispatch<SetStateAction<string>>
    matchingUser: User | null
    setMatchingUser: Dispatch<SetStateAction<User | null>>
    selectedUser: User | null
    setSelectedUser: Dispatch<SetStateAction<User | null>>
    setIsSearchHiddenOverride: Dispatch<SetStateAction<boolean>>
    isTypingInProgress: boolean
    setIsTypingInProgress: Dispatch<SetStateAction<boolean>>
    didSearchErrorOccur: boolean
    setDidSearchErrorOccur: Dispatch<SetStateAction<boolean>>
    setCurrentSearchResults: Dispatch<SetStateAction<User[]>>
    setCurrentNavigationIndex: Dispatch<SetStateAction<number>>
    isSearchShown: boolean
    isSubmitEnabled: boolean
    navigateSearchResultsWithKeyboard: (event: KeyboardEvent<HTMLElement>, direction: number) => void
    buttonRef: MutableRefObject<HTMLButtonElement | null>
    navigationRefs: MutableRefObject<(HTMLElement | null)[]>
}

const MAX_SEARCH_RESULTS_SHOWN = 4

export default function ControlsSearch({
    currentLoginInput,
    setCurrentLoginInput,
    matchingUser,
    setMatchingUser,
    selectedUser,
    setSelectedUser,
    setIsSearchHiddenOverride,
    isTypingInProgress,
    setIsTypingInProgress,
    didSearchErrorOccur,
    setDidSearchErrorOccur,
    setCurrentSearchResults,
    setCurrentNavigationIndex,
    isSearchShown,
    isSubmitEnabled,
    navigateSearchResultsWithKeyboard,
    buttonRef,
    navigationRefs
}: Props): JSX.Element {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const [typingTimeout, setTypingTimeout] = useState(setTimeout(() => {}, 0))

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
        setTypingTimeout(
            setTimeout(async () => {
                if (originalValue) {
                    try {
                        const users = await fetchSearchUsers(originalValue)
                        if (element.value !== originalValue) return // cancel if input value has changed in the meantime
                        if (users.length && users[0].login.toLowerCase() === originalValue.toLowerCase())
                            setMatchingUser(users[0])
                        setCurrentSearchResults(users.slice(0, MAX_SEARCH_RESULTS_SHOWN))
                    } catch (error) {
                        setDidSearchErrorOccur(true)
                        setCurrentSearchResults([])
                    } finally {
                        setIsTypingInProgress(false)
                    }
                } else {
                    setIsTypingInProgress(false)
                }
            }, 500)
        )
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
                if (matchingUser) setCurrentLoginInput(matchingUser.login)
                setSelectedUser(null)
                setIsSearchHiddenOverride(true)
                setCurrentNavigationIndex(0)
                break
            case 'ArrowUp':
                navigateSearchResultsWithKeyboard(event, -1)
                break
            case 'ArrowDown':
                navigateSearchResultsWithKeyboard(event, 1)
                break
        }
    }

    const anchorAttributes: { [attribute: string]: string } = {}
    let currentIndicatorElement: JSX.Element
    if (isTypingInProgress) {
        currentIndicatorElement = (
            <div className="Controls-indicator-typing">
                <span>.</span>
                <span>.</span>
                <span>.</span>
            </div>
        )
    } else if (currentLoginInput && didSearchErrorOccur) {
        anchorAttributes.href = `https://github.com/${currentLoginInput}`
        currentIndicatorElement = (
            <div className="Controls-indicator-mark" key="exclamation-mark">
                !
            </div>
        )
    } else if (selectedUser) {
        anchorAttributes.href = `https://github.com/${selectedUser.login}`
        currentIndicatorElement = (
            <div
                className="Controls-indicator-avatar"
                style={{ backgroundImage: `url(${selectedUser.avatar_url}&s=144` }}
                key="avatar"
            />
        )
    } else if (matchingUser) {
        anchorAttributes.href = `https://github.com/${matchingUser.login}`
        currentIndicatorElement = (
            <div
                className="Controls-indicator-avatar"
                style={{ backgroundImage: `url(${matchingUser.avatar_url}&s=144` }}
                key="avatar"
            />
        )
    } else {
        currentIndicatorElement = (
            <div className="Controls-indicator-mark" key="question-mark">
                ?
            </div>
        )
    }

    return (
        <div
            className="ControlsSearch"
            style={isSearchShown ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } : {}}
        >
            <a {...anchorAttributes} target="_blank" rel="noopener noreferrer">
                <div className="Controls-indicator" style={{ opacity: isSubmitEnabled ? 1 : '' }}>
                    {currentIndicatorElement}
                </div>
            </a>
            <input
                className="Controls-login"
                type="search"
                name="login"
                ref={(ref) => {
                    navigationRefs.current[0] = ref as HTMLInputElement
                }}
                tabIndex={0}
                value={selectedUser ? selectedUser.login : currentLoginInput}
                maxLength={39}
                spellCheck={false}
                placeholder="GitHub user/org"
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                autoFocus
                onChange={onLoginInputChange}
                onFocus={onLoginInputFocus}
                onKeyDown={onLoginInputKeyDown}
            />
            <button
                className="ControlsSearch-button"
                type="submit"
                disabled={!isSubmitEnabled}
                ref={buttonRef}
                style={isSearchShown ? { borderBottomRightRadius: 0 } : {}}
            >
                →
            </button>
        </div>
    )
}
