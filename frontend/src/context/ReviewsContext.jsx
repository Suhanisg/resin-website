import { createContext, useContext, useState, useEffect } from 'react'

const ReviewsContext = createContext(null)

const TEXT_KEY = 'resin-text-reviews'      // Reviews.jsx form se (name, rating, review, photo)
const SCREENSHOT_KEY = 'resin-screenshot-reviews' // Admin panel se (sirf photo)

function loadFromStorage(key) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState(() => loadFromStorage(TEXT_KEY))
  const [screenshots, setScreenshots] = useState(() => loadFromStorage(SCREENSHOT_KEY))

  useEffect(() => {
    localStorage.setItem(TEXT_KEY, JSON.stringify(reviews))
  }, [reviews])

  useEffect(() => {
    localStorage.setItem(SCREENSHOT_KEY, JSON.stringify(screenshots))
  }, [screenshots])

  const addReview = (newReview) => {
    setReviews((prev) => [{ ...newReview, id: Date.now() }, ...prev])
  }

  const deleteReview = (id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id))
  }

  const addScreenshot = (newShot) => {
    setScreenshots((prev) => [{ ...newShot, id: Date.now() }, ...prev])
  }

  const deleteScreenshot = (id) => {
    setScreenshots((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <ReviewsContext.Provider
      value={{ reviews, addReview, deleteReview, screenshots, addScreenshot, deleteScreenshot }}
    >
      {children}
    </ReviewsContext.Provider>
  )
}

export function useReviews() {
  const ctx = useContext(ReviewsContext)
  if (!ctx) throw new Error('useReviews must be used within a ReviewsProvider')
  return ctx
}