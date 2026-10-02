import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ProductCard from "./ProductCard"
import { API_URL } from "../utils/api"
import { getImageUrl } from "../utils/imageUrls"
import "../styles/CategoryProducts.css"

const PRODUCTS_URL = `${API_URL}/api/products`
const CATEGORIES_URL = `${API_URL}/api/categories`
const SUBCATEGORIES_URL = `${API_URL}/api/subcategories`

function CategoryProducts() {
  const { categoryName } = useParams()
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [activeSub, setActiveSub] = useState(null)
  const [loading, setLoading] = useState(true)

  const decodedCategory = decodeURIComponent(categoryName)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, subsRes] = await Promise.all([
          fetch(PRODUCTS_URL),
          fetch(CATEGORIES_URL),
          fetch(SUBCATEGORIES_URL),
        ])

        if (!productsRes.ok) throw new Error("Failed to fetch products")
        if (!categoriesRes.ok) throw new Error("Failed to fetch categories")

        setProducts(await productsRes.json())
        setCategories(await categoriesRes.json())

        // subcategories na aayein to bhi page chalna chahiye
        if (subsRes.ok) setSubcategories(await subsRes.json())
      } catch (err) {
        console.error("Category page error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // category badalne par filter reset
  useEffect(() => {
    setActiveSub(null)
  }, [decodedCategory])

  const category = categories.find((c) => c.name === decodedCategory)

  const categorySubs = subcategories.filter(
    (s) => s.category === decodedCategory
  )

  const categoryProducts = products.filter(
    (p) => p.category === decodedCategory
  )

  const filteredProducts = activeSub
    ? categoryProducts.filter((p) => p.subcategory === activeSub)
    : categoryProducts

  return (
    <>
      {/* Back button */}
      <div className="cp-back-bar">
        <button className="cp-back-btn" onClick={() => navigate("/#products")}>
          ← Categories
        </button>
      </div>

      {/* Subcategory chips (sirf tab jab is category ki subcategories hon) */}
      {categorySubs.length > 0 && (
        <div className="cp-sub-wrap">
          <h2 className="cp-sub-heading">{category?.name || decodedCategory}</h2>

          <div className="cp-sub-row">
            <button
              className={`cp-sub-chip cp-sub-all ${!activeSub ? "active" : ""}`}
              onClick={() => setActiveSub(null)}
            >
              All
            </button>

            {categorySubs.map((sub) => (
              <button
                key={sub._id}
                className={`cp-sub-chip ${activeSub === sub._id ? "active" : ""}`}
                onClick={() =>
                  setActiveSub(activeSub === sub._id ? null : sub._id)
                }
              >
                {sub.image && (
                  <img
                    src={getImageUrl(sub.image)}
                    alt={sub.name}
                    className="cp-sub-thumb"
                  />
                )}
                <span>{sub.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <section className="cp-products-section" id="products">
        <div className="cp-products-grid">
          {loading ? null : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="cp-no-products">
              <h3>{category?.name || decodedCategory}</h3>

              <p>
                {activeSub
                  ? "No products in this subcategory yet."
                  : "No products available in this category yet."}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default CategoryProducts