import { useState, useEffect } from 'react'
import heroImg from '../assets/heroImage.jpg'
import "../styles/Hero.css"
import { GiSparkles } from "react-icons/gi"
import { FaPaintBrush, FaHome, FaHeart } from "react-icons/fa"

const words = [
  "Wall Art",
  "Varmala Frames",
  "Resin Clocks",
  "Coasters",
  "Keychains",
  "Photo Frames",
  "Resin Platters",
  "Custom Keepsakes"
];

function Hero() {
  const [index, setIndex] = useState(0)

useEffect(() => {
  const interval = setInterval(() => {
    setIndex((prev) => (prev + 1) % words.length)
  }, 3200)   // pehle 2500ms tha, ab 3200ms — thoda zyada time milega read karne ko
  return () => clearInterval(interval)
}, [])

  const scrollToProducts = (e) => {
    e.preventDefault()
    const target = document.getElementById('products')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="hero">
      <img src={heroImg} alt="Resin art piece" className="hero-bg" />
      <div className="hero-overlay" />

      <svg className="hero-line" viewBox="0 0 1900 800" preserveAspectRatio="none">
        <path d="M -50,150 C 300,40 600,260 950,170 C 1300,90 1550,270 1950,130" />
      </svg>

      <div className="hero-sticky-note">
        Custom pieces<br />made for your<br />special spaces <FaHeart size={10} />
      </div>

      <div className="hero-overlay-content">
        <p className="hero-overline">Bring Art To Your Home</p>
        <div className="hero-overline-divider">
          <span className="hero-overline-line" />
          <GiSparkles size={14} />
          <span className="hero-overline-line" />
        </div>

        <h1>
          Handcrafted{" "}
          <span className="swap-word-wrap">
            <span key={index} className="swap-word">
              {words[index]}
            </span>
          </span>
        </h1>

        <p className="hero-sub">
          Art that turns everyday moments into a story — customised resin
          pieces made with creativity, care and a touch of you.
        </p>

        <div className="hero-features">
          <div className="hero-feature">
            <div className="hero-feature-icon"><GiSparkles size={18} /></div>
            <div>
              <strong>Unique Designs</strong>
              <p>No two pieces are the same</p>
            </div>
          </div>
          <div className="hero-feature">
            <div className="hero-feature-icon"><FaPaintBrush size={16} /></div>
            <div>
              <strong>Your Ideas, Our Craft</strong>
              <p>Customise colours, shapes and themes</p>
            </div>
          </div>
          <div className="hero-feature">
            <div className="hero-feature-icon"><FaHome size={16} /></div>
            <div>
              <strong>Made for Your Space</strong>
              <p>Perfect for homes, offices and gifting</p>
            </div>
          </div>
        </div>

        <a href="#products" className="hero-cta" onClick={scrollToProducts}>
          Explore Our Creations <span className="hero-cta-arrow">→</span>
        </a>
      </div>
    </section>
  )
}

export default Hero