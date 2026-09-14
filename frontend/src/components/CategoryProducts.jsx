import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ProductCard from "./ProductCard"
import "../styles/CategoryProducts.css"

const PRODUCTS_URL = "http://localhost:5000/api/products"
const CATEGORIES_URL = "http://localhost:5000/api/categories"

function CategoryProducts() {
  const { categoryName } = useParams()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  const decodedCategory = decodeURIComponent(categoryName)
  const category = categories.find((c) => c.name === decodedCategory)

  useEffect(() => {
    fetch(PRODUCTS_URL).then((res) => res.json()).then(setProducts)
    fetch(CATEGORIES_URL).then((res) => res.json()).then(setCategories)
  }, [])

  const filteredProducts = products.filter((p) => p.category === decodedCategory)

  return (
    <>
      {/* Simple back button bar */}
      <div className="cp-back-bar">
        <button className="cp-back-btn" onClick={() => navigate("/")}>
          ← Categories
        </button>
      </div>

      {/* Products */}
      <section className="cp-products-section" id="products">
        <div className="cp-products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </>
  )
}

export default CategoryProducts;