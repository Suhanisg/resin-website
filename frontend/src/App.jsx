import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TopBar from './components/TopBar'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'
import AdminPanel from './pages/AdminPanel'
import AllProducts from './components/AllProducts'
import CategoryProducts from './components/CategoryProducts'
import Wishlist from './components/Wishlist'
import { WishlistProvider } from './context/WishlistContext'
import FloralPage from './components/floralPage'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <WishlistProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={
            <>
            <TopBar/>
            <Navbar/>
              <Hero />
               <AllProducts />
              <FloralPage />
              <Footer />
            </>
          } />
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
        </Routes>
      </BrowserRouter>
    </WishlistProvider>
  )
}

export default App;