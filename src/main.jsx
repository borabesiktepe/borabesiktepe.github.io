import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { AnimatePresence } from 'framer-motion'

import { BrowserRouter } from 'react-router-dom'

import Routes from './pages/routes'
import './index.css'
import Loader from './components/loader'

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      // Small timeout to ensure smooth transition and avoid flash
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <>
      <AnimatePresence mode='wait'>
        {loading && <Loader key="loader" />}
      </AnimatePresence>
      <div style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s ease-in-out' }}>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </div>
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<App />);