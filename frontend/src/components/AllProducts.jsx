import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/AllProducts.css"
import { API_URL } from "../utils/api";
import { getImageUrl } from "../utils/imageUrls";

const CATEGORIES_URL = `${API_URL}/api/categories`;

const SKELETON_COUNT = 4

// Purani categories ke liye fallback (jinki position admin se save nahi hui hai)
const IMAGE_POSITIONS = {
  "Resin Clock": "center 20%",
  "Varmala Frame": "center 0%",
  "KeyChain": "center 70%",
  "Platter": "center 20%",
}
const getPosition = (catName) => IMAGE_POSITIONS[catName] || "center"

// Admin se position set hui hai ya nahi
const hasSavedPosition = (cat) =>
  typeof cat.imageX === "number" && typeof cat.imageY === "number"

// Image tabhi load hoti hai jab card viewport ke paas aaye (lazy loading).
// Tab tak shimmer dikhta hai, aate hi smoothly fade-in hota hai.
function CategoryImage({ cat }) {
  const [inView, setInView] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const wrapRef = useRef(null)
  const imgRef = useRef(null)

  // Jab ye element viewport mein aaye tabhi inView = true
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    // Purane browsers jinme IntersectionObserver nahi hai, unme seedha load kar do
    if (typeof IntersectionObserver === "undefined") {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect() // ek baar trigger hone ke baad dobara observe nahi karna
        }
      },
      {
        // 200px pehle hi load shuru kar do (niche scroll karte waqt)
        rootMargin: "0px 0px 200px 0px",
        threshold: 0.01,
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // agar photo browser cache se turant aa gayi ho
  useEffect(() => {
    const img = imgRef.current
    if (inView && img && img.complete && img.naturalWidth > 0) setLoaded(true)
  }, [inView])

  if (failed) return <div className="vf-photo-fallback" />

  const saved = hasSavedPosition(cat)
  const origin = saved ? `${cat.imageX}% ${cat.imageY}%` : "center"
  const zoom = typeof cat.imageZoom === "number" ? cat.imageZoom / 100 : 1

  return (
    <div ref={wrapRef} style={{ position: "absolute", inset: 0 }}>
      {!loaded && <div className="vf-shimmer" />}
      {inView && (
        <img
          ref={imgRef}
          src={getImageUrl(cat.image)}
          alt={cat.name}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          style={{
            objectPosition: saved ? origin : getPosition(cat.name),
            transform: zoom !== 1 ? `scale(${zoom})` : undefined,
            transformOrigin: origin,
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        />
      )}
    </div>
  )
}

function AllProducts() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [slow, setSlow] = useState(false)
  const navigate = useNavigate()
  const trackRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    // server so raha ho (Render free plan) to thodi der baad halka sa message
    const slowTimer = setTimeout(() => setSlow(true), 5000)

    fetch(CATEGORIES_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setCategories(data)
      })
      .catch((err) => {
        console.error("Fetch failed:", err)
      })
      .finally(() => {
        clearTimeout(slowTimer)
        setLoading(false)
        setSlow(false)
      })

    return () => clearTimeout(slowTimer)
  }, [])

  // check scroll position -> enable/disable arrows
  const updateScrollButtons = () => {
    const el = trackRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    updateScrollButtons()
    const el = trackRef.current
    if (!el) return
    el.addEventListener("scroll", updateScrollButtons)
    window.addEventListener("resize", updateScrollButtons)
    return () => {
      el.removeEventListener("scroll", updateScrollButtons)
      window.removeEventListener("resize", updateScrollButtons)
    }
  }, [categories])

  const scrollByCards = (direction) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector(".vf-card")
    if (!card) return

    const gap = parseFloat(getComputedStyle(el).columnGap) || 22
    const cardWidth = card.offsetWidth + gap

    // kitne cards ek saath dikh rahe hain (kam se kam 1)
    const visibleCards = Math.max(1, Math.floor(el.clientWidth / cardWidth))

    // ek click mein max 2 cards, lekin chhoti screen par sirf 1
    const step = Math.min(2, visibleCards)

    el.scrollBy({ left: direction * cardWidth * step, behavior: "smooth" })
  }

  return (
    <section className="ap-section" id="products">
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <clipPath id="vfWaveClip" clipPathUnits="objectBoundingBox">
            <path d="
              M 1,0.32
              C 0.85,0.02 0.65,0 0.5,0
              C 0.35,0 0.15,0.02 0,0.32
              L 0,0.78
              C 0.15,0.65 0.3,0.95 0.5,0.85
              C 0.7,0.75 0.85,0.9 1,0.78
              Z
            " />
          </clipPath>
        </defs>
      </svg>
      <div className="ap-card-wrapper">
        <div className="ap-header">
          <div className="ap-eyebrow-row">
            <span className="ap-line" />
            <span className="ap-eyebrow">HANDCRAFTED WITH LOVE</span>
            <span className="ap-line" />
          </div>
          <div className="ap-heart">♥</div>
          <h2>Explore Our Resin Creations</h2>
          <p className="ap-subtitle">ART &nbsp;.&nbsp; MEMORIES &nbsp;.&nbsp; FOREVER</p>
        </div>

        <div className="ap-script">
          Unique<br />Handmade<br />Always ♡
        </div>

        <div className="ap-slider">
          <button
            className={`ap-nav-btn ap-nav-left ${!canScrollLeft ? "ap-nav-disabled" : ""}`}
            onClick={() => scrollByCards(-1)}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            ←
          </button>

          <div className="ap-grid" ref={trackRef}>
            {loading
              ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                  <div className="vf-card vf-card-skeleton" key={`sk-${i}`} aria-hidden="true">
                    <div className="vf-photo">
                      <div className="vf-shimmer" />
                    </div>
                    <div className="vf-content">
                      <div className="vf-skel-title" />
                      <div className="vf-bottom-row">
                        <div className="vf-skel-sub" />
                        <div className="vf-skel-btn" />
                      </div>
                    </div>
                  </div>
                ))
              : categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="vf-card"
                    onClick={() => navigate(`/category/${encodeURIComponent(cat.name)}`)}
                  >
                    <div className="vf-photo">
                      {cat.image ? (
                        <CategoryImage cat={cat} />
                      ) : (
                        <div className="vf-photo-fallback" />
                      )}
                    </div>
                    <div className="vf-content">
                      <h3 className="vf-title">{cat.name.toUpperCase()}</h3>
                      <div className="vf-bottom-row">
                        <p className="vf-subtitle">{cat.description || "Handcrafted with love."}</p>
                        <button className="vf-arrow-btn" aria-label={`Explore ${cat.name}`}>
                          →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
          </div>

          <button
            className={`ap-nav-btn ap-nav-right ${!canScrollRight ? "ap-nav-disabled" : ""}`}
            onClick={() => scrollByCards(1)}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            →
          </button>
        </div>

        {loading && slow && (
          <p className="vf-slow-note">Crafting something beautiful, just a moment ♡</p>
        )}

        <div className="ap-leaf">🌿</div>
      </div>
    </section>
  )
}

export default AllProducts;