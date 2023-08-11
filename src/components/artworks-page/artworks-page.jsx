import React from 'react';
import "../artworks-page/artworks-page.css"

import Menu from "../menu";

const ArtworksPage = () => {

  const imageUrls = [
    'https://cdna.artstation.com/p/assets/images/images/059/700/870/large/bora-besiktepe-309920803-1242645133253186-7848651775024215199-n.jpg?1676969907',
    'https://cdnb.artstation.com/p/assets/images/images/059/700/841/large/bora-besiktepe-243716927-591849758833509-4850822869558982970-n.jpg?1676969836',
    'https://cdna.artstation.com/p/assets/images/images/059/700/530/large/bora-besiktepe-185255469-518941912464951-334296113164757913-n.jpg?1676969406',
    'https://cdna.artstation.com/p/assets/images/images/059/700/634/large/bora-besiktepe-167278825-302211417991360-5320717863167325527-n.jpg?1676969539',
    'https://cdna.artstation.com/p/assets/images/images/059/700/764/large/bora-besiktepe-137269091-713051319415574-2780865654196107180-n.jpg?1676969732',
    'https://cdna.artstation.com/p/assets/images/images/059/700/462/large/bora-besiktepe-125891010-213217880206292-2947657047317913642-n.jpg?1676969288',
    'https://cdnb.artstation.com/p/assets/images/images/059/700/727/large/bora-besiktepe-123625057-1748570258633999-5545037860425334331-n.jpg?1676969673',
    'https://cdnb.artstation.com/p/assets/images/images/059/700/809/large/bora-besiktepe-121255888-1018205745270759-8621102770366216297-n.jpg?1676969786',
    'https://cdnb.artstation.com/p/assets/images/images/059/700/443/large/bora-besiktepe-107531353-713989812502318-4353869834234070874-n.jpg?1676969226',
    'https://cdna.artstation.com/p/assets/images/images/059/700/318/large/bora-besiktepe-90143153-516442732591379-6140912824639170032-n.jpg?1676968959',
    'https://cdnb.artstation.com/p/assets/images/images/059/700/409/large/bora-besiktepe-92293094-220960985635638-3489854601378050551-n.jpg?1676969151'
  ];

  return (
    <>
      <nav>
        <Menu />
        <h1>BORA BEŞİKTEPE</h1>
      </nav>

      <section class="artworks-page">
        <div className="artworks-title">
          ARTWORKS
        </div>

        <div className="artworks-gallery">
          {imageUrls.map((imageUrl, index) => (
            <div className="gallery-item" key={index}>
              <img src={imageUrl} alt={`Artwork ${index}`} />
            </div>
          ))}
        </div>
      </section>
    </>
  );

};

export default ArtworksPage;
