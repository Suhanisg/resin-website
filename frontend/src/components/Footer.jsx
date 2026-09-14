import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../styles/Footer.css"
import {
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaChevronRight,
} from "react-icons/fa"
import { GiFlowerPot } from "react-icons/gi"
import { FaHeart } from "react-icons/fa"
import footerFlower from "../assets/image4.png"

const CATEGORIES_URL = "http://localhost:5000/api/categories"

function Footer() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch(CATEGORIES_URL)
      .then((res) => res.json())
      .then(setCategories)
      .catch((err) => console.error("Failed to load categories:", err))
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="footer" id="contact">
      <svg
        className="footer-wave"
        viewBox="0 0 1440 180"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,80 C220,160 380,0 620,60 C860,120 1040,10 1260,70 C1350,95 1400,110 1440,100 L1440,180 L0,180 Z"
          fill="#2a1a24"
        />
      </svg>

      <img src={footerFlower} className="footer-flower" alt="" />

      <div className="footer-container">

        <div className="footer-col footer-brand">
          <h3 className="footer-logo">Resin Creations</h3>
          <p>I create personalised resin keepsakes, turning your special moments into timeless treasures.</p>
          <div className="footer-socials">
            <a href="https://instagram.com/Mandala_collection710" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram size={14} />
            </a>
          <a href="https://facebook.com/Mandala_collection710" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
  <FaFacebookF size={14} />
</a>
            <a href="https://wa.me/918077188283" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <FaWhatsapp size={14} />
            </a>
          </div>
          <div className="footer-divider-1" />
          <p className="footer-madewithlove">
            Made with love,<br />meant to last <FaHeart size={11} className="inline-heart" />
          </p>
        </div>

        <div className="footer-col footer-col-links">
          <h4>Quick Links</h4>
          <ul className="footer-links-list">
            <li><Link to="/" onClick={scrollToTop}>Home <FaChevronRight size={11} className="link-arrow" /></Link></li>
            <li><Link to="/wishlist">Wishlist <FaChevronRight size={11} className="link-arrow" /></Link></li>
            <li><a href="#about">About <FaChevronRight size={11} className="link-arrow" /></a></li>
            <li><a href="#custom-order">Custom Order <FaChevronRight size={11} className="link-arrow" /></a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Categories</h4>
          <ul className="footer-links-list">
            {categories.map((cat) => (
              <li key={cat._id}>
                <Link to={`/category/${encodeURIComponent(cat.name)}`}>
                  {cat.name} <FaChevronRight size={11} className="link-arrow" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col footer-contact footer-col-touch">
          <h4>Get in Touch</h4>

          <div className="contact-row">
            <FaMapMarkerAlt size={14} className="contact-icon" />
            <p>Aligarh, Uttar Pradesh</p>
          </div>

          <div className="contact-row">
            <FaEnvelope size={14} className="contact-icon" />
            <a href="mailto:Pankhugoyal710@gmail.com" className="contact-link">Pankhugoyal710@gmail.com</a>
          </div>

          <div className="contact-row">
            <FaPhoneAlt size={14} className="contact-icon" />
            <a href="tel:+918077188283" className="contact-link">+91 80771 88283</a>
          </div>

          <div className="footer-divider-2" />

          <div className="footer-note">
            <GiFlowerPot size={20} className="footer-note-icon" />
            <span>
              Let's create something<br />
              beautiful together <FaHeart size={11} className="inline-heart" />
            </span>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p className="footer-bottom-copyright">© {new Date().getFullYear()} Resin Creation. All Rights Reserved.</p>

          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <span>|</span>
            <a href="#">Terms &amp; Conditions</a>
            <span>|</span>
            <a href="#">Shipping Policy</a>
            <span>|</span>
            <a href="#">Return Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;