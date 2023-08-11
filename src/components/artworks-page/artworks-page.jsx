import React from 'react';
import "../artworks-page/artworks-page.css"
import artworksData from '../artworks-page/artworks.json';
import Menu from "../menu";

const ArtworksPage = () => {

  return (
    <>
      <nav>
        <Menu />
        <h1>BORA BEŞİKTEPE</h1>
      </nav>

      <section className="artworks-page">
        <div className="artworks-title">
          ARTWORKS
        </div>

        <div className="artworks-gallery">
          {artworksData.map((artwork, index) => (
            <div className="gallery-item" key={index}>
              <img src={artwork.imageUrl} alt={`Artwork ${index}`} />

              <div className="item-info">
                <span>{artwork.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );

};

export default ArtworksPage;
