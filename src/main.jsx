import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { AnimatePresence } from 'framer-motion'

import { BrowserRouter } from 'react-router-dom'

import Routes from './pages/routes'
import './index.css'
import Loader from './components/loader'

export default function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulated progress logic
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev; // Stall at 90% until load complete
        const remaining = 90 - prev;
        const add = Math.ceil(remaining / 10);
        return prev + add;
      });
    }, 200);

    const handleLoad = () => {
      clearInterval(timer);
      setProgress(100);

      // Wait for 100% animation then finish
      setTimeout(() => {
        setLoading(false);
      }, 500);
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
        {loading && <Loader key="loader" progress={progress} />}
      </AnimatePresence>

      {!loading && (
        <div style={{ opacity: 1, transition: 'opacity 0.5s ease-in-out' }}>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </div>
      )}
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<App />);