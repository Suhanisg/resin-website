import { useState, useEffect } from 'react'
import heroImg from '../assets/heroImage.jpg'
import "../styles/Hero.css"

const words = ["Resin Art", "Coasters", "Jewellery", "Wall Art", "Keychains"]

function Hero() {
  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length)
        setFade(true)
      }, 300)
    }, 2500)
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
      <div className="hero-arch" />
      <div className="hero-overlay" />

      <div className="hero-overlay-content">
        <h1>
          Handcrafted{" "}
          <span className={`swap-word ${fade ? 'fade-in' : 'fade-out'}`}>
            {words[index]}
          </span>
        </h1>
        <p>Unique, made-to-order resin pieces — coasters, jewellery, wall art & more.</p>
        <a href="#products" className="hero-cta" onClick={scrollToProducts}>
          Explore Our Creations
        </a>
      </div>

      <div className="hero-socials">
        <a href="#" aria-label="Instagram">IG</a>
        <a href="#" aria-label="Facebook">FB</a>
        <a href="#" aria-label="WhatsApp">WA</a>
      </div>

      
    </section>
  )
}

export default Hero