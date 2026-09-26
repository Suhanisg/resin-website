import { useState } from "react"
import "../styles/FaqSection.css"
import { Heart, ChevronDown } from "lucide-react"
import { Link } from "react-router-dom"

const FAQ_DATA = [
  {
    q: "Can I customise my order?",
    a: "Yes! Most of our pieces can be customised with your choice of colours, flowers, photos, names or dates. Just share your requirements while placing a custom order.",
  },
  {
    q: "How long does it take to make and deliver?",
    a: "Handcrafted resin pieces usually take 5–7 days to make, plus shipping time based on your location. We'll confirm the exact timeline once your order is finalised.",
  },
  {
    q: "What materials do you use?",
    a: "We use high-quality, food-safe epoxy resin along with preserved real flowers, pigments and other premium materials for a long-lasting finish.",
  },
  {
    q: "Do you ship across India?",
    a: "Yes, we ship pan-India. Shipping charges are calculated separately based on your delivery location and package weight.",
  },
]

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <section className="faq-section" id="faqs">
      <div className="faq-doodle faq-doodle-left" />

      <div className="faq-container">
        <div className="faq-header">
          <div className="faq-overline">
            <span className="faq-overline-line" />
            HAVE QUESTIONS?
            <span className="faq-overline-line" />
          </div>
          <Heart size={16} className="faq-heart" fill="currentColor" />
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">
            Find quick answers to the most common questions
            <br />
            about our handmade resin creations.
          </p>
        </div>

        <div className="faq-list">
          {FAQ_DATA.slice(0, 2).map((item, i) => (
            <div
              className={`faq-item ${openIndex === i ? "open" : ""}`}
              key={i}
            >
              <button className="faq-question" onClick={() => toggle(i)}>
                <span className="faq-question-left">
                  <span className="faq-q-icon">?</span>
                  {item.q}
                </span>
                <ChevronDown size={18} className="faq-chevron" />
              </button>
              {openIndex === i && (
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

       <Link to="/faq" className="faq-more-btn">
  See More FAQs <span className="faq-more-arrow">→</span>
</Link>

        <p className="faq-note">
          We're
          <br />
          Here to Help <Heart size={12} className="faq-note-heart" fill="currentColor" />
        </p>
      </div>
    </section>
  )
}

export default FaqSection