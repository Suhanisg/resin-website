import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AdminPanel from './pages/AdminPanel'
import AdminLogin from './pages/AdminLogin'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import { AdminAuthProvider } from './context/AdminAuthContext'
import CategoryProducts from './components/CategoryProducts'
import Wishlist from './components/Wishlist'
import { WishlistProvider } from './context/WishlistContext'
import ScrollToTop from './components/ScrollToTop'
import Reviews from './components/Reviews'
import Testimonials from './pages/Testimonials'
import RealReviews from './components/RealReviews'
import { ReviewsProvider } from './context/ReviewsContext'
import Home from './components/Home'   
import FaqPage from "./components/FaqPage"

function App() {
  return (
    <AdminAuthProvider>
      <WishlistProvider>
        <ReviewsProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/category/:categoryName" element={
                <>
                  <Navbar/>
                  <CategoryProducts />
                  <Footer />
                </>
              } />
              <Route path="/wishlist" element={
                <>
                  <Navbar/>
                  <Wishlist />
                  <Footer />
                </>
              } />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <ProtectedAdminRoute>
                  <AdminPanel />
                </ProtectedAdminRoute>
              } />
              <Route path="/reviews" element={
                <>
                  <Navbar/>
                  <Reviews />
                  <Testimonials />
                  <RealReviews />
                  <Footer />
                </>
              } />
              <Route path="/faq" element={
                <>
                  <Navbar/>
                  <FaqPage />
                  <Footer />
                </>
              } />
            </Routes>
          </BrowserRouter>
        </ReviewsProvider>
      </WishlistProvider>
    </AdminAuthProvider>
  )
}

export default App;