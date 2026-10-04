import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { WishlistProvider } from './context/WishlistContext'
import ScrollToTop from './components/ScrollToTop'
import { ReviewsProvider } from './context/ReviewsContext'
import Home from './components/Home'
import PageLoader from './components/PageLoader'

// Ye pages tabhi download honge jab user inhe khole
const CategoryProducts = lazy(() => import('./components/CategoryProducts'))
const Wishlist = lazy(() => import('./components/Wishlist'))
const Reviews = lazy(() => import('./components/Reviews'))
const Testimonials = lazy(() => import('./pages/Testimonials'))
const RealReviews = lazy(() => import('./components/RealReviews'))
const FaqPage = lazy(() => import('./components/FaqPage'))
const AdminPanel = lazy(() => import('./pages/AdminPanel'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))

function App() {
  return (
    <AdminAuthProvider>
      <WishlistProvider>
        <ReviewsProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/category/:categoryName" element={
                  <>
                    <Navbar />
                    <CategoryProducts />
                    <Footer />
                  </>
                } />
                <Route path="/wishlist" element={
                  <>
                    <Navbar />
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
                    <Navbar />
                    <Reviews />
                    <Testimonials />
                    <RealReviews />
                    <Footer />
                  </>
                } />
                <Route path="/faq" element={
                  <>
                    <Navbar />
                    <FaqPage />
                    <Footer />
                  </>
                } />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ReviewsProvider>
      </WishlistProvider>
    </AdminAuthProvider>
  )
}

export default App