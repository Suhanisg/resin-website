import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useReviews } from '../context/ReviewsContext'

const TABS = ['pending', 'approved', 'rejected']

const getPhotos = (r) => {
  if (Array.isArray(r.photos) && r.photos.length > 0) return r.photos
  if (r.photo) return [r.photo]
  return []
}

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

function ReviewManager() {
  const {
    screenshots,
    addScreenshot,
    deleteScreenshot,
    adminReviews,
    loadAdminReviews,
    setReviewStatus,
    deleteReview,
  } = useReviews()

  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('pending')

  useEffect(() => {
    loadAdminReviews(tab).catch(() => toast.error('Reviews load nahi hue'))
  }, [tab, loadAdminReviews])

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

  const handleStatus = async (id, status) => {
    try {
      await setReviewStatus(id, status)
      toast.success(status === 'approved' ? 'Review approved ✅' : 'Review rejected')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Ye review permanently delete karna hai?')) return
    try {
      await deleteReview(id)
      toast.success('Review deleted')
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="admin-section admin-reviews-block">
      {/* ---------- Customer text reviews (moderation) ---------- */}
      <h2>Customer Reviews</h2>

      <div className="admin-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            className={tab === t ? 'active' : ''}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {adminReviews.length === 0 ? (
        <p className="admin-hint">Is tab mein koi review nahi hai.</p>
      ) : (
        <ul className="admin-rv-list">
          {adminReviews.map((r) => {
            const photos = getPhotos(r)
            return (
              <li key={r._id} className="admin-rv-card">
                <div className="admin-rv-body">
                  <div className="admin-rv-head">
                    <strong className="admin-rv-name">{r.name}</strong>
                    <span className="admin-rv-stars" aria-label={`${r.rating} stars`}>
                      {'★'.repeat(r.rating)}
                      <span className="admin-rv-stars-off">{'★'.repeat(5 - r.rating)}</span>
                    </span>
                  </div>
                  <span className="admin-rv-date">{formatDate(r.createdAt)}</span>
                  <p className="admin-rv-text">{r.review}</p>

                  {photos.length > 0 && (
                    <div className="admin-rv-photos">
                      {photos.map((p) => (
                        <a key={p} href={p} target="_blank" rel="noreferrer">
                          <img src={p} alt={r.name} className="admin-rv-thumb" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <div className="admin-rv-actions">
                  {r.status !== 'approved' && (
                    <button
                      type="button"
                      className="rv-btn rv-approve"
                      onClick={() => handleStatus(r._id, 'approved')}
                    >
                      Approve
                    </button>
                  )}
                  {r.status !== 'rejected' && (
                    <button
                      type="button"
                      className="rv-btn rv-reject"
                      onClick={() => handleStatus(r._id, 'rejected')}
                    >
                      Reject
                    </button>
                  )}
                  <button
                    type="button"
                    className="rv-btn rv-delete"
                    onClick={() => handleDelete(r._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {/* ---------- Screenshots (pehle jaisa) ---------- */}
      <h2 className="admin-rv-subhead">Add Review Screenshot</h2>

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

      <h3>Existing Screenshots ({screenshots.length})</h3>

      {screenshots.length === 0 ? (
        <p className="admin-hint">Abhi koi screenshot nahi hai.</p>
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