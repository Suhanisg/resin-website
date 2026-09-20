import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { useReviews } from '../context/ReviewsContext'
import '../styles/RealReviews.css'

const STACK_SIZE = 7

function RealReviews() {
  const { screenshots } = useReviews()
  const [order, setOrder] = useState(screenshots.map((s) => s.id))

  useEffect(() => {
    setOrder(screenshots.map((s) => s.id))
  }, [screenshots.length])

  const orderedReviews = order
    .map((id) => screenshots.find((s) => s.id === id))
    .filter(Boolean)

  const goNext = () => {
    setOrder((prev) => {
      const [first, ...rest] = prev
      return [...rest, first]
    })
  }

  const goPrev = () => {
    setOrder((prev) => {
      const last = prev[prev.length - 1]
      return [last, ...prev.slice(0, -1)]
    })
  }

  if (orderedReviews.length === 0) return null

  // center card (i=0) sabse aage, baaki symmetric dono taraf 3-3 fan hote hain (7 cards)
  const stackConfig = [
    { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, z: 90 },
    { x: -150, y: 20, rotate: -7, scale: 0.94, opacity: 0.95, z: 80 },
    { x: 150, y: 20, rotate: 7, scale: 0.94, opacity: 0.95, z: 80 },
    { x: -290, y: 42, rotate: -13, scale: 0.87, opacity: 0.88, z: 70 },
    { x: 290, y: 42, rotate: 13, scale: 0.87, opacity: 0.88, z: 70 },
    { x: -420, y: 66, rotate: -19, scale: 0.8, opacity: 0.75, z: 60 },
    { x: 420, y: 66, rotate: 19, scale: 0.8, opacity: 0.75, z: 60 },
  ]

  return (
    <section className="real-reviews-section" id="real-reviews">
      <div className="real-reviews-header">
        <div>
          <span className="rr-eyebrow">Real Reviews</span>
          <h2 className="rr-heading">Love From Our Customers</h2>
        </div>
        <p className="rr-script">
          Same Love <br /> Different Stories <span className="heart">♡</span>
        </p>
      </div>

      <div className="rr-stack-wrapper">
        <button className="rr-arrow prev" onClick={goPrev} aria-label="Previous">
          <ChevronLeft />
        </button>

        <div className="rr-stack">
          {orderedReviews.slice(0, STACK_SIZE).map((r, i) => {
            const pos = stackConfig[i]
            return (
              <div
                key={r.id}
                className="rr-card"
                style={{
                  transform: `translate(${pos.x}px, ${pos.y}px) rotate(${pos.rotate}deg) scale(${pos.scale})`,
                  opacity: pos.opacity,
                  zIndex: pos.z,
                }}
              >
                {r.photo && (
                  <div className="rr-photo-wrap">
                    <img src={r.photo} alt="customer review" className="rr-photo" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <button className="rr-arrow next" onClick={goNext} aria-label="Next">
          <ChevronRight />
        </button>
      </div>

      <div className="rr-count">
        {/* <span>
          100+ Happy Customers <Heart className="rr-count-heart" />
        </span> */}
      </div>
    </section>
  )
}

export default RealReviews