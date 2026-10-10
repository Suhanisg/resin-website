import { useState, useEffect, useRef } from "react"
import "../styles/Admin.css"
import { API_URL as BASE_URL, adminFetch } from "../utils/adminAuth"

const PRODUCTS_PATH = "/api/products"
const PRODUCTS_URL = `${BASE_URL}${PRODUCTS_PATH}`
const CATEGORIES_URL = `${BASE_URL}/api/categories`
const SUBCATEGORIES_URL = `${BASE_URL}/api/subcategories`

const getImageUrl = (image) => {
  if (!image) return ""

  // Cloudinary / complete URL
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image
  }

  // Old /uploads images
  return `${BASE_URL}${image}`
}

const FRAME = 300
const OUTPUT = 600

function ProductManager() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [subcategory, setSubcategory] = useState("")
  const [description, setDescription] = useState("")
  const [tagline, setTagline] = useState("")
  const [details, setDetails] = useState("")
  const [material, setMaterial] = useState("")
  const [processingTime, setProcessingTime] = useState("")
  const [careInstructions, setCareInstructions] = useState("")
  const [shippingInfo, setShippingInfo] = useState("")
  const [size, setSize] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  // Manual crop tool
  const [sourceImg, setSourceImg] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({
    x: 0,
    y: 0,
    panX: 0,
    panY: 0,
  })

  const [croppedFiles, setCroppedFiles] = useState([])
  const [croppedPreviews, setCroppedPreviews] = useState([])

  const fetchProducts = async () => {
    try {
      const res = await fetch(PRODUCTS_URL)

      if (!res.ok) {
        throw new Error("Failed to fetch products")
      }

      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error("Fetch products error:", err)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch(CATEGORIES_URL)

      if (!res.ok) {
        throw new Error("Failed to fetch categories")
      }

      const data = await res.json()
      setCategories(data)
    } catch (err) {
      console.error("Fetch categories error:", err)
    }
  }

  const fetchSubcategories = async () => {
    try {
      const res = await fetch(SUBCATEGORIES_URL)

      if (!res.ok) {
        throw new Error("Failed to fetch subcategories")
      }

      const data = await res.json()
      setSubcategories(data)
    } catch (err) {
      console.error("Fetch subcategories error:", err)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchSubcategories()
  }, [])

  const resetForm = () => {
    setName("")
    setCategory("")
    setSubcategory("")
    setDescription("")
    setTagline("")
    setDetails("")
    setMaterial("")
    setProcessingTime("")
    setCareInstructions("")
    setShippingInfo("")
    setSize("")
    setImageFile(null)
    setSourceImg(null)
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setCroppedFiles([])
    setCroppedPreviews([])
    setEditingId(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]

    if (!file) return

    setImageFile(file)
    setCroppedFiles([])
    setCroppedPreviews([])

    const img = new Image()

    img.onload = () => {
      setSourceImg(img)
      setZoom(1)
      setPan({ x: 0, y: 0 })
    }

    img.src = URL.createObjectURL(file)
  }

  const getDisplayedSize = () => {
    if (!sourceImg) {
      return {
        w: 0,
        h: 0,
        baseScale: 1,
        totalScale: 1,
      }
    }

    const baseScale =
      Math.max(
        FRAME / sourceImg.width,
        FRAME / sourceImg.height
      ) * 1.15

    const totalScale = baseScale * zoom

    return {
      w: sourceImg.width * totalScale,
      h: sourceImg.height * totalScale,
      totalScale,
    }
  }

  const clampPan = (x, y) => {
    const { w, h } = getDisplayedSize()

    const maxX = Math.max(0, (w - FRAME) / 2)
    const maxY = Math.max(0, (h - FRAME) / 2)

    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    }
  }

  // ===== Pointer events: mouse + touch dono ke liye =====
  const onPointerDown = (e) => {
    // Sirf left mouse button ya touch/pen
    if (e.pointerType === "mouse" && e.button !== 0) return

    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)

    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    }
  }

  const onPointerMove = (e) => {
    if (!dragging) return

    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y

    setPan(
      clampPan(
        dragStart.current.panX + dx,
        dragStart.current.panY + dy
      )
    )
  }

  const onPointerUp = (e) => {
    if (
      e.currentTarget.hasPointerCapture &&
      e.currentTarget.hasPointerCapture(e.pointerId)
    ) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }

    setDragging(false)
  }

  const handleZoomChange = (val) => {
    setZoom(val)

    // zoom change ke baad pan ko naye size ke hisaab se clamp karo
    const baseScale =
      sourceImg
        ? Math.max(
            FRAME / sourceImg.width,
            FRAME / sourceImg.height
          ) * 1.15
        : 1

    const w = sourceImg ? sourceImg.width * baseScale * val : 0
    const h = sourceImg ? sourceImg.height * baseScale * val : 0

    const maxX = Math.max(0, (w - FRAME) / 2)
    const maxY = Math.max(0, (h - FRAME) / 2)

    setPan((p) => ({
      x: Math.min(maxX, Math.max(-maxX, p.x)),
      y: Math.min(maxY, Math.max(-maxY, p.y)),
    }))
  }

  const saveCurrentCrop = () => {
    if (!sourceImg || croppedFiles.length >= 3) {
      return
    }

    const { totalScale } = getDisplayedSize()

    const imgLeft =
      (FRAME - sourceImg.width * totalScale) / 2 + pan.x

    const imgTop =
      (FRAME - sourceImg.height * totalScale) / 2 + pan.y

    const sx = -imgLeft / totalScale
    const sy = -imgTop / totalScale
    const sSize = FRAME / totalScale

    const canvas = document.createElement("canvas")

    canvas.width = OUTPUT
    canvas.height = OUTPUT

    const ctx = canvas.getContext("2d")

    ctx.drawImage(
      sourceImg,
      sx,
      sy,
      sSize,
      sSize,
      0,
      0,
      OUTPUT,
      OUTPUT
    )

    canvas.toBlob(
      (blob) => {
        if (!blob) return

        const file = new File(
          [blob],
          `crop-${Date.now()}.jpg`,
          {
            type: "image/jpeg",
          }
        )

        setCroppedFiles((prev) => [...prev, file])

        setCroppedPreviews((prev) => [
          ...prev,
          URL.createObjectURL(file),
        ])

        setZoom(1)
        setPan({ x: 0, y: 0 })
      },
      "image/jpeg",
      0.9
    )
  }

  const removeCrop = (index) => {
    setCroppedFiles((prev) =>
      prev.filter((_, i) => i !== index)
    )

    setCroppedPreviews((prev) =>
      prev.filter((_, i) => i !== index)
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()

    formData.append("name", name)
    formData.append("category", category)
    formData.append("subcategory", subcategory)
    formData.append("description", description)
    formData.append("tagline", tagline)
    formData.append("details", details)
    formData.append("material", material)
    formData.append("processingTime", processingTime)
    formData.append("careInstructions", careInstructions)
    formData.append("shippingInfo", shippingInfo)
    formData.append("size", size)

    if (imageFile) {
      formData.append("image", imageFile)
    }

    croppedFiles.forEach((file) => {
      formData.append("images", file)
    })

    try {
      const path = editingId
        ? `${PRODUCTS_PATH}/${editingId}`
        : PRODUCTS_PATH

      const method = editingId ? "PUT" : "POST"

      const res = await adminFetch(path, {
        method,
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Failed to save product")
      }

      await fetchProducts()
      resetForm()
    } catch (err) {
      console.error(err)
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (p) => {
    setEditingId(p._id)
    setName(p.name)
    setCategory(p.category)
    setSubcategory(p.subcategory || "")

    setDescription(p.description || "")
    setTagline(p.tagline || "")
    setDetails(p.details || "")
    setMaterial(p.material || "")
    setProcessingTime(p.processingTime || "")
    setCareInstructions(p.careInstructions || "")
    setShippingInfo(p.shippingInfo || "")
    setSize(p.size || "")

    setImageFile(null)
    setSourceImg(null)
    setCroppedFiles([])
    setCroppedPreviews([])
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Ye product delete karna hai?")) {
      return
    }

    try {
      const res = await adminFetch(
        `${PRODUCTS_PATH}/${id}`,
        {
          method: "DELETE",
        }
      )

      if (!res.ok) {
        throw new Error("Failed to delete product")
      }

      fetchProducts()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="admin-section">
      <h2>
        {editingId
          ? "Product Edit Karo"
          : "Naya Product Add Karo"}
      </h2>

      <form
        className="admin-form"
        onSubmit={handleSubmit}
      >
        <label>
          Product Name

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Category

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
              setSubcategory("")
            }}
            required
          >
            <option value="">
              -- Select Category --
            </option>

            {categories.map((cat) => (
              <option
                key={cat._id}
                value={cat.name}
              >
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        {subcategories.some(
          (s) => s.category === category
        ) && (
          <label>
            Subcategory (optional)

            <select
              value={subcategory}
              onChange={(e) =>
                setSubcategory(e.target.value)
              }
            >
              <option value="">
                -- No subcategory --
              </option>

              {subcategories
                .filter(
                  (s) => s.category === category
                )
                .map((s) => (
                  <option
                    key={s._id}
                    value={s._id}
                  >
                    {s.name}
                  </option>
                ))}
            </select>
          </label>
        )}

        {/* <label>
          Short Tagline

          <input
            placeholder="e.g. Your special day, preserved forever"
            value={tagline}
            onChange={(e) =>
              setTagline(e.target.value)
            }
          />
        </label>

        <label>
          Description

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows={2}
          />
        </label> */}

        <label>
          Product Details

          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={2}
          />
        </label>

        <label>
          Material & Quality

          <textarea
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            rows={2}
          />
        </label>

        {/* <label>
          Processing Time

          <textarea
            value={processingTime}
            onChange={(e) =>
              setProcessingTime(e.target.value)
            }
            rows={2}
          />
        </label> */}

        {/* <label>
          Care Instructions

          <textarea
            value={careInstructions}
            onChange={(e) =>
              setCareInstructions(e.target.value)
            }
            rows={2}
          />
        </label> */}

        {/* <label>
          Shipping Information

          <textarea
            value={shippingInfo}
            onChange={(e) =>
              setShippingInfo(e.target.value)
            }
            rows={2}
          />
        </label> */}

        <label>
          Size

          <input
            placeholder="e.g. 6 inch, 8 x 10 inch, 12 inch"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
        </label>

        <label>
          Main Image{" "}
          {editingId &&
            "(chhodo agar change nahi karni)"}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
          />
        </label>

        {/* Manual Crop Tool */}
        {sourceImg &&
          croppedFiles.length < 3 && (
            <div className="crop-tool">
              <p className="admin-hint">
                Image ko drag karke position set
                karo, zoom se adjust karo, fir
                "Save this crop" dabao.
                ({croppedFiles.length}/3
                thumbnails saved)
              </p>

              <div
                className="crop-frame"
                style={{
                  width: FRAME,
                  height: FRAME,
                }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              >
                <img
                  src={sourceImg.src}
                  alt="crop-source"
                  draggable={false}
                  style={{
                    width: getDisplayedSize().w,
                    height: getDisplayedSize().h,
                    transform: `translate(${pan.x}px, ${pan.y}px)`,
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    marginLeft:
                      -getDisplayedSize().w / 2,
                    marginTop:
                      -getDisplayedSize().h / 2,
                    cursor: dragging
                      ? "grabbing"
                      : "grab",
                    maxWidth: "none",
                  }}
                />
              </div>

              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) =>
                  handleZoomChange(
                    parseFloat(e.target.value)
                  )
                }
                className="crop-zoom"
              />

              <button
                type="button"
                className="btn-primary"
                onClick={saveCurrentCrop}
              >
                Save this crop (
                {croppedFiles.length + 1}
                /3)
              </button>
            </div>
          )}

        {croppedPreviews.length > 0 && (
          <div className="admin-crop-preview">
            <p className="admin-hint">
              Saved thumbnails:
            </p>

            <div className="admin-crop-row">
              {croppedPreviews.map((src, i) => (
                <div
                  key={i}
                  className="admin-crop-thumb-wrap"
                >
                  <img
                    src={src}
                    alt={`crop-${i}`}
                    className="admin-crop-thumb"
                  />

                  <button
                    type="button"
                    className="admin-crop-remove"
                    onClick={() => removeCrop(i)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update Product"
              : "Add Product"}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn-secondary"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3>
        Existing Products ({products.length})
      </h3>

      <div className="admin-grid">
        {products.map((p) => (
          <div
            className="admin-card"
            key={p._id}
          >
            {p.image ? (
              <img
                src={getImageUrl(p.image)}
                alt={p.name}
              />
            ) : (
              <div className="admin-card-placeholder" />
            )}

            <div className="admin-card-info">
              <h4>{p.name}</h4>

              <p className="admin-card-meta">
                {p.category}
                {p.subcategory &&
                  subcategories.find(
                    (s) => s._id === p.subcategory
                  ) &&
                  ` › ${
                    subcategories.find(
                      (s) => s._id === p.subcategory
                    ).name
                  }`}
              </p>

              <div className="admin-card-actions">
                <button
                  onClick={() => handleEdit(p)}
                >
                  Edit
                </button>

                <button
                  className="danger"
                  onClick={() =>
                    handleDelete(p._id)
                  }
                >
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

export default ProductManager