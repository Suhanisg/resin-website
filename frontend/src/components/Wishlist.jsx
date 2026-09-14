import { Heart, Trash2 } from "lucide-react"
import { useWishlist } from "../context/WishlistContext"
import "../styles/Wishlist.css"

function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist()

  if (wishlist.length === 0) {
    return (
      <div className="wl-empty">
        <Heart size={40} className="wl-empty-icon" />
        <h2 className="wl-empty-title">Your wishlist is empty</h2>
        <p className="wl-empty-text">Items you save will show up here.</p>
      </div>
    )
  }

  return (
    <div className="wl-page">
      <h1 className="wl-title">My Wishlist</h1>

      <div className="wl-grid">
        {wishlist.map((product) => {
          const image = product.image ? `http://localhost:5000${product.image}` : null
          return (
            <div className="wl-card" key={product._id}>
              <div className="wl-image">
                {image ? (
                  <img src={image} alt={product.name} />
                ) : (
                  <span>{product.name}</span>
                )}
                <button
                  type="button"
                  className="wl-remove-btn"
                  onClick={() => removeFromWishlist(product._id)}
                  title="Remove from wishlist"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="wl-info">
                <p className="wl-kicker">{product.category}</p>
                <h3 className="wl-name">{product.name}</h3>
                {product.variants?.[0]?.price && (
                  <p className="wl-price">
                    ₹{product.variants[0].price} <span>onwards</span>
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Wishlist