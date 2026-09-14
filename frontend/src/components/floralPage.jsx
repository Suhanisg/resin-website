import { Flower2, Gift, ShieldCheck, Heart } from "lucide-react"
import "../styles/floralPage.css"
// import floralImg from "../assets/floral.jpg"

const FEATURES = [
  {
    icon: Flower2,
    title: "Real Flowers Preserved",
    desc: "Your precious memories, kept forever.",
  },
  {
    icon: Gift,
    title: "Customised Just for You",
    desc: "Personalised designs to match your story.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Secure Delivery",
    desc: "Careful packaging to ensure your keepsake reaches you safely.",
  },
  {
    icon: Heart,
    title: "Made with Love",
    desc: "Each piece is handcrafted with care and passion.",
  },
]

function FloralPage() {
  return (
    <section className="fp-section">
      <div className="fp-features">
        {FEATURES.map((f, i) => {
          const Icon = f.icon
          return (
            <div className="fp-feature" key={i}>
              <div className="fp-feature-icon">
                <Icon size={24} strokeWidth={1.6} />
              </div>
              <div className="fp-feature-text">
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
              {i < FEATURES.length - 1 && <span className="fp-divider" aria-hidden="true" />}
            </div>
          )
        })}
      </div>


    </section>
  )
}

export default FloralPage