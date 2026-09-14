import { useState } from "react"
import CategoryManager from "./CategoryManager"
import ProductManager from "./ProductManager"
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
      </div>

      <div className="admin-content">
        {activeTab === "categories" ? <CategoryManager /> : <ProductManager />}
      </div>
    </div>
  )
}

export default AdminPanel;