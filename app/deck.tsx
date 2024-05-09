'use client'

import { useParams, useRouter } from 'next/navigation'
import React, {
  use,
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
  let [hash, setHash] = useState(getHash())
  let [overviewMode, setOverviewMode] = useState(false)
  let params = useParams()
  let router = useRouter()
  let ref = useRef<HTMLDivElement>(null)
  let slideCount = useRef<number>(0) // Use useRef to store slideCount

  let handlePrev = useCallback(() => {
    let prevSlide = Math.max(1, parseInt(hash || '1', 10) - 1)
    router.push(`#${prevSlide}`)
  }, [hash, router])

  let handleNext = useCallback(() => {
    let nextSlide = Math.min(
      slideCount.current,
      parseInt(hash || '1', 10) + 1
    )
    router.push(`#${nextSlide}`)
  }, [hash, router])

  let handleOverviewToggle = useCallback(() => {
    setOverviewMode((prev) => !prev)
  }, [])

  let handleSlideClick = useCallback(
    (num: number) => {
      if (overviewMode) {
        router.push(`#${num + 1}`)
        setOverviewMode(false)
      }
    },
    [overviewMode, router]
  )

  useEffect(() => {
    slideCount.current = ref.current?.children.length || 0
    let currentHash = getHash() || '1'
    setHash(currentHash)

    let currentSlide = document.getElementById(currentHash)
    let previousSlide = document.querySelector(
      'section[data-current="true"]'
    )
    if (previousSlide && previousSlide !== currentSlide) {
      previousSlide.setAttribute('data-current', 'false')
    }
    if (currentSlide) {
      currentSlide.setAttribute('data-current', 'true')
    }
    currentSlide?.scrollIntoView({
      block: 'center',
    })
  }, [hash, params, router, ref, overviewMode])

  useEffect(() => {
    let keyActions: Record<KeyboardEvent['key'], () => void> = {
      ArrowLeft: handlePrev,
      ArrowUp: handlePrev,
      k: handlePrev,
      ArrowRight: handleNext,
      ArrowDown: handleNext,
      j: handleNext,
      o: handleOverviewToggle,
    }

    let handleKeyDown = (event: KeyboardEvent) => {
      let action = keyActions[event.key]
      if (action) action()
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleNext, handleOverviewToggle, handlePrev])

  useEffect(() => {
    let slides = ref.current?.children

    if (slides) {
      const handlers = Array.from(slides).map((slide, i) => {
        const handler = () => handleSlideClick(i)
        slide.addEventListener('click', handler)
        return handler
      })

      return () => {
        Array.from(slides).forEach((slide, i) => {
          slide.removeEventListener('click', handlers[i])
        })
      }
    }
  }, [handleSlideClick])

  return (
    <div
      ref={ref}
      className={`deck ${
        overviewMode === true ? 'overview' : ''
      }`}
    >
      {children}
    </div>
  )
}
