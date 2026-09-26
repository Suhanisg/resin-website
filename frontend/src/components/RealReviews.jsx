import { useState, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { useReviews } from '../context/ReviewsContext'
import '../styles/RealReviews.css'

// Har breakpoint ke liye alag card size + fan offsets + kitne cards dikhane hain
const STACK_CONFIGS = {
  desktop: {
    cardWidth: 190,
    cardHeight: 300,
    visibleCount: 7,
    positions: [
      { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, z: 90 },
      { x: -150, y: 20, rotate: -7, scale: 0.94, opacity: 0.95, z: 80 },
      { x: 150, y: 20, rotate: 7, scale: 0.94, opacity: 0.95, z: 80 },
      { x: -290, y: 42, rotate: -13, scale: 0.87, opacity: 0.88, z: 70 },
      { x: 290, y: 42, rotate: 13, scale: 0.87, opacity: 0.88, z: 70 },
      { x: -420, y: 66, rotate: -19, scale: 0.8, opacity: 0.75, z: 60 },
      { x: 420, y: 66, rotate: 19, scale: 0.8, opacity: 0.75, z: 60 },
    ],
  },
  tablet: {
    // iPad Mini/Air/Pro portrait range
    cardWidth: 155,
    cardHeight: 240,
    visibleCount: 5,
    positions: [
      { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, z: 90 },
      { x: -115, y: 16, rotate: -8, scale: 0.92, opacity: 0.93, z: 80 },
      { x: 115, y: 16, rotate: 8, scale: 0.92, opacity: 0.93, z: 80 },
      { x: -215, y: 34, rotate: -15, scale: 0.84, opacity: 0.82, z: 70 },
      { x: 215, y: 34, rotate: 15, scale: 0.84, opacity: 0.82, z: 70 },
    ],
  },
  mobile: {
    // most phones (iPhone 12/13/14/15/16 etc.)
    cardWidth: 135,
    cardHeight: 210,
    visibleCount: 3,
    positions: [
      { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, z: 90 },
      { x: -78, y: 14, rotate: -9, scale: 0.9, opacity: 0.9, z: 80 },
      { x: 78, y: 14, rotate: 9, scale: 0.9, opacity: 0.9, z: 80 },
    ],
  },
  mobileSmall: {
    // iPhone SE / very narrow (<=400px)
    cardWidth: 110,
    cardHeight: 172,
    visibleCount: 3,
    positions: [
      { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, z: 90 },
      { x: -62, y: 12, rotate: -9, scale: 0.88, opacity: 0.88, z: 80 },
      { x: 62, y: 12, rotate: 9, scale: 0.88, opacity: 0.88, z: 80 },
    ],
  },
}

function getBreakpoint(width) {
  if (width <= 400) return 'mobileSmall'
  if (width <= 700) return 'mobile'
  if (width <= 1112) return 'tablet' // iPad Pro 13" (~1032px) is included here now
  return 'desktop'
}

function useResponsiveStack() {
  const [bp, setBp] = useState(() =>
    typeof window !== 'undefined' ? getBreakpoint(window.innerWidth) : 'desktop'
  )

  useEffect(() => {
    const onResize = () => setBp(getBreakpoint(window.innerWidth))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return STACK_CONFIGS[bp]
}

function RealReviews() {
  const { screenshots } = useReviews()
  const [order, setOrder] = useState(screenshots.map((s) => s.id))
  const config = useResponsiveStack()

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

  // container ka size, current breakpoint ke fan-spread ke hisaab se calculate hota hai
  const { stackWidth, stackHeight } = useMemo(() => {
    const maxX = Math.max(...config.positions.map((p) => Math.abs(p.x)))
    const maxY = Math.max(...config.positions.map((p) => p.y))
    return {
      stackWidth: maxX * 2 + config.cardWidth,
      stackHeight: maxY + config.cardHeight,
    }
  }, [config])

  if (orderedReviews.length === 0) return null

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

        <div className="rr-stack" style={{ width: stackWidth, height: stackHeight }}>
          {orderedReviews.slice(0, config.visibleCount).map((r, i) => {
            const pos = config.positions[i]
            return (
              <div
                key={r.id}
                className="rr-card"
                style={{
                  width: config.cardWidth,
                  height: config.cardHeight,
                  marginLeft: -(config.cardWidth / 2),
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