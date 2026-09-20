import { useNavigate } from "react-router-dom"
import "../styles/ReviewSection.css"
import reviewIcon from "../assets/reviewIcon.png"
import reviewBg from "../assets/rivewBg.png"

function ReviewSection() {
  const navigate = useNavigate()

  return (
    <section className="rs-section" id="review-cta">
      <div
        className="rs-card"
        style={{ backgroundImage: `url(${reviewBg})` }}
      >
        <span className="rs-sparkle rs-sparkle-1">✦</span>
        <span className="rs-sparkle rs-sparkle-2">✧</span>

        <div className="rs-icon-wrap">
          <img src={reviewIcon} alt="Leave a review" className="rs-icon" />
        </div>

        <div className="rs-content">
          <p className="rs-eyebrow">YOUR FEEDBACK MATTERS</p>
          <h2 className="rs-title">
            Leave a Review <span className="rs-heart">♡</span>
          </h2>
          <p className="rs-subtitle">
            Share your experience and help us grow <span className="rs-heart-small">♡</span>
          </p>
        </div>

        <button className="rs-btn" onClick={() => navigate("/reviews")}>
          Write a Review <span className="rs-btn-arrow">→</span>
        </button>

        <div className="rs-curve-wrap">
          <svg
            className="rs-curve"
            viewBox="0 0 220 90"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,10 C50,5 90,40 130,45 C160,48 180,70 195,80"
              stroke="#b98fa6"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          <span className="rs-curve-heart">♡</span>
        </div>
      </div>
    </section>
  )
}

export default ReviewSection