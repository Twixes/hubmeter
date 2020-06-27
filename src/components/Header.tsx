import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Header.scss'

function calculateCurrentClockHandRotation(extraRotations: number = 0): number {
  const now = new Date()
  const hoursPrecise = now.getHours() + now.getMinutes() / 60
  return Math.round((hoursPrecise / 12 + extraRotations) * 360)
}

export default function Header(): JSX.Element {
  const [extraRotations, setExtraRotations] = useState(0)
  const [clockHandRotation, setClockHandRotation] = useState(calculateCurrentClockHandRotation(extraRotations))

  const updateClockHandTransform = useCallback(() => {
    setClockHandRotation(calculateCurrentClockHandRotation(extraRotations))
  }, [extraRotations])

  useEffect(() => {
    updateClockHandTransform()
    const interval = setInterval(updateClockHandTransform, 60_000)
    return () => clearInterval(interval)
  }, [updateClockHandTransform])

  return (
    <header className="Header">
      <Link to="/" className="Header-link" onClick={() => { setExtraRotations(extraRotations + 1) }}>
        <div className="Header-logo">
          <svg
            id="Header-clock" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="20" cy="20" r="18" strokeWidth="4"/>
            <motion.line
              className="Header-clock-hand" transition={{ type: 'spring', damping: 22, stiffness: 140, mass: 2 }}
              initial={{ rotate: clockHandRotation }} animate={{ rotate: clockHandRotation }}
              x1="20" y1="22" x2="20" y2="7" strokeWidth="4"
            />
          </svg>
          <div className="Header-name">HubMeter</div>
        </div>
      </Link>
      <nav className="Header-nav">
        <a href="https://www.producthunt.com/posts/hubmeter">
          <svg
            className="Header-icon" width="32" height="32" viewBox="0 0 32 32" fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd" clipRule="evenodd" d="M16 32C24.8365 32 32 24.8365 32 16C32 7.16347 24.8365 0 16
              0C7.16347 0 0 7.16347 0 16C0 24.8365 7.16347 32 16 32ZM18.1333 16.0001V15.9999C19.4588 15.9999 20.5333
              14.9254 20.5333 13.5999C20.5333 12.2745 19.4588 11.1999 18.1333
              11.1999V11.2001H13.6V16.0001H18.1333ZM18.1333 8.00008V7.99995C21.2261 7.99995 23.7333 10.5071 23.7333
              13.5999C23.7333 16.6927 21.2261 19.1999 18.1333 19.1999V19.2001H13.6V23.9999H10.4V7.99995L18.1333
              8.00008Z"
            />
          </svg>
        </a>
        <a href="http://github.com/Twixes/hubmeter">
          <svg
            className="Header-icon" width="32" height="31" viewBox="0 0 32 31" fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd" clipRule="evenodd" d="M15.9985 -3.05176e-05C7.16437 -3.05176e-05 0 7.11511 0
              15.8927C0 22.9142 4.58406 28.8703 10.942 30.9718C11.7425 31.1181 12.0343 30.6274 12.0343
              30.206C12.0343 29.8284 12.0205 28.8294 12.0126 27.5035C7.56218 28.4635 6.62317 25.3728 6.62317
              25.3728C5.89534 23.5367 4.84632 23.0479 4.84632 23.0479C3.39361 22.0625 4.95633 22.082 4.95633
              22.082C6.56227 22.1942 7.40698 23.7201 7.40698 23.7201C8.83416 26.1484 11.1522 25.4469 12.0637
              25.0401C12.2091 24.0137 12.6226 23.3132 13.0793 22.9162C9.52663 22.5152 5.79122 21.1513 5.79122
              15.0615C5.79122 13.3269 6.41494 11.9073 7.43842 10.7971C7.27341 10.3951 6.72434 8.77854 7.59557
              6.59121C7.59557 6.59121 8.93827 6.1639 11.995 8.22049C13.2709 7.86732 14.6401 7.6917 16.0005
              7.68487C17.3599 7.6917 18.7281 7.86732 20.006 8.22049C23.0607 6.1639 24.4015 6.59121 24.4015
              6.59121C25.2747 8.77854 24.7256 10.3951 24.5616 10.7971C25.587 11.9073 26.2058 13.3269 26.2058
              15.0615C26.2058 21.1669 22.4645 22.5103 18.901 22.9035C19.4746 23.3942 19.9864 24.364 19.9864
              25.8459C19.9864 27.9708 19.9667 29.685 19.9667 30.206C19.9667 30.6313 20.2555 31.126 21.0668
              30.9708C27.4199 28.8645 32 22.9123 32 15.8927C32 7.11511 24.8356 -3.05176e-05 15.9985 -3.05176e-05Z"
            />
          </svg>
        </a>
      </nav>
    </header>
  )
}
