import { useState } from 'react'
import { useReviews } from '../context/ReviewsContext'

function ReviewManager() {
  const { screenshots, addScreenshot, deleteScreenshot } = useReviews()
  const [file, setFile] = useState(null)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      addScreenshot({ photo: reader.result })
      setFile(null)
      e.target.reset()
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="admin-reviews-block">
      <h3>Add Customer Review</h3>
      <form onSubmit={handleAdd}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0] || null)}
          required
        />
        <button type="submit">Add Review</button>
      </form>

      <h4>Existing Reviews ({screenshots.length})</h4>
      <ul className="admin-review-list">
        {screenshots.map((s) => (
          <li key={s.id}>
            {s.photo && (
              <img
                src={s.photo}
                alt="review"
                width={50}
                height={70}
                style={{ objectFit: 'cover', borderRadius: 6 }}
              />
            )}
            <button onClick={() => deleteScreenshot(s.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ReviewManager