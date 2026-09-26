import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import TopBar from "../components/TopBar"
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import AllProducts from "../components/AllProducts"
import FloralPage from "../components/floralPage"
import Footer from "../components/Footer"
import ReviewSection from "../components/ReviewSection"
import FaqSection from "../components/FaqSection"

function Home() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1)
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 150)
    }
  }, [location])

  return (
    <>
      <TopBar />
      <Navbar />
      <Hero />
      <AllProducts />
      <FloralPage />
      <FaqSection/>
      <ReviewSection/>
      <Footer />
    </>
  )
}

export default Home