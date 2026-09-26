import { useState } from "react"
import "../styles/FaqPage.css"
import { ChevronDown } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"

const WHATSAPP_NUMBER = "919528633710"

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
    q: "Do you offer international shipping?",
    a: "Currently we ship across India. For international orders, please reach out to us directly on WhatsApp and we'll try our best to accommodate you.",
  },
  {
    q: "How do I place a custom order?",
    a: "Simply click the 'Custom Order' button on any product, fill in your details and preferences, and submit — your order details will be sent to us directly on WhatsApp.",
  },
  {
    q: "What materials do you use?",
    a: "We use high-quality, food-safe epoxy resin along with preserved real flowers, pigments and other premium materials for a long-lasting finish.",
  },
  {
    q: "How can I share my reference photos or ideas?",
    a: "You can share any reference photos, Pinterest links or ideas with us on WhatsApp after placing your custom order — we'll use them to personalise your piece.",
  },
  {
    q: "Is shipping included in the product price?",
    a: "No, the price shown is for the product only. Shipping charges are calculated separately based on your delivery location and package weight, and confirmed before your order is placed.",
  },
  {
    q: "What is your return or cancellation policy?",
    a: "Since every piece is made-to-order and personalised, we currently do not accept returns or cancellations once production has started. Please reach out to us for any concerns.",
  },
  {
    q: "How do I care for my resin products?",
    a: "Keep your resin pieces away from direct, prolonged sunlight and extreme heat. Clean gently with a soft, dry cloth to keep them looking new for years.",
  },
  {
    q: "Do you offer gift packaging?",
    a: "Yes, all our pieces come thoughtfully packaged and are gift-ready. You can also request a personalised note by mentioning it while placing your order.",
  },
]

function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  const handleWhatsAppClick = () => {
    const message = "Hi! I have a question about your resin creations."
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    )
  }

  return (
    <section className="faqp-section">
      <div className="faqp-doodle faqp-doodle-left" />
      <div className="faqp-doodle faqp-doodle-right" />

      <div className="faqp-container">
        <div className="faqp-header">
          <div className="faqp-overline">
            <span className="faqp-overline-line" />
            HAVE QUESTIONS?
            <span className="faqp-overline-line" />
          </div>
          <h1 className="faqp-title">Frequently Asked Questions</h1>
          <p className="faqp-subtitle">
            Find detailed answers to help you shop, customise and care for your resin creations.
          </p>
        </div>

        <div className="faqp-list">
          {FAQ_DATA.map((item, i) => (
            <div
              className={`faqp-item ${openIndex === i ? "open" : ""}`}
              key={i}
            >
              <button className="faqp-question" onClick={() => toggle(i)}>
                <span className="faqp-question-left">
                  <span className="faqp-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.q}
                </span>
                <ChevronDown size={18} className="faqp-chevron" />
              </button>
              {openIndex === i && (
                <div className="faqp-answer">
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="faqp-footer">
          <p className="faqp-footer-note">
            Still have a question?
            <br />
            We're just a message away! ♡
          </p>
          <button className="faqp-whatsapp-btn" onClick={handleWhatsAppClick}>
            <FaWhatsapp size={16} />
            Chat on WhatsApp
          </button>
        </div>
      </div>
    </section>
  )
}

export default FaqPage