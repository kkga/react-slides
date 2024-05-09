'use client'

import { useParams, useRouter } from 'next/navigation'
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

const getHash = () =>
  typeof window !== 'undefined'
    ? decodeURIComponent(window.location.hash.replace('#', ''))
    : undefined

interface Props {
  children: React.ReactNode
}

export function Deck({ children }: Props) {
  const [hash, setHash] = useState(getHash())
  const params = useParams()
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  const slideCount = useRef<number>(0) // Use useRef to store slideCount

  const handlePrev = useCallback(() => {
    const prevSlide = Math.max(1, parseInt(hash || '1', 10) - 1)
    router.push(`#${prevSlide}`)
  }, [hash, router])

  const handleNext = useCallback(() => {
    const nextSlide = Math.min(
      slideCount.current,
      parseInt(hash || '1', 10) + 1
    )
    router.push(`#${nextSlide}`)
  }, [hash, router])

  useEffect(() => {
    slideCount.current = ref.current?.children.length || 0
    const currentHash = getHash() || '1'
    setHash(currentHash)

    const currentSlide = document.getElementById(currentHash)
    const previousSlide = document.querySelector(
      'section[data-current="true"]'
    )
    if (previousSlide && previousSlide !== currentSlide) {
      previousSlide.setAttribute('data-current', 'false')
    }
    if (currentSlide) {
      currentSlide.setAttribute('data-current', 'true')
    }
  }, [hash, params, router, ref])

  useEffect(() => {
    const keyActions: Record<KeyboardEvent['key'], () => void> =
      {
        ArrowLeft: handlePrev,
        ArrowUp: handlePrev,
        k: handlePrev,
        ArrowRight: handleNext,
        ArrowDown: handleNext,
        j: handleNext,
      }

    const handleKeyDown = (event: KeyboardEvent) => {
      const action = keyActions[event.key]
      if (action) action()
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleNext, handlePrev])

  return (
    <div ref={ref} className="deck">
      {children}
    </div>
  )
}
