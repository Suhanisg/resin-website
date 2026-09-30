import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ProductCard from "./ProductCard"
import "../styles/CategoryProducts.css"

const PRODUCTS_URL = "https://resin-website.onrender.com/api/products"
const CATEGORIES_URL = "https://resin-website.onrender.com/api/categories"

function CategoryProducts() {
  const { categoryName } = useParams()
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  const decodedCategory = decodeURIComponent(categoryName)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(PRODUCTS_URL),
          fetch(CATEGORIES_URL),
        ])

        if (!productsRes.ok) {
          throw new Error("Failed to fetch products")
        }

        if (!categoriesRes.ok) {
          throw new Error("Failed to fetch categories")
        }

        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()

        setProducts(productsData)
        setCategories(categoriesData)
      } catch (err) {
        console.error("Category page error:", err)
      }
    }

    fetchData()
  }, [])

  const category = categories.find(
    (c) => c.name === decodedCategory
  )

  const filteredProducts = products.filter(
    (p) => p.category === decodedCategory
  )

  return (
    <>
      {/* Back button */}
      <div className="cp-back-bar">
        <button
          className="cp-back-btn"
          onClick={() => navigate("/#products")}
        >
          ← Categories
        </button>
      </div>

      {/* Products */}
      <section className="cp-products-section" id="products">
        <div className="cp-products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))
          ) : (
            <div className="cp-no-products">
              <h3>
                {category?.name || decodedCategory}
              </h3>

              <p>
                No products available in this category yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default CategoryProducts