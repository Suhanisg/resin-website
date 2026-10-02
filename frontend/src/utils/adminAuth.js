export const API_URL =
  import.meta.env.VITE_API_URL || "https://resin-website.onrender.com"

const TOKEN_KEY = "adminToken"

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

// Token ka expiry time nikalta hai (milliseconds mein), galat token par null
export const getTokenExpiry = (token = getToken()) => {
  if (!token) return null
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
    const payload = JSON.parse(atob(base64))
    return payload.exp ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

export const isTokenValid = (token = getToken()) => {
  const expiry = getTokenExpiry(token)
  return !!expiry && expiry > Date.now()
}

// Protected admin requests ke liye. fetch() jaisa hi hai, bas path dena hai
// Example: adminFetch("/api/products", { method: "POST", body: formData })
export const adminFetch = async (path, options = {}) => {
  const token = getToken()
  const isFormData = options.body instanceof FormData

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  })

  if (res.status === 401) {
    clearToken()
    window.location.href = "/admin-login"
    throw new Error("Session expired")
  }

  return res
}