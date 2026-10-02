import { useState } from "react"
import { useNavigate } from "react-router-dom"
import CategoryManager from "./CategoryManager"
import ProductManager from "./ProductManager"
import ReviewManager from "./ReviewManager"
import { useAdminAuth } from "../context/AdminAuthContext"
import "../styles/Admin.css"
import "../styles/AdminLogin.css"

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("categories")
  const { logout } = useAdminAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/admin-login", { replace: true })
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Resin Art — Admin Panel</h1>
        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
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