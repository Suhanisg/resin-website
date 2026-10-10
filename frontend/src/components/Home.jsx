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
    if (!location.hash) return

    const id = location.hash.slice(1)
    const timers = []

    const scrollToSection = () => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "start" })
      }
    }

    // Page load hone ke dauraan kuch baar dobara scroll karo
   ;[100, 400, 900, 1600, 2500, 4000].forEach((delay) => {
      timers.push(setTimeout(scrollToSection, delay))
    })

    // Agar user khud scroll kare to auto-scroll band kar do
    const cancel = () => timers.forEach(clearTimeout)
    window.addEventListener("wheel", cancel, { once: true })
    window.addEventListener("touchmove", cancel, { once: true })

    return () => {
      cancel()
      window.removeEventListener("wheel", cancel)
      window.removeEventListener("touchmove", cancel)
    }
  }, [location])

  return (
    <>
      <TopBar />
      <Navbar />
      <main id="main-content">
        <Hero />
        <AllProducts />
        <FloralPage />
        <FaqSection />
        <ReviewSection />
      </main>
      <Footer />
    </>
  )
}

export default Home