import { useState } from 'react'
import "../styles/Navbar.css"
import { Link } from 'react-router-dom'
import logo from '../assets/logo_circle.png'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <img src={logo} alt="Resin Creations logo" className="nav-logo-img" />
        <span className="nav-brand-text">Resin Creations</span>
      </div>

      <button
        className="nav-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/wishlist">Wishlist</Link></li>
        <li><a href="#about">About</a></li>
        <li><a href="#custom-order">Custom Order</a></li>
        <li><a href="#contact">Reach Us</a></li>
      </ul>
    </nav>
  )
}

export default Navbar