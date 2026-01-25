import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { AnimatePresence } from 'framer-motion'

import { BrowserRouter } from 'react-router-dom'

import Routes from './pages/routes'
import './index.css'
import Loader from './components/loader'
import { assetsToPreload } from './utils/assetList'

export default function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let loadedCount = 0;
    const totalAssets = assetsToPreload.length;

    // Minimum time to show loader (to avoid flash on super fast connections)
    const minTimePromise = new Promise(resolve => setTimeout(resolve, 2000));

    const imagePromises = assetsToPreload.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedCount++;
          // Update progress based on actual loaded count
          setProgress(Math.round((loadedCount / totalAssets) * 100));
          resolve();
        };
        img.onerror = () => {
          // Determine if we should fail or just continue. 
          // Using resolve to continue even if one image fails.
          loadedCount++;
          setProgress(Math.round((loadedCount / totalAssets) * 100));
          resolve();
        };
      });
    });

    Promise.all([Promise.all(imagePromises), minTimePromise])
      .then(() => {
        setProgress(100);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      });

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