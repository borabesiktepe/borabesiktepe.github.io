import React from "react";
import { useState, useEffect } from "react";

function Artworks () {
    return (
        <div className="artworks">
            <div className="artwork-item">
                <ImageWithLoading src="/art/NOfW88G.png" alt="Artwork1"></ImageWithLoading>
            </div>
            <div className="artwork-item">
                <ImageWithLoading src="/art/wxcZzVd.png" alt="Artwork2"></ImageWithLoading>
            </div>
            <div className="artwork-item">
                <ImageWithLoading src="/art/EV7wJGa.png" alt="Artwork3"></ImageWithLoading>
            </div>
            <div className="artwork-item">
                <ImageWithLoading src="/art/mTkh2tz.png" alt="Artwork4"></ImageWithLoading>
            </div>
            <div className="artwork-item">
                <ImageWithLoading src="/art/S6Gf6so.png" alt="Artwork5"></ImageWithLoading>
            </div>
        </div>
    )
}


  
  const ImageWithLoading = ({ src, alt }) => {
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const img = new Image();
      img.src = src;
      img.onload = () => setLoading(false); // This is called when the image has finished loading
    }, [src]);
  
    return (
      <>
        {loading ? (
          <div></div>
        ) : (
          <img src={src} alt={alt} />
        )}
      </>
    );
  };

export default Artworks;