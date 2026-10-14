import "./DiwaliLine.css";

const items = [
  { icon: "🪔", text: <>✨ <b>Diwali Special Collection Now Live</b> ✨</> },
  { icon: "", text: <>Handmade with Love <span className="dl-heart">♥</span></> },
  { icon: "🎁", text: <>Perfect Gifts for Your Loved Ones <span className="dl-heart">♥</span></> },
  { icon: "🪔", text: <>Customize Your <b>Special Gift</b> <span className="dl-heart">♥</span></> },
//   { icon: "🚚", text: <>Free Shipping on Orders Above ₹999</> },
];

function Group({ hidden }) {
  return (
    <div className="diwali-line__group" aria-hidden={hidden}>
      {items.map((it, i) => (
        <span className="diwali-line__item" key={i}>
          {it.icon && <span className="diwali-line__icon">{it.icon}</span>}
          <span>{it.text}</span>
          <span className="diwali-line__sep">|</span>
        </span>
      ))}
    </div>
  );
}

export default function DiwaliLine() {
  return (
    <div className="diwali-line" role="marquee" aria-label="Diwali offers">
      <div className="diwali-line__track">
        <Group />
        <Group hidden />
      </div>
    </div>
  );
}