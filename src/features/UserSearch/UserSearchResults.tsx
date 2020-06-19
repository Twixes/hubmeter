import React, { KeyboardEvent, MutableRefObject, Dispatch, SetStateAction } from 'react'
import { AnimatePresence, motion, useReducedMotion, Variants } from 'framer-motion'
import { User } from '../../api/github'
import './UserSearchResults.scss'

interface Props {
  setCurrentLoginInput: Dispatch<SetStateAction<string>>
  matchingUser: User | null
  setSelectedUser: Dispatch<SetStateAction<User | null>>
  setIsSearchHiddenOverride: Dispatch<SetStateAction<boolean>>
  currentSearchResults: User[]
  setCurrentNavigationIndex: Dispatch<SetStateAction<number>>
  buttonRef: MutableRefObject<HTMLButtonElement | null>
  navigationRefs: MutableRefObject<(HTMLElement | null)[]>
  isSearchShown: boolean
  submit: () => void
  navigateSearchResultsWithKeyboard: (event: KeyboardEvent<HTMLElement>, direction: number) => void
}

const VARIANTS: Variants = {
  hidden: ([shouldReduceMotion, numberOfResults]: [boolean, number]) => {
    return {
      height: shouldReduceMotion ? `${numberOfResults * 3}rem` : 0,
      opacity: shouldReduceMotion ? 0 : 1
    }
  },
  shown: ([, numberOfResults]: [boolean, number]) => {
    return {
      height: `${numberOfResults * 3}rem`,
      opacity: 1
    }
  }
}

export default function UserSearchResults(
  {
    setCurrentLoginInput, matchingUser, setSelectedUser, currentSearchResults, setIsSearchHiddenOverride,
    setCurrentNavigationIndex, buttonRef, navigationRefs, isSearchShown, submit, navigateSearchResultsWithKeyboard
  }: Props
): JSX.Element {
  const shouldReduceMotion = useReducedMotion()

  function setUserFromSearch(user: User) {
    setCurrentLoginInput(user.login)
    setSelectedUser(user)
    submit()
  }

  function onSearchResultKeyDownGenerator(user: User) {
    return (event: KeyboardEvent<HTMLLIElement>) => {
      switch (event.key) {
        case 'Tab':
          event.preventDefault()
          setIsSearchHiddenOverride(true)
          setSelectedUser(user)
          setCurrentNavigationIndex(0)
          ;(buttonRef.current! as HTMLButtonElement).focus()
          break
        case 'Enter':
          setCurrentNavigationIndex(0)
          setUserFromSearch(user)
          break
        case 'Escape':
          if (matchingUser) setCurrentLoginInput(matchingUser.login)
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

  return (
    <AnimatePresence>
      {isSearchShown && <motion.ul
        className="UserSearchResults" custom={[shouldReduceMotion, currentSearchResults.length]} variants={VARIANTS}
        initial="hidden" animate="shown" exit="hidden"
      >
        {currentSearchResults.map((user, index) => (
            <li
              className="UserSearchResults-user" key={user.login} tabIndex={index + 1}
              ref={ref => navigationRefs.current[1 + index] = ref as HTMLLIElement}
              onClick={() => { setUserFromSearch(user) }} onKeyDown={onSearchResultKeyDownGenerator(user)}
              onFocus={() => { setSelectedUser(user) }}
            >
              <a href={`https://github.com/${user.login}`} target="_blank" rel="noopener noreferrer" tabIndex={-1}>
                <div className="UserSearch-indicator" style={{ opacity: 1 }}>
                  <div
                    className="UserSearch-indicator-avatar"
                    style={{ backgroundImage: `url(${user.avatar_url}&s=144` }}></div>
                </div>
              </a>
              <div className="UserSearch-login">
                {user.login}
              </div>
            </li>
          )
        )}
      </motion.ul>}
    </AnimatePresence>
  )
}
