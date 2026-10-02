import { createContext, useContext, useEffect, useState, useCallback } from "react"
import {
  API_URL,
  setToken,
  clearToken,
  isTokenValid,
  getTokenExpiry,
} from "../utils/adminAuth"

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(isTokenValid())

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.message || "Login failed")

    setToken(data.token)
    setIsAuthenticated(true)
  }

  const logout = useCallback(() => {
    clearToken()
    setIsAuthenticated(false)
  }, [])

  // Token expire hote hi apne aap logout
  useEffect(() => {
    if (!isAuthenticated) return
    const expiry = getTokenExpiry()
    if (!expiry) return logout()

    const timeLeft = expiry - Date.now()
    if (timeLeft <= 0) return logout()

    const timer = setTimeout(logout, Math.min(timeLeft, 2147483647))
    return () => clearTimeout(timer)
  }, [isAuthenticated, logout])

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => useContext(AdminAuthContext)