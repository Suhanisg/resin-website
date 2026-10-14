import "./diwaliPage.css";
import heroImg from "../assets/DiwaliHero.png";

const features = [
  {
    title: "Handmade",
    sub: "with Love",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z" />
      </svg>
    ),
  },
  {
    title: "Customised",
    sub: "Gifts",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="8" width="18" height="13" rx="1" />
        <path d="M12 8v13M3 12h18M12 8c-3 0-5-4-2-4 2 0 2 4 2 4zm0 0c3 0 5-4 2-4-2 0-2 4-2 4z" />
      </svg>
    ),
  },
  {
    title: "Safe & Secure",
    sub: "Delivery",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 6h12v10H2zM14 9h4l4 4v3h-8z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </svg>
    ),
  },
];

export default function DiwaliHero() {
  return (
    <section className="diwali-hero">
      <div className="diwali-hero__content">
        <p className="diwali-hero__script">Light Up Your Home</p>
        <h1 className="diwali-hero__title">
          This Diwali <span className="diwali-hero__spark">✨</span>
        </h1>
        <p className="diwali-hero__text">
          Explore our handcrafted resin gifts, home décor and personalized
          keepsakes to make your celebrations brighter and more special.
        </p>

        <a href="#products" className="diwali-hero__btn">
          EXPLORE DIWALI COLLECTION <span>→</span>
        </a>

        <div className="diwali-hero__features">
          {features.map((f) => (
            <div className="diwali-hero__feature" key={f.title}>
              <span className="diwali-hero__icon">{f.icon}</span>
              <p>
                {f.title}
                <br />
                {f.sub}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="diwali-hero__image"
        style={{ backgroundImage: `url(${heroImg})` }}
        role="img"
        aria-label="Diwali resin diyas and festive decor"
      />
    </section>
  );
}