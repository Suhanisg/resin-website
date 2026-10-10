import Navbar from './Navbar'
import Footer from './Footer'

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  )
}

export default Layout