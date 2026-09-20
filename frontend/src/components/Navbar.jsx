import { useState, useEffect } from 'react'
import "../styles/Navbar.css"
import { Link, NavLink, useLocation } from 'react-router-dom'
import logo from '../assets/logo_circle.png'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const location = useLocation()
  const isHome = location.pathname === '/'
useEffect(() => {
  if (!isHome) return

  const sectionIds = ['home', 'products', 'contact', 'review-cta']

  const observer = new IntersectionObserver(
    (entries) => {
      // sirf wahi entries jo abhi visible hain
      const visibleEntries = entries.filter((entry) => entry.isIntersecting)

      if (visibleEntries.length === 0) return

      // jo sabse zyada visible hai (highest intersection ratio) usko active karo
      const mostVisible = visibleEntries.reduce((prev, curr) =>
        curr.intersectionRatio > prev.intersectionRatio ? curr : prev
      )

      setActiveSection(mostVisible.target.id)
    },
    {
      rootMargin: '-45% 0px -45% 0px',
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1], // multiple thresholds -> accurate ratio milta hai
    }
  )

  sectionIds.forEach((id) => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })

  return () => observer.disconnect()
}, [isHome])

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <img src={logo} alt="Resin Creations logo" className="nav-logo-img" />
        <span className="nav-brand-text">Resin Creations</span>
      </div>

      <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        ☰
      </button>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li>
          <Link to="/#home" className={isHome && activeSection === 'home' ? 'active' : ''} onClick={() => setMenuOpen(false)}>
            Home
          </Link>
        </li>

        <li>
          <Link to="/#products" className={isHome && activeSection === 'products' ? 'active' : ''} onClick={() => setMenuOpen(false)}>
            Creations
          </Link>
        </li>

        <li>
          <NavLink to="/wishlist" onClick={() => setMenuOpen(false)}>
            Wishlist
          </NavLink>
        </li>

       <li>
  <Link
    to="/#review-cta"
    className={isHome && activeSection === 'review-cta' ? 'active' : ''}
    onClick={() => setMenuOpen(false)}
  >
    Reviews
  </Link>
</li>

       <li>
  <Link
    to="/#contact"
    className={isHome && activeSection === 'contact' ? 'active' : ''}
    onClick={() => setMenuOpen(false)}
  >
    Reach Us
  </Link>
</li>
      </ul>
    </nav>
  )
}

export default Navbar