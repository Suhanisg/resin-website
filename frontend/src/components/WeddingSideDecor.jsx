import garland from "../assets/download__2_-removebg-preview.png"
import "../styles/WeddingSideDecor.css"

function WeddingSideDecor() {
  return (
    <>
      <div className="wsd wsd--left" aria-hidden="true">
        <img src={garland} alt="" className="wsd__img" draggable="false" />
      </div>

      <div className="wsd wsd--right" aria-hidden="true">
        <img src={garland} alt="" className="wsd__img" draggable="false" />
      </div>
    </>
  )
}

export default WeddingSideDecor