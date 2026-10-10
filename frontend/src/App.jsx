import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
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
                  <Layout><CategoryProducts /></Layout>
                } />

                <Route path="/wishlist" element={
                  <Layout><Wishlist /></Layout>
                } />

                <Route path="/reviews" element={
                  <Layout>
                    <Reviews />
                    <Testimonials />
                    <RealReviews />
                  </Layout>
                } />

                <Route path="/faq" element={
                  <Layout><FaqPage /></Layout>
                } />

                <Route path="/admin-login" element={
                  <main id="main-content"><AdminLogin /></main>
                } />

                <Route path="/admin" element={
                  <ProtectedAdminRoute>
                    <main id="main-content"><AdminPanel /></main>
                  </ProtectedAdminRoute>
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