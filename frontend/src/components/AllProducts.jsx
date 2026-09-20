import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/AllProducts.css"

const CATEGORIES_URL = "http://localhost:5000/api/categories"

function AllProducts() {
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()
  const trackRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

useEffect(() => {
  fetch(CATEGORIES_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
      return res.json()
    })
    .then((data) => {
      console.log("Categories fetched:", data)
      setCategories(data)
    })
    .catch((err) => {
      console.error("Fetch failed:", err)
    })
}, [])

  

  const IMAGE_POSITIONS = {
    "Resin Clock": "center 20%",
    "Varmala Frame": "center 0%",
    "KeyChain": "center 70%",
    "Platter": "center 20%",
  }
  const getPosition = (catName) => IMAGE_POSITIONS[catName] || "center"

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
    const gap = 22 // matches .ap-grid gap
    const cardWidth = card.offsetWidth + gap
    // ek baar mein 2 cards jitna slide karega, chaho toh 1 kar sakte ho
    el.scrollBy({ left: direction * cardWidth * 2, behavior: "smooth" })
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
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="vf-card"
                onClick={() => navigate(`/category/${encodeURIComponent(cat.name)}`)}
              >
                <div className="vf-photo">
                  {cat.image ? (
                    <img
                      src={`http://localhost:5000${cat.image}`}
                      alt={cat.name}
                      style={{ objectPosition: getPosition(cat.name) }}
                    />
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

        <div className="ap-leaf">🌿</div>
      </div>
    </section>
  )
}

export default AllProducts;