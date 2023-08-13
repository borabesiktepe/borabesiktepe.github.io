import React from 'react';
import "../artworks-page/artworks-page.css"
import artworksData from '../artworks-page/artworks.json';
import Menu from "../menu";
import {DarkModeSwitch} from '../darkmode';

const ArtworksPage = () => {

  return (
    <>
      <nav>
        <DarkModeSwitch></DarkModeSwitch>
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
                <span>{artwork.year}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );

};

export default ArtworksPage;
