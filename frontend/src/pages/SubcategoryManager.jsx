import { useState, useEffect, useRef } from "react"
import { API_URL, adminFetch } from "../utils/adminAuth"
import { getImageUrl } from "../utils/imageUrls"
import "../styles/Admin.css"

const SUBCATEGORIES_PATH = "/api/subcategories"
const CATEGORIES_PATH = "/api/categories"

function SubcategoryManager() {
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [category, setCategory] = useState("")
  const [name, setName] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}${CATEGORIES_PATH}`)
      if (!res.ok) throw new Error("Failed to fetch categories")
      setCategories(await res.json())
    } catch (err) {
      console.error("Fetch categories error:", err)
    }
  }

  const fetchSubcategories = async () => {
    try {
      const res = await fetch(`${API_URL}${SUBCATEGORIES_PATH}`)
      if (!res.ok) throw new Error("Failed to fetch subcategories")
      setSubcategories(await res.json())
    } catch (err) {
      console.error("Fetch subcategories error:", err)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchSubcategories()
  }, [])

  const resetForm = () => {
    setCategory("")
    setName("")
    setImageFile(null)
    setEditingId(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append("category", category)
    formData.append("name", name)
    if (imageFile) formData.append("image", imageFile)

    try {
      const path = editingId
        ? `${SUBCATEGORIES_PATH}/${editingId}`
        : SUBCATEGORIES_PATH
      const method = editingId ? "PUT" : "POST"

      const res = await adminFetch(path, { method, body: formData })
      if (!res.ok) throw new Error("Failed to save subcategory")

      await fetchSubcategories()
      resetForm()
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (sub) => {
    setEditingId(sub._id)
    setCategory(sub.category)
    setName(sub.name)
    setImageFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Ye subcategory delete karni hai? Uske products category mein hi rahenge.")) return

    try {
      const res = await adminFetch(`${SUBCATEGORIES_PATH}/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete subcategory")
      fetchSubcategories()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="admin-section">
      <h2>
        {editingId ? "Subcategory Edit Karo" : "Nayi Subcategory Add Karo"}
      </h2>

      <form className="admin-form" onSubmit={handleSubmit}>
        <label>
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Subcategory Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Photo Frame"
            required
          />
        </label>

        <label>
          Photo {editingId && "(chhodo agar change nahi karni)"}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0] || null)}
          />
        </label>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading
              ? "Saving..."
              : editingId
              ? "Update Subcategory"
              : "Add Subcategory"}
          </button>

          {editingId && (
            <button type="button" className="btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3>Existing Subcategories ({subcategories.length})</h3>

      <div className="admin-grid">
        {subcategories.map((sub) => (
          <div className="admin-card" key={sub._id}>
            {sub.image ? (
              <img src={getImageUrl(sub.image)} alt={sub.name} />
            ) : (
              <div className="admin-card-placeholder" />
            )}

            <div className="admin-card-info">
              <h4>{sub.name}</h4>
              <p className="admin-card-meta">{sub.category}</p>

              <div className="admin-card-actions">
                <button onClick={() => handleEdit(sub)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(sub._id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubcategoryManager