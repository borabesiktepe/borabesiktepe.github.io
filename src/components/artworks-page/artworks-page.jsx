import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  const animState = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.7 } }, // Specify a duration for the exit animation
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav>
        <DarkModeSwitch />
        <Menu />
        <h1>BORA BEŞİKTEPE</h1>
      </nav>

      <section className="artworks-page">
        <div className="artworks-title">ARTWORKS</div>

        <div className="artworks-gallery">
          {artworksData.map((artwork, index) => (
            <motion.div
              className="gallery-item"
              key={index}
              onClick={() => openShowcase(artwork.imageUrl)}
              variants={animState}
              initial="initial"
              whileInView="animate"
              exit="exit"
              transition="transition"
              viewport={{ once: true }}
            >
              <img src={artwork.imageUrl} alt={`Artwork ${index}`} />
              <div className="item-info">
                <span>{artwork.date}</span>
                <span>{artwork.year}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      <AnimatePresence>
        {selectedArtwork && (
          <Showcase
            imageUrl={selectedArtwork}
            onClose={closeShowcase}
            key={selectedArtwork} // Make sure to provide a unique key
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ArtworksPage;
