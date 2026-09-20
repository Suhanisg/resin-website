import { useState } from 'react'
import { Sparkles, HeartHandshake, Users, Star, Image as ImageIcon } from 'lucide-react'
import '../styles/Reviews.css'
import reviewBg from '../assets/reviewBg.png'
import { useReviews } from '../context/ReviewsContext'
import goodTimes from '../assets/goodTimes.png'
// import reviewHeart from '../assets/reviewheart.png'

function Reviews() {
  const { addReview } = useReviews()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [form, setForm] = useState({ name: '', review: '' })
  const [photo, setPhoto] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePhoto = (e) => {
    setPhoto(e.target.files[0] || null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.review || rating === 0) return

    addReview({
      name: form.name,
      rating,
      review: form.review,
      photo: photo ? URL.createObjectURL(photo) : null,
    })

    setForm({ name: '', review: '' })
    setRating(0)
    setPhoto(null)
  }

  return (
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
          <form onSubmit={handleSubmit}>
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

            <label htmlFor="reviewPhoto">Upload Photo (Optional)</label>
            <div className="file-upload">
              <input
                type="file"
                id="reviewPhoto"
                accept="image/*"
                onChange={handlePhoto}
              />
              <label htmlFor="reviewPhoto" className="file-upload-label">
                <ImageIcon className="file-icon" size={16} strokeWidth={1.75} />
                {photo ? photo.name : 'Choose Image'}
              </label>
            </div>

            <button type="submit" className="submit-review-btn">
              Submit Review <span className="btn-arrow">→</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Reviews