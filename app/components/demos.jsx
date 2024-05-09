'use client'

import { useState } from 'react'

export function LikeButton1() {
  return <button>I don&apos;t do anything yet</button>
}

export function LikeButton2() {
  const handleClick = () => alert('Like button clicked!')

  return <button onClick={handleClick}>Like</button>
}

export function LikeButton3() {
  const [likes, setLikes] = useState(0)
  const handleClick = () => setLikes((l) => l + 1)

  return (
    <button onClick={handleClick}>
      {likes} {likes === 1 ? 'like' : 'likes'}
    </button>
  )
}

export function Counter() {
  const [count, setCount] = useState(0)
  const increment = () => setCount((c) => c + 1)

  return (
    <button
      className="bg-blue-100 hover:bg-blue-200 active:bg-blue-300 rounded text-blue-600 p-8 text-xl font-bold"
      onClick={increment}
    >
      Clicked {count} times
    </button>
  )
}
