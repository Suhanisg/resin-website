import { useState } from 'react'
import { useReviews } from '../context/ReviewsContext'

function ReviewManager() {
  const { screenshots, addScreenshot, deleteScreenshot } = useReviews()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!file) return

    const form = e.currentTarget
    setLoading(true)
    try {
      await addScreenshot(file)
      setFile(null)
      form.reset()
    } catch (err) {
      alert('Upload fail ho gaya, dobara try karo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-section admin-reviews-block">
      <h2>Add Customer Review</h2>

      <form className="admin-form" onSubmit={handleAdd}>
        <label>
          Review Screenshot
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0] || null)}
            required
          />
        </label>
        <p className="admin-hint">WhatsApp / Instagram ka customer review screenshot upload karo.</p>
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Uploading...' : 'Add Review'}
          </button>
        </div>
      </form>

      <h3>Existing Reviews ({screenshots.length})</h3>

      {screenshots.length === 0 ? (
        <p className="admin-hint">Abhi koi review nahi hai.</p>
      ) : (
        <ul className="admin-review-list">
          {screenshots.map((s) => (
            <li key={s._id} className="admin-review-item">
              {s.photo && <img src={s.photo} alt="review" className="admin-review-thumb" />}
              <button className="danger" onClick={() => deleteScreenshot(s._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ReviewManager