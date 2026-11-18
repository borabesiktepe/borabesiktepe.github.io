import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { AnimatePresence } from 'framer-motion'

import { BrowserRouter } from 'react-router-dom'

import Routes from './pages/routes'
import './index.css'
import Loader from './components/loader'
import SiteHeader from './components/site-header'
import { FEATURED, HOME_SIZES, artImage } from './utils/art'

// The loader shows for at least MIN_MS so it never flashes, and at most MAX_MS
// so a slow connection still reaches the site; images still loading then
// simply finish on the page.
const MIN_MS = 2000
const MAX_MS = 5000

// Load each home image the same way the page will ask for it (same srcset and
// sizes), so the browser picks the same file and the page finds it cached.
const preload = (path) =>
  new Promise((resolve) => {
    const { src, srcSet } = artImage(path)
    const img = new Image()
    img.onload = img.onerror = resolve
    if (srcSet) {
      img.sizes = HOME_SIZES
      img.srcset = srcSet
    }
    img.src = src
  })

// The /lab test page shows the home hero many times in iframes; skip the
// loader there.
const IS_LAB = window.location.pathname.replace(/\/+$/, '') === '/lab'

export default function App() {
  const [loading, setLoading] = useState(!IS_LAB)
  const [progress, setProgress] = useState(0)
  // The site mounts only once the loader has fully gone, so the home page's
  // entrance starts on a clear screen instead of under the loader.
  const [ready, setReady] = useState(IS_LAB)

  useEffect(() => {
    if (IS_LAB) return
    let loaded = 0
    const images = Promise.all(
      FEATURED.map((path) =>
        preload(path).then(() => {
          loaded++
          setProgress(Math.round((loaded / FEATURED.length) * 100))
        })
      )
    )
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

    let timer
    Promise.race([Promise.all([images, wait(MIN_MS)]), wait(MAX_MS)]).then(() => {
      setProgress(100)
      timer = setTimeout(() => setLoading(false), 500)
    })
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <AnimatePresence onExitComplete={() => setReady(true)}>
        {loading && <Loader key="loader" progress={progress} />}
      </AnimatePresence>

      {ready && (
        <BrowserRouter>
          <SiteHeader />
          <Routes />
        </BrowserRouter>
      )}
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<App />);
