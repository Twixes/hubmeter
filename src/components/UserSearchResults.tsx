import React, { KeyboardEvent, MutableRefObject } from 'react'
import { AnimatePresence, motion, useReducedMotion, Variants } from 'framer-motion'
import { User } from '../api/github'
import './UserSearchResults.scss'

interface Props {
  isSearchShown: boolean
  currentSearchResults: User[]
  setUserFromSearch: (user: User) => void
  navigationRefs: MutableRefObject<(HTMLElement | undefined)[]>
  onSearchResultKeyDownGenerator: (user: User) => (event: KeyboardEvent<HTMLLIElement>) => void
  onSearchResultFocusGenerator: (user: User) => () => void
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
    isSearchShown, currentSearchResults, setUserFromSearch, navigationRefs, onSearchResultKeyDownGenerator,
    onSearchResultFocusGenerator
  }: Props
): JSX.Element {
  const shouldReduceMotion = useReducedMotion()

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
              onClick={() => {setUserFromSearch(user)}} onKeyDown={onSearchResultKeyDownGenerator(user)}
              onFocus={onSearchResultFocusGenerator(user)}
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
