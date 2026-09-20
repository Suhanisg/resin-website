import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AdminPanel from './pages/AdminPanel'
import CategoryProducts from './components/CategoryProducts'
import Wishlist from './components/Wishlist'
import { WishlistProvider } from './context/WishlistContext'
import ScrollToTop from './components/ScrollToTop'
import Reviews from './components/Reviews'
import Testimonials from './pages/Testimonials'
import RealReviews from './components/RealReviews'
import { ReviewsProvider } from './context/ReviewsContext'
import Home from './components/Home'   // 👈 path yahan components hai, pages nahi

function App() {
  return (
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
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/reviews" element={
              <>
                <Navbar/>
                <Reviews />
                <Testimonials />
                <RealReviews />
                <Footer />
              </>
            } />
          </Routes>
        </BrowserRouter>
      </ReviewsProvider>
    </WishlistProvider>
  )
}

export default App;