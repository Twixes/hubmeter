import { RefObject, useEffect } from 'react'

export function useOutsideClickHandler(ref: RefObject<HTMLElement>, handleClickOutside: () => void): void {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) handleClickOutside()
    }
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [ref, handleClickOutside])
}

export function formatTime(date: Date): string {
  return `${date.getHours() % 12 || 12}:${date.getMinutes().toString().padStart(2, '0')} ${
    date.getHours() >= 12 ? 'PM' : 'AM'
  }`
}
