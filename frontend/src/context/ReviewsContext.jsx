import { createContext, useContext, useState, useEffect } from 'react'

const ReviewsContext = createContext(null)
const API = import.meta.env.VITE_API_URL
const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('adminToken')}`, // apna token ka key daalo
})

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState([])
  const [screenshots, setScreenshots] = useState([])

  useEffect(() => {
    fetch(`${API}/api/reviews`).then(r => r.json()).then(setReviews).catch(() => {})
    fetch(`${API}/api/screenshots`).then(r => r.json()).then(setScreenshots).catch(() => {})
  }, [])

  // formData: name, rating, review, photo (optional)
  const addReview = async (formData) => {
    const res = await fetch(`${API}/api/reviews`, { method: 'POST', body: formData })
    const saved = await res.json()
    setReviews(prev => [saved, ...prev])
  }

  const deleteReview = async (id) => {
    await fetch(`${API}/api/reviews/${id}`, { method: 'DELETE', headers: authHeader() })
    setReviews(prev => prev.filter(r => r._id !== id))
  }

  const addScreenshot = async (file) => {
    const fd = new FormData()
    fd.append('photo', file)
    const res = await fetch(`${API}/api/screenshots`, {
      method: 'POST', headers: authHeader(), body: fd,
    })
    const saved = await res.json()
    setScreenshots(prev => [saved, ...prev])
  }

  const deleteScreenshot = async (id) => {
    await fetch(`${API}/api/screenshots/${id}`, { method: 'DELETE', headers: authHeader() })
    setScreenshots(prev => prev.filter(s => s._id !== id))
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