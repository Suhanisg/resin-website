import { useState, useEffect } from 'react'
import "../styles/Navbar.css"
import { Link, NavLink, useLocation } from 'react-router-dom'
import logo from '../assets/logo_circle.png'
import {
  House,
  Sparkles,
  Heart,
  HelpCircle,
  MessageCircle,
  Phone,
} from 'lucide-react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const location = useLocation()
  const isHome = location.pathname === '/'
useEffect(() => {
  if (!isHome) return

const sectionIds = ['home', 'products', 'faqs', 'contact', 'review-cta']

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
        <svg
          className="nav-toggle-icon"
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="2.5" y="4" width="19" height="6.5" rx="3.25" stroke="currentColor" strokeWidth="1.75" />
          <path d="M15.5 6.2 17.3 8l1.8-1.8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="4" y1="15.5" x2="20" y2="15.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <line x1="4" y1="19.5" x2="15" y2="19.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </button>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li>
          <Link to="/#home" className={isHome && activeSection === 'home' ? 'active' : ''} onClick={() => setMenuOpen(false)}>
            <House className="nav-icon" strokeWidth={1.75} />
            <span>Home</span>
          </Link>
        </li>

        <li>
          <Link to="/#products" className={isHome && activeSection === 'products' ? 'active' : ''} onClick={() => setMenuOpen(false)}>
            <Sparkles className="nav-icon" strokeWidth={1.75} />
            <span>Creations</span>
          </Link>
        </li>

        <li>
          <NavLink to="/wishlist" onClick={() => setMenuOpen(false)}>
            <Heart className="nav-icon" strokeWidth={1.75} />
            <span>Wishlist</span>
          </NavLink>
        </li>
        <li>
  <Link
    to="/#faqs"
    className={isHome && activeSection === 'faqs' ? 'active' : ''}
    onClick={() => setMenuOpen(false)}
  >
    <HelpCircle className="nav-icon" strokeWidth={1.75} />
    <span>FAQs</span>
  </Link>
</li>

       <li>
  <Link
    to="/#review-cta"
    className={isHome && activeSection === 'review-cta' ? 'active' : ''}
    onClick={() => setMenuOpen(false)}
  >
    <MessageCircle className="nav-icon" strokeWidth={1.75} />
    <span>Reviews</span>
  </Link>
</li>

       <li>
  <Link
    to="/#contact"
    className={isHome && activeSection === 'contact' ? 'active' : ''}
    onClick={() => setMenuOpen(false)}
  >
    <Phone className="nav-icon" strokeWidth={1.75} />
    <span>Reach Us</span>
  </Link>
</li>
      </ul>
    </nav>
  )
}

export default Navbar