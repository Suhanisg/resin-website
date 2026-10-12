import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Star, ChevronLeft, ChevronRight, Heart, ZoomIn, X } from 'lucide-react'
import { useReviews } from '../context/ReviewsContext'
import '../styles/Testimonials.css'

const PER_PAGE = 3

// naye reviews: r.photos (array). purane reviews: r.photo (single) - dono chalenge
const getPhotos = (r) => {
  if (Array.isArray(r.photos) && r.photos.length > 0) return r.photos
  if (r.photo) return [r.photo]
  return []
}

function Testimonials() {
  const { reviews } = useReviews()
  const [page, setPage] = useState(0)
  // zoom state: { images: [...], index: 0, name }
  const [zoomed, setZoomed] = useState(null)
  const touchStartX = useRef(null)

  const totalPages = Math.max(1, Math.ceil(reviews.length / PER_PAGE))
  const safePage = Math.min(page, totalPages - 1)
  const visible = reviews.slice(safePage * PER_PAGE, safePage * PER_PAGE + PER_PAGE)

  const goPrev = () => setPage((p) => (p - 1 + totalPages) % totalPages)
  const goNext = () => setPage((p) => (p + 1) % totalPages)

  const getInitials = (name) =>
    name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  const openZoom = (r, startIndex = 0) =>
    setZoomed({ images: getPhotos(r), index: startIndex, name: r.name })

  const slidePrev = () =>
    setZoomed((z) =>
      z ? { ...z, index: (z.index - 1 + z.images.length) % z.images.length } : z,
    )
  const slideNext = () =>
    setZoomed((z) => (z ? { ...z, index: (z.index + 1) % z.images.length } : z))

  // Badi photo khuli ho to page scroll band + Esc se band + arrow keys se slide
  useEffect(() => {
    if (!zoomed) return

    const onKey = (e) => {
      if (e.key === 'Escape') setZoomed(null)
      else if (e.key === 'ArrowLeft') slidePrev()
      else if (e.key === 'ArrowRight') slideNext()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [zoomed !== null]) // eslint-disable-line react-hooks/exhaustive-deps

  // mobile swipe
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const diff = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(diff) < 40) return
    if (diff > 0) slidePrev()
    else slideNext()
  }

  const multi = zoomed && zoomed.images.length > 1

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
          {visible.map((r) => {
            const photos = getPhotos(r)
            const first = photos[0]

            return (
              <div className="testimonial-card" key={r._id || r.id}>
                <div className={`testimonial-top ${first ? 'has-photo' : ''}`}>
                  {first ? (
                    <div className="t-photo-wrap">
                      <button
                        type="button"
                        className="t-photo-btn"
                        onClick={() => openZoom(r)}
                        aria-label={
                          photos.length > 1
                            ? `View ${r.name}'s ${photos.length} photos`
                            : `View ${r.name}'s photo in full size`
                        }
                      >
                        <img src={first} alt={r.name} className="t-photo" />
                        <span className="t-photo-badge" aria-hidden="true">
                          <ZoomIn size={13} />
                        </span>
                        {photos.length > 1 && (
                          <span className="t-photo-count" aria-hidden="true">
                            +{photos.length - 1}
                          </span>
                        )}
                        <span className="t-photo-tip" role="tooltip">
                          {photos.length > 1
                            ? `Click to view all ${photos.length} photos`
                            : 'Click to enlarge'}
                        </span>
                      </button>
                      <span className="t-photo-hint">
                        {photos.length > 1 ? `Tap to view ${photos.length} photos` : 'Tap to enlarge'}
                      </span>
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
            )
          })}
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
            aria-label={`${zoomed.name}'s photos`}
            onClick={() => setZoomed(null)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <button
              type="button"
              className="t-lightbox-close"
              onClick={() => setZoomed(null)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {multi && (
              <button
                type="button"
                className="t-lightbox-arrow prev"
                onClick={(e) => {
                  e.stopPropagation()
                  slidePrev()
                }}
                aria-label="Previous photo"
              >
                <ChevronLeft size={26} />
              </button>
            )}

            <img
              key={zoomed.index}
              src={zoomed.images[zoomed.index]}
              alt={`${zoomed.name} - photo ${zoomed.index + 1}`}
              className="t-lightbox-img"
              onClick={(e) => e.stopPropagation()}
            />

            {multi && (
              <button
                type="button"
                className="t-lightbox-arrow next"
                onClick={(e) => {
                  e.stopPropagation()
                  slideNext()
                }}
                aria-label="Next photo"
              >
                <ChevronRight size={26} />
              </button>
            )}

            <p className="t-lightbox-caption">
              {zoomed.name}
              {multi && ` · ${zoomed.index + 1} / ${zoomed.images.length}`}
            </p>

            {multi && (
              <div className="t-lightbox-dots" onClick={(e) => e.stopPropagation()}>
                {zoomed.images.map((_, i) => (
                  <span
                    key={i}
                    className={`t-lightbox-dot ${i === zoomed.index ? 'active' : ''}`}
                    onClick={() => setZoomed((z) => ({ ...z, index: i }))}
                  />
                ))}
              </div>
            )}
          </div>,
          document.body,
        )}
    </section>
  )
}

export default Testimonials