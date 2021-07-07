/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import { AnimatePresence, motion, useReducedMotion, Variants } from 'framer-motion'
import React, { Dispatch, KeyboardEvent, MutableRefObject, SetStateAction } from 'react'

import { User } from '../../github-api'
import { card, expandableExpandedBottom } from '../../styles'
import { controlsIndicator, controlsIndicatorAvatar, controlsLogin } from './styles'

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

const controlsSearchResults = css`
    z-index: 1000;
    position: absolute;
    flex-direction: column;
    top: 3rem;
    width: 100%;
    padding: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    overflow: hidden;
`

const controlsSearchResultsUser = css`
    transition: background var(--duration-short) var(--timing-function-standard),
        border-color var(--duration-short) var(--timing-function-standard);
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 3rem;
    padding-left: 0.75rem;
    outline: none;
    text-align: left;
    font-size: 1.5rem;
    cursor: pointer;
    &:not(:last-child) {
        border-bottom: 1px solid var(--color-shadow);
    }
    &:hover,
    &:focus {
        border-top-color: transparent;
        background: var(--color-mark);
    }
`

export default function ControlsSearchResults({
    setCurrentLoginInput,
    matchingUser,
    setSelectedUser,
    currentSearchResults,
    setIsSearchHiddenOverride,
    setCurrentNavigationIndex,
    buttonRef,
    navigationRefs,
    isSearchShown,
    submit,
    navigateSearchResultsWithKeyboard
}: Props): JSX.Element {
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
            {isSearchShown && (
                <motion.ul
                    css={[card, controlsSearchResults, expandableExpandedBottom]}
                    custom={[shouldReduceMotion, currentSearchResults.length]}
                    variants={VARIANTS}
                    initial="hidden"
                    animate="shown"
                    exit="hidden"
                >
                    {currentSearchResults.map((user, index) => (
                        <li
                            css={controlsSearchResultsUser}
                            key={user.login}
                            tabIndex={index + 1}
                            ref={(ref) => {
                                navigationRefs.current[1 + index] = ref as HTMLLIElement
                            }}
                            onClick={() => {
                                setUserFromSearch(user)
                            }}
                            onKeyDown={onSearchResultKeyDownGenerator(user)}
                            onFocus={() => {
                                setSelectedUser(user)
                            }}
                        >
                            <a
                                href={`https://github.com/${user.login}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                tabIndex={-1}
                            >
                                <div css={controlsIndicator} style={{ opacity: 1 }}>
                                    <div
                                        css={controlsIndicatorAvatar}
                                        style={{ backgroundImage: `url(${user.avatar_url}&s=144` }}
                                    />
                                </div>
                            </a>
                            <div css={controlsLogin}>{user.login}</div>
                        </li>
                    ))}
                </motion.ul>
            )}
        </AnimatePresence>
    )
}
