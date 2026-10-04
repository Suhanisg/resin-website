import { useState, useEffect, useRef } from "react"

// 1x1 transparent pixel: jab tak image viewport mein nahi aati, broken-image icon na dikhe
const BLANK =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"

// <img> ki jagah use karein. className/style/alt waise hi kaam karenge,
// isliye aapki purani CSS (size, object-fit, border-radius) lagi rahegi.
// Image tabhi download hoti hai jab wo screen ke paas aaye, aur aate hi fade-in hoti hai.
function LazyImage({ src, alt = "", className, style, rootMargin = "200px 0px", ...rest }) {
  const [inView, setInView] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    const el = imgRef.current
    if (!el) return

    // Purane browsers: seedha load kar do
    if (typeof IntersectionObserver === "undefined") {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold: 0.01 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  // browser cache se turant aayi image ke liye
  useEffect(() => {
    const el = imgRef.current
    if (inView && el && el.complete && el.naturalWidth > 0) setLoaded(true)
  }, [inView])

  if (failed) return <div className={className} style={{ ...style, background: "#f3e6e8" }} />

  return (
    <img
      ref={imgRef}
      src={inView ? src : BLANK}
      alt={alt}
      className={className}
      decoding="async"
      onLoad={() => inView && setLoaded(true)}
      onError={() => inView && setFailed(true)}
      style={{
        ...style,
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.5s ease",
        background: "#f3e6e8", // loading ke time halka placeholder color
      }}
      {...rest}
    />
  )
}

export default LazyImage