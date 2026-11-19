# 🌸 Resin by Me

A soft, dreamy, handmade-feeling e-commerce website for a resin art business. Customers can browse varied resin art products by category, view them in a detailed product modal, and place orders or custom-order requests directly through WhatsApp.

**Live site:** https://resinbyme.vercel.app
**API:** https://resin-website.onrender.com

---

## ✨ Features

### For customers
- **Category & subcategory browsing**: products grouped by category, with subcategory chips (name + photo) to filter quickly
- **Product modal**: image gallery on the left, accordion-style details panel on the right
- **WhatsApp ordering**: order any product with one click via WhatsApp
- **Custom orders**: a "Custom Order" button flips the details panel (book-page-flip animation) into a custom-order form; submitted details are sent to the business WhatsApp number
- **Dreamy design**: blush and lilac palette, artsy and handmade vibe, fully responsive

### For the admin
- **Secure admin login**: JWT-based authentication (`/admin-login`)
- **Admin panel** (`/admin`): add, edit and delete products and categories
- **Subcategories**: create optional subcategories with a photo and assign products to them
- **Image uploads**: product images are stored on Cloudinary

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Auth | JSON Web Tokens (JWT) |
| Image storage | Cloudinary |
| Hosting | Vercel (frontend), Render (backend) |

---

## 📁 Project Structure

```
resin_art/
├── frontend/     # React + Vite app
└── backend/      # Node + Express API
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- A MongoDB database (local or MongoDB Atlas)
- A Cloudinary account

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd resin_art
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

# Admin login
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=a_long_random_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the server:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:5000
```

Start the app:
```bash
npm run dev
```

The site will be available at `http://localhost:5173`.

---

## 🔐 Admin Access

1. Go to `/admin-login`
2. Sign in with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` set in the backend environment variables
3. After login you can access `/admin` to manage products, categories and subcategories

> Never commit your `.env` files. Keep all secrets in environment variables.

---

## 🔌 API Overview

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/admin/login` | Admin login, returns JWT | Public |
| GET | `/api/...` | Fetch products, categories, subcategories | Public |
| POST/PUT/DELETE | `/api/...` | Manage products, categories, subcategories | Admin (JWT) |

> Update the endpoint paths above to match your final routes.

---

## ☁️ Deployment

- **Frontend:** deployed on Vercel. Set `VITE_API_URL` to the Render backend URL.
- **Backend:** deployed on Render. Add all backend environment variables (`MONGO_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET`, Cloudinary keys) in the Render dashboard.

---

## 🗺️ Roadmap

- [x] Product modal with gallery and accordion details
- [x] WhatsApp-based ordering
- [x] Admin panel with Cloudinary image uploads
- [x] JWT admin authentication
- [x] Subcategories with photos
- [ ] Custom order form with page-flip animation
- [ ] Auto-send custom order details to WhatsApp Business

---

## 👩‍💻 Author

**Suhani Goyal**
Full-Stack Web Developer (MERN)
Aligarh, Uttar Pradesh, India

---

Made with 💜 and a lot of resin.
