import { useEffect, RefObject } from 'react'

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
