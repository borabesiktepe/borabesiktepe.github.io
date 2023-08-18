import React, { useState } from "react";
import { motion } from "framer-motion";
import "../artworks-page/artworks-page.css";
import artworksData from "../artworks-page/artworks.json";
import Menu from "../menu";
import { DarkModeSwitch } from "../darkmode";
import Showcase from "../showcase";

const ArtworksPage = () => {
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const openShowcase = (imageUrl) => {
    setSelectedArtwork(imageUrl);
  };

  const closeShowcase = () => {
    setSelectedArtwork(null);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav>
        <DarkModeSwitch></DarkModeSwitch>
        <Menu />
        <h1>BORA BEŞİKTEPE</h1>
      </nav>

      <section className="artworks-page">
        <div className="artworks-title">ARTWORKS</div>

        <div className="artworks-gallery">
          {artworksData.map((artwork, index) => (
            <div className="gallery-item" key={index} onClick={() => openShowcase(artwork.imageUrl)}>
              <img src={artwork.imageUrl} alt={`Artwork ${index}`} />
              <div className="item-info">
                <span>{artwork.date}</span>
                <span>{artwork.year}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      {selectedArtwork && <Showcase imageUrl={selectedArtwork} onClose={closeShowcase} />}
    </motion.div>
  );
};

export default ArtworksPage;
