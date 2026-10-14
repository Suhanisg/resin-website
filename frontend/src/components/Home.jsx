import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import TopBar from "../components/TopBar"
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import DiwaliHero from "../diwali/diwaliPage"
import DiwaliLine from "../diwali/DiwaliLine"
import "../diwali/DiwaliLine.css"
import AllProducts from "../components/AllProducts"
import FloralPage from "../components/floralPage"
import Footer from "../components/Footer"
import ReviewSection from "../components/ReviewSection"
import FaqSection from "../components/FaqSection"

const isDiwali = true // Diwali ke baad false kar dena

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

    ;[100, 400, 900, 1600, 2500, 4000].forEach((delay) => {
      timers.push(setTimeout(scrollToSection, delay))
    })

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
        {isDiwali ? (
          <>
            <DiwaliHero />
            <DiwaliLine />
            <div className="diwali-bg">
              <AllProducts />
            </div>
          </>
        ) : (
          <>
            <Hero />
            <AllProducts />
          </>
        )}
        <FloralPage />
        <FaqSection />
        <ReviewSection />
      </main>
      <Footer />
    </>
  )
}

export default Home