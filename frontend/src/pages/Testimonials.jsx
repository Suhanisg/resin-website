import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { useReviews } from '../context/ReviewsContext'
import '../styles/Testimonials.css'

const PER_PAGE = 3

function Testimonials() {
  const { reviews } = useReviews()
  const [page, setPage] = useState(0)

  const totalPages = Math.max(1, Math.ceil(reviews.length / PER_PAGE))
  const safePage = Math.min(page, totalPages - 1)
  const visible = reviews.slice(safePage * PER_PAGE, safePage * PER_PAGE + PER_PAGE)

  const goPrev = () => setPage((p) => (p - 1 + totalPages) % totalPages)
  const goNext = () => setPage((p) => (p + 1) % totalPages)

  const getInitials = (name) =>
    name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <section className="testimonials-section" id="testimonials">
      <h2 className="testimonials-heading">What Our Customers Say</h2>
      <p className="testimonials-subtext">
        Real stories. Real happiness. <span className="heart">♡</span>
      </p>

      <div className="testimonials-carousel">
        {totalPages > 1 && (
          <button className="carousel-arrow prev" onClick={goPrev} aria-label="Previous">
            <ChevronLeft />
          </button>
        )}

        <div className="testimonials-grid">
          {visible.map((r) => (
            <div className="testimonial-card" key={r.id}>
              <div className="testimonial-top">
                {r.photo ? (
                  <img src={r.photo} alt={r.name} className="testimonial-avatar" />
                ) : (
                  <div className="testimonial-avatar-fallback">{getInitials(r.name)}</div>
                )}
                <div className="testimonial-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`t-star ${star <= r.rating ? 'filled' : ''}`} />
                  ))}
                </div>
              </div>
              <p className="testimonial-text">"{r.review}"</p>
              <p className="testimonial-name">– {r.name}</p>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <button className="carousel-arrow next" onClick={goNext} aria-label="Next">
            <ChevronRight />
          </button>
        )}
      </div>

      {totalPages > 1 && (
        <div className="testimonials-dots">
          {Array.from({ length: totalPages }).map((_, i) => (
            <span key={i} className={`dot ${i === safePage ? 'active' : ''}`} onClick={() => setPage(i)} />
          ))}
        </div>
      )}

      <div className="testimonials-count">
        <span>
          500+ Happy Customers <Heart className="count-heart" />
        </span>
      </div>
    </section>
  )
}

export default Testimonials