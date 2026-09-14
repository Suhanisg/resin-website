import {
  Heart,
  PersonStanding,
  Mail,
  Scaling,
  ShoppingCart,
  Palette,
  CalendarDays,
  MapPinHouse,
  FileBox,
  Camera,
} from "lucide-react"
import "../styles/customForm.css"
import { FaWhatsapp } from "react-icons/fa"

export function CustomOrderForm({
  product,
  selectedIndex,
  setSelectedIndex,
  quantity,
  setQuantity,
  orderForm,
  updateOrderField,
  onSubmit,
  onBack,
}) {
  return (
    <form className="com-form" onSubmit={onSubmit}>
      <button type="button" className="com-back" onClick={onBack}>
        ← Back
      </button>

      <div className="com-form-header">
        <h2 className="com-title">Custom Order</h2>
        <p className="com-subtitle">Let's create something meaningful together!</p>

        <div className="com-note">
          <Heart size={18} className="com-note-icon" fill="currentColor" />
          <p className="com-muted">
            Fill in the details below and we'll receive your information on WhatsApp.
            You can share your photos with us there after placing the order.
          </p>
        </div>
      </div>

      <div className="com-field">
        <div className="com-field-icon">
          <PersonStanding size={20} />
        </div>
        <div className="com-field-content">
          <label className="com-label" htmlFor="name">Your Name *</label>
          <input
            id="name"
            required
            value={orderForm.name}
            onChange={(e) => updateOrderField("name", e.target.value)}
            placeholder="Enter your name"
          />
        </div>
      </div>

      <div className="com-field">
        <div className="com-field-icon">
          <FaWhatsapp size={18} />
        </div>
        <div className="com-field-content">
          <label className="com-label" htmlFor="whatsapp">WhatsApp Number *</label>
          <input
            id="whatsapp"
            required
            value={orderForm.whatsapp}
            onChange={(e) => updateOrderField("whatsapp", e.target.value)}
            placeholder="Enter your WhatsApp number"
          />
        </div>
      </div>

      <div className="com-field">
        <div className="com-field-icon">
          <Mail size={18} />
        </div>
        <div className="com-field-content">
          <label className="com-label" htmlFor="email">Email (Optional)</label>
          <input
            id="email"
            type="email"
            value={orderForm.email}
            onChange={(e) => updateOrderField("email", e.target.value)}
            placeholder="Enter your email"
          />
        </div>
      </div>

    

     {product.variants?.length > 0 && (
  <div className="com-field">
    <div className="com-field-icon">
      <Scaling size={16} />
    </div>
    <div className="com-field-content">
      <span className="com-label">Choose Size *</span>
      <div className="com-size-group">
        {product.variants.map((v, i) => (
          <button
            type="button"
            key={i}
            className={i === selectedIndex ? "com-size-btn active" : "com-size-btn"}
            onClick={() => setSelectedIndex(i)}
          >
            {v.size}
          </button>
        ))}
      </div>
      {product.variants[selectedIndex] && (
        <span className="com-size-price">
          ₹{product.variants[selectedIndex].price} <span className="com-size-price-suffix">for this size excluding shipping charges</span>
        </span>
      )}
    </div>
  </div>
)}

      <div className="com-field">
        <div className="com-field-icon">
          <Palette size={18} />
        </div>
        <div className="com-field-content">
          <label className="com-label" htmlFor="customisation">Customisation Required *</label>
          <textarea
            id="customisation"
            value={orderForm.customisation}
            onChange={(e) => updateOrderField("customisation", e.target.value)}
            placeholder="E.g. couple photo, name, date, colour theme, etc."
          />
        </div>
      </div>

      <div className="com-field">
        <div className="com-field-icon">
          <CalendarDays size={18} />
        </div>
        <div className="com-field-content">
          <label className="com-label" htmlFor="eventDate">Wedding / Event Date (Optional)</label>
          <input
            id="eventDate"
            type="date"
            value={orderForm.eventDate}
            onChange={(e) => updateOrderField("eventDate", e.target.value)}
          />
        </div>
      </div>

      <div className="com-field">
        <div className="com-field-icon">
          <MapPinHouse size={18} />
        </div>
        <div className="com-field-content">
          <label className="com-label" htmlFor="city">Delivery City *</label>
          <input
            id="city"
            required
            value={orderForm.city}
            onChange={(e) => updateOrderField("city", e.target.value)}
            placeholder="Enter your city"
          />
        </div>
      </div>

      <div className="com-field">
        <div className="com-field-icon">
          <FileBox size={18} />
        </div>
        <div className="com-field-content">
          <label className="com-label" htmlFor="instructions">Special Instructions (Optional)</label>
          <textarea
            id="instructions"
            value={orderForm.instructions}
            onChange={(e) => updateOrderField("instructions", e.target.value)}
            placeholder="Any additional details you'd like to share..."
          />
        </div>
      </div>

            <div className="com-photo-note">
        <Camera size={18} className="com-photo-note-icon" />
        <p className="com-photo-note-text">
          You can share your Varmala photos with us on WhatsApp after submitting this form.
        </p>
      </div>

      <button type="submit" className="com-btn-solid com-btn-full">
        Order on WhatsApp
      </button>
      <p className="com-fineprint">Your details will be shared with us on WhatsApp.</p>
    </form>
  )
}

export function ThankYouCard({ onSend, onBack }) {
  return (
    <div className="com-thankyou">
      <div className="com-check">✓</div>
      <h2 className="com-title">Thank You!</h2>
      <p className="com-muted">
        Your details are ready to be sent on WhatsApp. Click the button below to send your order details to us on WhatsApp.
      </p>
      <button className="com-btn-solid com-btn-full" onClick={onSend}>
        Send on WhatsApp
      </button>
      <button className="com-btn-outline com-btn-full" onClick={onBack}>
        Go Back
      </button>
    </div>
  )
}