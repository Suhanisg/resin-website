import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Star, ChevronLeft, ChevronRight, Heart, ZoomIn, X } from 'lucide-react'
import { useReviews } from '../context/ReviewsContext'
import '../styles/Testimonials.css'

const PER_PAGE = 3

function Testimonials() {
  const { reviews } = useReviews()
  const [page, setPage] = useState(0)
  // jis review ki photo badi karke dikhani hai: { src, name }
  const [zoomed, setZoomed] = useState(null)

  const totalPages = Math.max(1, Math.ceil(reviews.length / PER_PAGE))
  const safePage = Math.min(page, totalPages - 1)
  const visible = reviews.slice(safePage * PER_PAGE, safePage * PER_PAGE + PER_PAGE)

  const goPrev = () => setPage((p) => (p - 1 + totalPages) % totalPages)
  const goNext = () => setPage((p) => (p + 1) % totalPages)

  const getInitials = (name) =>
    name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  // Badi photo khuli ho to page scroll band + Esc se band ho
  useEffect(() => {
    if (!zoomed) return

    const onKey = (e) => {
      if (e.key === 'Escape') setZoomed(null)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [zoomed])

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
            <div className="testimonial-card" key={r._id || r.id}>
              <div className={`testimonial-top ${r.photo ? 'has-photo' : ''}`}>
                {r.photo ? (
                  <div className="t-photo-wrap">
                    <button
                      type="button"
                      className="t-photo-btn"
                      onClick={() => setZoomed({ src: r.photo, name: r.name })}
                      aria-label={`View ${r.name}'s photo in full size`}
                    >
                      <img src={r.photo} alt={r.name} className="t-photo" />
                      <span className="t-photo-badge" aria-hidden="true">
                        <ZoomIn size={13} />
                      </span>
                      <span className="t-photo-tip" role="tooltip">
                        Click to enlarge
                      </span>
                    </button>
                    <span className="t-photo-hint">Tap to enlarge</span>
                  </div>
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

      {zoomed &&
        createPortal(
          <div
            className="t-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`${zoomed.name}'s photo`}
            onClick={() => setZoomed(null)}
          >
            <button
              type="button"
              className="t-lightbox-close"
              onClick={() => setZoomed(null)}
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <img
              src={zoomed.src}
              alt={zoomed.name}
              className="t-lightbox-img"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="t-lightbox-caption">{zoomed.name}</p>
          </div>,
          document.body,
        )}
    </section>
  )
}

export default Testimonials