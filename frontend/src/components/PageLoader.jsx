import "../styles/PageLoader.css"
import logo from "../assets/LoadingScreen.png"

// Transparent blur screen: beech mein logo + Loading...
// Suspense fallback ya data load hone ke time dikhayein.
function PageLoader({ text = "Loading..." }) {
  return (
    <div className="pl-overlay" role="status" aria-live="polite">
      <img src={logo} alt="Resin Creations" className="pl-logo" />
      <p className="pl-text">{text}</p>
      <div className="pl-bar" />
    </div>
  )
}

export default PageLoader