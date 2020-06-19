import React, { KeyboardEvent } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import Card from './Card'
import { User } from '../api/github'
import './UserSearchResults.scss'

interface Props {
  isSearchShown: boolean
  currentLoginInput: string
  users: User[]
  setUserFromSearch: (user: User) => void
  onSearchResultKeyDownedGenerator: (user: User) => (event: KeyboardEvent<HTMLLIElement>) => void
}

const MAX_RESULTS_SHOWN: number = 4

const VARIANTS: Variants = {
  hidden: {
    height: 0
  },
  shown: (numberOfResults: number) => {
    return {
      height: `${Math.min(numberOfResults, MAX_RESULTS_SHOWN) * 3}rem`
    }
  }
};

export default function UserSearchResults(
  { isSearchShown, currentLoginInput, users, setUserFromSearch, onSearchResultKeyDownedGenerator }: Props
): JSX.Element {
  return (
    <AnimatePresence>
      {isSearchShown && <motion.ul
        className="UserSearchResults" custom={users.length} variants={VARIANTS}
        initial="hidden"
        animate="shown"
        exit="hidden"
      >
        {users.slice(0, MAX_RESULTS_SHOWN).map(user =>(
            <li
              className="UserSearchResults-user" key={user.login}
              onClick={() => {setUserFromSearch(user)}} onKeyDown={onSearchResultKeyDownedGenerator(user)}>
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
              <div className="UserSearch-action">
                {user.login.toLowerCase() === currentLoginInput.toLowerCase() ? '✓' : ''}
              </div>
            </li>
          )
        )}
      </motion.ul>}
    </AnimatePresence>
  )
}
