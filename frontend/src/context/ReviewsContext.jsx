import { createContext, useContext, useState, useEffect } from 'react'
import { API_URL } from '../utils/api'
import { adminFetch } from '../utils/adminAuth'

const ReviewsContext = createContext(null)

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState([])
  const [screenshots, setScreenshots] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/api/reviews`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setReviews)
      .catch((err) => console.error('Fetch reviews failed:', err))

    fetch(`${API_URL}/api/screenshots`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setScreenshots)
      .catch((err) => console.error('Fetch screenshots failed:', err))
  }, [])

  // Customer review form: formData (name, rating, review, photo optional)
  const addReview = async (formData) => {
    const res = await fetch(`${API_URL}/api/reviews`, {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) throw new Error('Review submit nahi hua')
    const saved = await res.json()
    setReviews((prev) => [saved, ...prev])
  }

  const deleteReview = async (id) => {
    const res = await adminFetch(`/api/reviews/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Delete nahi hua')
    setReviews((prev) => prev.filter((r) => r._id !== id))
  }

  // Admin: screenshot upload
  const addScreenshot = async (file) => {
    const fd = new FormData()
    fd.append('photo', file)
    const res = await adminFetch('/api/screenshots', {
      method: 'POST',
      body: fd,
    })
    if (!res.ok) throw new Error('Upload nahi hua')
    const saved = await res.json()
    setScreenshots((prev) => [saved, ...prev])
  }

  const deleteScreenshot = async (id) => {
    const res = await adminFetch(`/api/screenshots/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Delete nahi hua')
    setScreenshots((prev) => prev.filter((s) => s._id !== id))
  }

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        addReview,
        deleteReview,
        screenshots,
        addScreenshot,
        deleteScreenshot,
      }}
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