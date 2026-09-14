import { useState, useEffect } from "react"
import "../styles/Admin.css"

const API_URL = "http://localhost:5000/api/categories"

function CategoryManager() {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchCategories = async () => {
    const res = await fetch(API_URL)
    const data = await res.json()
    setCategories(data)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const resetForm = () => {
    setName("")
    setDescription("")
    setImageFile(null)
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append("name", name)
    formData.append("description", description)
    if (imageFile) formData.append("image", imageFile)

    try {
      const url = editingId ? `${API_URL}/${editingId}` : API_URL
      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, { method, body: formData })
      if (!res.ok) throw new Error("Failed to save category")

      await fetchCategories()
      resetForm()
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (cat) => {
    setEditingId(cat._id)
    setName(cat.name)
    setDescription(cat.description || "")
    setImageFile(null)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Ye category delete karni hai?")) return
    await fetch(`${API_URL}/${id}`, { method: "DELETE" })
    fetchCategories()
  }

  return (
    <div className="admin-section">
      <h2>{editingId ? "Category Edit Karo" : "Nayi Category Add Karo"}</h2>

      <form className="admin-form" onSubmit={handleSubmit}>
        <label>
          Category Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <label>
          Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
        </label>

        <label>
          Image {editingId && "(chhodo agar change nahi karni)"}
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
        </label>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : editingId ? "Update Category" : "Add Category"}
          </button>
          {editingId && (
            <button type="button" className="btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3>Existing Categories ({categories.length})</h3>
      <div className="admin-grid">
        {categories.map((cat) => (
          <div className="admin-card" key={cat._id}>
            {cat.image ? (
              <img src={`http://localhost:5000${cat.image}`} alt={cat.name} />
            ) : (
              <div className="admin-card-placeholder" />
            )}
            <div className="admin-card-info">
              <h4>{cat.name}</h4>
              <p>{cat.description}</p>
              <div className="admin-card-actions">
                <button onClick={() => handleEdit(cat)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(cat._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryManager;