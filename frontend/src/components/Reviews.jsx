import { useState, useEffect, useMemo } from 'react'
import { Sparkles, HeartHandshake, Users, Star, Image as ImageIcon, X } from 'lucide-react'
import '../styles/Reviews.css'
import reviewBg from '../assets/reviewBg.png'
import { useReviews } from '../context/ReviewsContext'
import goodTimes from '../assets/goodTimes.png'
// import reviewHeart from '../assets/reviewheart.png'

const MAX_PHOTOS = 4

function Reviews() {
  const { addReview } = useReviews()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [form, setForm] = useState({ name: '', review: '' })
  const [photos, setPhotos] = useState([]) // max 4 files
  const [showToast, setShowToast] = useState(false)
  const [toastType, setToastType] = useState('success')
  const [submitting, setSubmitting] = useState(false)
  // file input ko reset karne ke liye (same photo dobara chun sako)
  const [fileKey, setFileKey] = useState(0)

  // thumbnails ke liye preview URLs (cleanup ke saath)
  const previews = useMemo(() => photos.map((f) => URL.createObjectURL(f)), [photos])
  useEffect(() => {
    return () => previews.forEach((u) => URL.revokeObjectURL(u))
  }, [previews])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePhotos = (e) => {
    const picked = Array.from(e.target.files || [])
    if (picked.length === 0) return

    const room = MAX_PHOTOS - photos.length
    const toAdd = picked.slice(0, Math.max(room, 0))

    if (picked.length > room) {
      triggerToast('limit')
    }

    setPhotos((prev) => [...prev, ...toAdd])
    // input reset, taki wahi photo dobara bhi chun sakein
    setFileKey((k) => k + 1)
  }

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const triggerToast = (type) => {
    setToastType(type)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, type === 'error' || type === 'limit' ? 3500 : 7000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    if (!form.name.trim() || !form.review.trim() || rating === 0) {
      triggerToast('error')
      return
    }

    // Backend (POST /api/reviews) multipart FormData leta hai:
    // name, rating, review, aur optional photos (max 4 asli files)
    const formData = new FormData()
    formData.append('name', form.name.trim())
    formData.append('rating', String(rating))
    formData.append('review', form.review.trim())
    photos.forEach((file) => formData.append('photos', file))

    setSubmitting(true)

    try {
      // review ab "pending" status se save hota hai, admin approve karega tab dikhega
      await addReview(formData)

      setForm({ name: '', review: '' })
      setRating(0)
      setPhotos([])
      setFileKey((k) => k + 1)

      triggerToast('success')
    } catch (err) {
      console.error('Review submit failed:', err)
      triggerToast('fail')
    } finally {
      setSubmitting(false)
    }
  }

  const canAddMore = photos.length < MAX_PHOTOS

  return (
    <>
      <section
        className="reviews-section"
        id="reviews"
        style={{ backgroundImage: `url(${reviewBg})` }}
      >
        <div className="reviews-overlay">
          <div className="reviews-left">
            <span className="reviews-eyebrow">Your Feedback Matters</span>
            <span className="sparkle sparkle-1">✦</span>
            <h2 className="reviews-heading">
              Share Your <br /> Experience{' '}
              {/* <img src={reviewHeart} alt="" className="heart-icon" /> */}
            </h2>
            <p className="reviews-subtext">
              Loved your order? Your kind words help me grow and inspire
              more people to turn their memories into something beautiful.
            </p>

            <div className="reviews-features">
              <div className="feature-item">
                <Sparkles className="feature-icon" strokeWidth={1.75} />
                <span>Real Experiences</span>
              </div>
              <div className="feature-item">
                <HeartHandshake className="feature-icon" strokeWidth={1.75} />
                <span>Support a Small Business</span>
              </div>
              <div className="feature-item">
                <Users className="feature-icon" strokeWidth={1.75} />
                <span>Help Others Decide</span>
              </div>
            </div>

            <div className="reviews-note">
              <img src={goodTimes} alt="Good things take time" className="reviews-note-img" />
            </div>
          </div>

          <div className="reviews-form-card">
            <h3>Leave a Review</h3>
            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="reviewerName">Your Name *</label>
              <input
                type="text"
                id="reviewerName"
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <label>Your Rating *</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                ))}
              </div>

              <label htmlFor="reviewText">Your Review *</label>
              <textarea
                id="reviewText"
                name="review"
                placeholder="Share your experience..."
                value={form.review}
                onChange={handleChange}
                required
              />

              <label htmlFor="reviewPhoto">
                Upload Photos (Optional, up to {MAX_PHOTOS})
              </label>

              {previews.length > 0 && (
                <div className="photo-previews">
                  {previews.map((src, i) => (
                    <div className="photo-preview" key={src}>
                      <img src={src} alt={`Selected ${i + 1}`} />
                      <button
                        type="button"
                        className="photo-remove"
                        onClick={() => removePhoto(i)}
                        aria-label={`Remove photo ${i + 1}`}
                      >
                        <X size={12} strokeWidth={2.5} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {canAddMore && (
                <div className="file-upload">
                  <input
                    key={fileKey}
                    type="file"
                    id="reviewPhoto"
                    accept="image/*"
                    multiple
                    onChange={handlePhotos}
                  />
                  <label htmlFor="reviewPhoto" className="file-upload-label">
                    <ImageIcon className="file-icon" size={16} strokeWidth={1.75} />
                    {photos.length === 0
                      ? 'Choose Images'
                      : `Add more (${photos.length}/${MAX_PHOTOS})`}
                  </label>
                </div>
              )}

              <button
                type="submit"
                className="submit-review-btn"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}{' '}
                <span className="btn-arrow">→</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {showToast && (
        <div className="rv-toast">
          <span className="rv-toast-check">{toastType === 'success' ? '✓' : '!'}</span>
          {toastType === 'error'
            ? 'Please fill all required fields.'
            : toastType === 'limit'
              ? `You can upload up to ${MAX_PHOTOS} photos only.`
              : toastType === 'fail'
                ? "Couldn't submit your review. Please try again."
                : 'Thank you! Your review has been submitted and will appear once approved by admin. 💖'}
        </div>
      )}
    </>
  )
}

export default Reviews