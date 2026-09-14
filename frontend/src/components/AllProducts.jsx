import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/AllProducts.css"

const CATEGORIES_URL = "http://localhost:5000/api/categories"

function AllProducts() {
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch(CATEGORIES_URL).then((res) => res.json()).then(setCategories)
  }, [])


const IMAGE_POSITIONS = {
  "Resin Clock": "center 20%",     // upar wala hissa (0% = top most)
  "Varmala Frame": "center 0%",   // beech mein
  "KeyChain": "center 70%",        // thoda neeche wala hissa
  "Platter": "center 20%",         // neeche wala hissa
}
const getPosition = (catName) => IMAGE_POSITIONS[catName] || "center"
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

        <div className="ap-grid">
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

        <div className="ap-leaf">🌿</div>
      </div>
    </section>
  )
}

export default AllProducts;