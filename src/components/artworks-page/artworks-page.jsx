import React from 'react';
import "../artworks-page/artworks-page.css"

import Menu from "../menu";

const ArtworksPage = () => {

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

        <div class="artworks-gallery">
          <div class="gallery-item">
            <img src="https://cdna.artstation.com/p/assets/images/images/059/700/870/large/bora-besiktepe-309920803-1242645133253186-7848651775024215199-n.jpg?1676969907"
              alt=""></img>
          </div>
          <div class="gallery-item">
            <img src="https://cdnb.artstation.com/p/assets/images/images/059/700/841/large/bora-besiktepe-243716927-591849758833509-4850822869558982970-n.jpg?1676969836"
              alt="" srcset=""></img>
          </div>
          <div class="gallery-item">
            <img src="https://cdna.artstation.com/p/assets/images/images/059/700/530/large/bora-besiktepe-185255469-518941912464951-334296113164757913-n.jpg?1676969406"
              alt="" srcset=""></img>
          </div>
          <div class="gallery-item">
            <img src="https://cdna.artstation.com/p/assets/images/images/059/700/634/large/bora-besiktepe-167278825-302211417991360-5320717863167325527-n.jpg?1676969539"
              alt="" srcset=""></img>
          </div>
          <div class="gallery-item">
            <img src="https://cdna.artstation.com/p/assets/images/images/059/700/764/large/bora-besiktepe-137269091-713051319415574-2780865654196107180-n.jpg?1676969732"
              alt="" srcset=""></img>
          </div>
          <div class="gallery-item">
            <img src="https://cdna.artstation.com/p/assets/images/images/059/700/462/large/bora-besiktepe-125891010-213217880206292-2947657047317913642-n.jpg?1676969288"
              alt="" srcset=""></img>
          </div>
          <div class="gallery-item">
            <img src="https://cdnb.artstation.com/p/assets/images/images/059/700/727/large/bora-besiktepe-123625057-1748570258633999-5545037860425334331-n.jpg?1676969673"
              alt="" srcset=""></img>
          </div>
          <div class="gallery-item">
            <img src="https://cdnb.artstation.com/p/assets/images/images/059/700/809/large/bora-besiktepe-121255888-1018205745270759-8621102770366216297-n.jpg?1676969786"
              alt="" srcset=""></img>
          </div>

        </div>
      </section>
    </>
  );

};

export default ArtworksPage;
