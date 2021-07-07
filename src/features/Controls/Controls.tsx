/** @jsxImportSource @emotion/react */

import { motion } from 'framer-motion'
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'

import { currentUserState, timeZoneUtcOffsetState } from '../../atoms'
import { Select } from '../../components/Expandable/CheckboxExpandable'
import { RadioExpandable } from '../../components/Expandable/RadioExpandable'
import { eventTypeToName, User } from '../../github-api'
import { useOutsideClickHandler } from '../../hooks/useOutsideClickHandler'
import ControlsSearch from './ControlsSearch'
import ControlsSearchResults from './ControlsSearchResults'
import { controls, controlsGrid } from './styles'

export default function Controls(): JSX.Element {
    const currentUser = useRecoilValue(currentUserState)
    const [timeZoneUtcOffset, setTimeZoneUtcOffset] = useRecoilState(timeZoneUtcOffsetState)

    const { login } = useParams<{ login: string | undefined }>()
    const history = useHistory()
    const formRef = useRef(null)
    const buttonRef = useRef<HTMLButtonElement | null>(null)
    const navigationRefs = useRef<(HTMLElement | null)[]>(Array<HTMLElement | null>(5).fill(null))

    const [currentLoginInput, setCurrentLoginInput] = useState<string>((currentUser ? currentUser.login : login) || '')
    const [matchingUser, setMatchingUser] = useState<User | null>(currentUser)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [currentSearchResults, setCurrentSearchResults] = useState<User[]>([])
    const [isSearchHiddenOverride, setIsSearchHiddenOverride] = useState<boolean>(false)
    const [isTypingInProgress, setIsTypingInProgress] = useState<boolean>(false)
    const [didSearchErrorOccur, setDidSearchErrorOccur] = useState<boolean>(false)
    const [currentNavigationIndex, setCurrentNavigationIndex] = useState(0)

    const linkLogin: string = selectedUser ? selectedUser.login : matchingUser ? matchingUser.login : currentLoginInput
    const isSearchShown = Boolean(
        currentLoginInput && !isTypingInProgress && !isSearchHiddenOverride !== false && currentSearchResults.length
    )
    const isSubmitEnabled = Boolean(
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
        if (currentUser) {
            setCurrentLoginInput(currentUser.login)
            setMatchingUser(currentUser)
        }
    }, [currentUser, setCurrentLoginInput, setMatchingUser])

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
        const nextNavigationIndex = Math.min(
            Math.max(currentNavigationIndex + direction, 0),
            currentSearchResults.length
        )
        const nextNavigationElement: HTMLElement | null = navigationRefs.current[nextNavigationIndex]
        if (!nextNavigationElement) return
        event.preventDefault()
        setCurrentNavigationIndex(nextNavigationIndex)
        nextNavigationElement.focus()
        if (nextNavigationIndex <= 0) {
            setSelectedUser(null)
            ;(nextNavigationElement as HTMLInputElement).setSelectionRange(
                currentLoginInput.length,
                currentLoginInput.length
            )
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
        <motion.form css={controls} ref={formRef} onSubmit={onFormSubmit}>
            <ControlsSearch
                currentLoginInput={currentLoginInput}
                setCurrentLoginInput={setCurrentLoginInput}
                matchingUser={matchingUser}
                setMatchingUser={setMatchingUser}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                setIsSearchHiddenOverride={setIsSearchHiddenOverride}
                isTypingInProgress={isTypingInProgress}
                setIsTypingInProgress={setIsTypingInProgress}
                didSearchErrorOccur={didSearchErrorOccur}
                setDidSearchErrorOccur={setDidSearchErrorOccur}
                setCurrentSearchResults={setCurrentSearchResults}
                setCurrentNavigationIndex={setCurrentNavigationIndex}
                isSearchShown={isSearchShown}
                isSubmitEnabled={isSubmitEnabled}
                navigateSearchResultsWithKeyboard={navigateSearchResultsWithKeyboard}
                buttonRef={buttonRef}
                navigationRefs={navigationRefs}
            />
            <ControlsSearchResults
                setCurrentLoginInput={setCurrentLoginInput}
                matchingUser={matchingUser}
                setSelectedUser={setSelectedUser}
                currentSearchResults={currentSearchResults}
                setIsSearchHiddenOverride={setIsSearchHiddenOverride}
                setCurrentNavigationIndex={setCurrentNavigationIndex}
                isSearchShown={isSearchShown}
                buttonRef={buttonRef}
                navigationRefs={navigationRefs}
                submit={submit}
                navigateSearchResultsWithKeyboard={navigateSearchResultsWithKeyboard}
            />
            {login && (
                <div css={controlsGrid}>
                    <Select label="Event types" localStorageKey="filters" options={Object.entries(eventTypeToName)} />
                    <RadioExpandable
                        label="Time zone"
                        possibilities={[
                            { value: -660, label: 'UTC-11:00 – Midway' },
                            { value: -600, label: 'UTC-10:00 – Honolulu' },
                            { value: -540, label: 'UTC-09:00 – Aleutian Islands' },
                            { value: -480, label: 'UTC-08:00 – Anchorage' },
                            { value: -420, label: 'UTC-07:00 – San Francisco, Seattle, Vancouver' },
                            { value: -360, label: 'UTC-06:00 – Denver, Calgary' },
                            { value: -300, label: 'UTC-05:00 – Chicago, Dallas, Mexico, Bogota' },
                            { value: -240, label: 'UTC-04:00 – New York, Detroit, Santiago, Caracas' },
                            {
                                value: -180,
                                label: 'UTC-03:00 – Halifax, Rio de Janeiro, Buenos Aires'
                            },
                            { value: -120, label: 'UTC-02:00 – Nuuk' },
                            { value: -60, label: 'UTC-01:00 – Cape Verde' },
                            { value: 0, label: 'UTC±00:00 – Reykjavík, Dakar' },
                            { value: 60, label: 'UTC+01:00 – London, Dublin, Lisbon, Lagos' },
                            { value: 120, label: 'UTC+02:00 – Paris, Warsaw, Cairo, Cape Town' },
                            { value: 180, label: 'UTC+03:00 – Athens, Helsinki, Moscow, Nairobi' },
                            { value: 240, label: 'UTC+04:00 – Dubai, Baku, Tbilisi, Samara' },
                            { value: 270, label: 'UTC+04:30 – Tehran, Kabul' },
                            { value: 300, label: 'UTC+05:00 – Islamabad, Yekaterinburg' },
                            { value: 330, label: 'UTC+05:30 – New Delhi, Bombai' },
                            { value: 360, label: 'UTC+06:00 – Nursultan, Omsk, Dhaka' },
                            { value: 420, label: 'UTC+07:00 – Jakarta, Bangkok, Novosibirsk' },
                            { value: 480, label: 'UTC+08:00 – Beijing, Hong Kong, Perth, Manila' },
                            { value: 540, label: 'UTC+09:00 – Tokyo, Seoul, Yakutsk, Manokwari' },
                            { value: 570, label: 'UTC+09:30 – Adelaide' },
                            { value: 600, label: 'UTC+10:00 – Sydney, Vladivostok' },
                            { value: 660, label: 'UTC+11:00 – Magadan' },
                            { value: 720, label: 'UTC+12:00 – Auckland, Kamchatka' }
                        ]}
                        selectedValue={timeZoneUtcOffset}
                        onChange={(selectedPossibility) =>
                            selectedPossibility && setTimeZoneUtcOffset(selectedPossibility.value)
                        }
                    />
                </div>
            )}
        </motion.form>
    )
}
