import { Navigate } from "react-router-dom"
import { useAdminAuth } from "../context/AdminAuthContext"
import { isTokenValid } from "../utils/adminAuth"

function ProtectedAdminRoute({ children }) {
  const { isAuthenticated } = useAdminAuth()

  if (!isAuthenticated || !isTokenValid()) {
    return <Navigate to="/admin-login" replace />
  }

  return children
}

export default ProtectedAdminRoute