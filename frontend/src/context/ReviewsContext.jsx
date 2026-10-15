import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { API_URL } from '../utils/api'
import { adminFetch } from '../utils/adminAuth'

const ReviewsContext = createContext(null)

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState([]) // public: sirf approved
  const [adminReviews, setAdminReviews] = useState([]) // admin: status ke hisaab se
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

  // Customer review: ab ye list mein add NAHI hota, admin approve karega tab dikhega
  const addReview = async (formData) => {
    const res = await fetch(`${API_URL}/api/reviews`, {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) {
      let msg = 'Review submit nahi hua'
      try {
        msg = (await res.json()).message || msg
      } catch {}
      throw new Error(msg)
    }
    return res.json()
  }

  // Admin: status ke hisaab se reviews laao (pending / approved / rejected)
  const loadAdminReviews = useCallback(async (status = 'pending') => {
    const res = await adminFetch(`/api/reviews/admin?status=${status}`)
    if (!res.ok) throw new Error('Reviews load nahi hue')
    setAdminReviews(await res.json())
  }, [])

  // Admin: approve / reject
  const setReviewStatus = async (id, status) => {
    const res = await adminFetch(`/api/reviews/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) throw new Error('Status update nahi hua')
    const updated = await res.json()

    // current tab se hata do (kyunki status badal gaya)
    setAdminReviews((prev) => prev.filter((r) => r._id !== id))

    // approve hua to public list mein bhi turant dikhao
    if (status === 'approved') {
      setReviews((prev) => [updated, ...prev.filter((r) => r._id !== id)])
    } else {
      setReviews((prev) => prev.filter((r) => r._id !== id))
    }
    return updated
  }

  const deleteReview = async (id) => {
    const res = await adminFetch(`/api/reviews/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Delete nahi hua')
    setReviews((prev) => prev.filter((r) => r._id !== id))
    setAdminReviews((prev) => prev.filter((r) => r._id !== id))
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
        adminReviews,
        loadAdminReviews,
        setReviewStatus,
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