import { useState, useEffect } from "react";
import "../styles/Admin.css";
import { API_URL as BASE_URL, adminFetch } from "../utils/adminAuth";

const API_PATH = "/api/categories";

const DEFAULT_POS = { x: 50, y: 50, zoom: 100 };

const getImageUrl = (image) => {
  if (!image) return "";

  // Cloudinary ya koi bhi complete URL
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  // Purani /uploads/ images ke liye
  return `${BASE_URL}${image}`;
};

function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [pos, setPos] = useState(DEFAULT_POS);
  // position tabhi bhejo jab admin ne slider chhua ho (purani categories ki fallback position bani rahe)
  const [posTouched, setPosTouched] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}${API_PATH}`);

      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Fetch categories error:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // preview: nayi file chuni ho to wo, warna edit ho rahi category ki purani image
  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(existingImage ? getImageUrl(existingImage) : "");
      return;
    }

    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile, existingImage]);

  const updatePos = (key, value) => {
    setPos((prev) => ({ ...prev, [key]: Number(value) }));
    setPosTouched(true);
  };

  const resetPos = () => {
    setPos(DEFAULT_POS);
    setPosTouched(true);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setImageFile(null);
    setExistingImage("");
    setPos(DEFAULT_POS);
    setPosTouched(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    if (posTouched) {
      formData.append("imageX", String(pos.x));
      formData.append("imageY", String(pos.y));
      formData.append("imageZoom", String(pos.zoom));
    }

    try {
      const path = editingId ? `${API_PATH}/${editingId}` : API_PATH;

      const method = editingId ? "PUT" : "POST";

      const res = await adminFetch(path, {
        method,
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to save category");
      }

      await fetchCategories();
      resetForm();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setName(cat.name);
    setDescription(cat.description || "");
    setImageFile(null);
    setExistingImage(cat.image || "");
    setPos({
      x: typeof cat.imageX === "number" ? cat.imageX : DEFAULT_POS.x,
      y: typeof cat.imageY === "number" ? cat.imageY : DEFAULT_POS.y,
      zoom: typeof cat.imageZoom === "number" ? cat.imageZoom : DEFAULT_POS.zoom,
    });
    setPosTouched(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Ye category delete karni hai?")) return;

    try {
      const res = await adminFetch(`${API_PATH}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete category");
      }

      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  const origin = `${pos.x}% ${pos.y}%`;

  return (
    <div className="admin-section">
      <h2>{editingId ? "Category Edit Karo" : "Nayi Category Add Karo"}</h2>

      <form className="admin-form" onSubmit={handleSubmit}>
        <label>
          Category Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </label>

        <label>
          Image {editingId && "(chhodo agar change nahi karni)"}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0] || null)}
          />
        </label>

        {/* Image position: live preview + sliders */}
        {previewUrl && (
          <div className="cat-pos-box">
            <p className="cat-pos-title">
              Image Position (website ke card jaisa preview)
            </p>

            <div
              style={{
                width: 240,
                aspectRatio: "4 / 5",
                overflow: "hidden",
                borderRadius: "120px 120px 14px 14px",
                background: "#eee",
                position: "relative",
                margin: "0 auto 12px",
              }}
            >
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: origin,
                  transform: `scale(${pos.zoom / 100})`,
                  transformOrigin: origin,
                  display: "block",
                }}
              />
              {/* neeche ka dark text area, taaki pata chale kaunsa hissa dhakega */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: "30%",
                  background:
                    "linear-gradient(to top, rgba(45,20,35,0.85), rgba(45,20,35,0))",
                  pointerEvents: "none",
                }}
              />
            </div>

            <label>
              Left / Right ({pos.x}%)
              <input
                type="range"
                min="0"
                max="100"
                value={pos.x}
                onChange={(e) => updatePos("x", e.target.value)}
              />
            </label>

            <label>
              Up / Down ({pos.y}%)
              <input
                type="range"
                min="0"
                max="100"
                value={pos.y}
                onChange={(e) => updatePos("y", e.target.value)}
              />
            </label>

            <label>
              Zoom ({pos.zoom}%)
              <input
                type="range"
                min="100"
                max="200"
                value={pos.zoom}
                onChange={(e) => updatePos("zoom", e.target.value)}
              />
            </label>

            <button type="button" className="btn-secondary" onClick={resetPos}>
              Reset Position
            </button>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading
              ? "Saving..."
              : editingId
                ? "Update Category"
                : "Add Category"}
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
              <img src={getImageUrl(cat.image)} alt={cat.name} />
            ) : (
              <div className="admin-card-placeholder" />
            )}

            <div className="admin-card-info">
              <h4>{cat.name}</h4>

              <p>{cat.description}</p>

              <div className="admin-card-actions">
                <button onClick={() => handleEdit(cat)}>Edit</button>

                <button
                  className="danger"
                  onClick={() => handleDelete(cat._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryManager;