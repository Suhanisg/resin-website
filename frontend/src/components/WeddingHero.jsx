import { Link } from "react-router-dom"
import { Heart, Gift, Truck } from "lucide-react"
import heroImg from "../assets/wedding.jpg"
import "../styles/WeddingHero.css"

const marqueeItems = [
  "💍 Wedding Collection Now Live",
  "Varmala Preservation ♥",
  "Engagement Ring Platters",
  "Customised Wedding Gifts ♥",
]

function WeddingHero() {
  return (
    <>
      <section className="wh" aria-label="Wedding resin art collection">
        <div className="wh__content">
          <p className="wh__script">Make Your Forever</p>
          <h1 className="wh__title">
            Your Wedding <span>Memories</span> ✨
          </h1>
          <p className="wh__text">
            Varmala frames, engagement ring platters and custom wedding keepsakes,
            handcrafted in resin with real flowers, gold leaf and pearls.
          </p>

          <Link to="/#products" className="wh__btn">
            Explore Wedding Collection <span>→</span>
          </Link>

          <div className="wh__features">
            <div className="wh__feature">
              <Heart size={28} strokeWidth={1.6} />
              <p>Handmade<br />with Love</p>
            </div>
            <div className="wh__feature">
              <Gift size={28} strokeWidth={1.6} />
              <p>Customised<br />Gifts</p>
            </div>
            <div className="wh__feature">
              <Truck size={28} strokeWidth={1.6} />
              <p>Safe & Secure<br />Delivery</p>
            </div>
          </div>
        </div>

        <div className="wh__image" style={{ backgroundImage: `url(${heroImg})` }} />
      </section>

      <div className="wh-marquee">
        <div className="wh-marquee__track">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="wh-marquee__item">
              {item}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}

export default WeddingHero