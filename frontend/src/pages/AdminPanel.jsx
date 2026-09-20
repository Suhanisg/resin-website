import { useState } from "react"
import CategoryManager from "./CategoryManager"
import ProductManager from "./ProductManager"
import ReviewManager from "./ReviewManager"
import "../styles/Admin.css"

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("categories")

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Resin Art — Admin Panel</h1>
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === "categories" ? "active" : ""}
          onClick={() => setActiveTab("categories")}
        >
          Categories
        </button>
        <button
          className={activeTab === "products" ? "active" : ""}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
        <button
          className={activeTab === "reviews" ? "active" : ""}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "categories" && <CategoryManager />}
        {activeTab === "products" && <ProductManager />}
        {activeTab === "reviews" && <ReviewManager />}
      </div>
    </div>
  )
}

export default AdminPanel;